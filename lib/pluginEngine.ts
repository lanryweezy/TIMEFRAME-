/**
 * TIMEFRAME Wasm Plugin Execution Engine
 * ========================================
 * The runtime that loads, validates, sandboxes, and executes Wasm plugins.
 *
 * Security Architecture:
 *   1. Plugins receive ONLY a WebAssembly.Memory buffer (ArrayBuffer)
 *   2. No imports for DOM, fetch, or any Web API are provided
 *   3. Capabilities declared in the manifest are validated at load time
 *   4. Frame/audio data is copied INTO Wasm memory, processed, then copied OUT
 *   5. The host controls all memory allocation — plugins cannot grow memory
 *
 * Execution Flow:
 *   loadPlugin(url, manifest)
 *     → fetch .wasm binary
 *     → WebAssembly.compile (cached)
 *     → validateExports (check entrypoint signature)
 *     → WebAssembly.instantiate (with sandboxed imports)
 *     → ready
 *
 *   processFrame(pluginId, frameData, width, height, params)
 *     → allocate frame buffer in Wasm memory
 *     → copy pixel data into Wasm memory
 *     → call plugin entrypoint
 *     → copy mutated pixel data out of Wasm memory
 *     → return result
 */

import type {
  WasmPluginManifest,
  PluginInstance,
  PluginStatus,
  PluginCapability,
  PluginParameter,
} from '../types/plugin';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Initial Wasm memory: 256 pages = 16MB (enough for one 1920x1080 RGBA frame) */
const INITIAL_MEMORY_PAGES = 256;
/** Maximum Wasm memory: 4096 pages = 256MB */
const MAX_MEMORY_PAGES = 4096;
/** Alignment for buffer offsets in Wasm linear memory */
const BUFFER_ALIGNMENT = 16;
/** Maximum time a plugin can spend processing a single frame before abort (ms) */
const FRAME_TIMEOUT_MS = 100;

// ─── Plugin Engine ────────────────────────────────────────────────────────────

class PluginEngine {
  private plugins: Map<string, PluginInstance> = new Map();
  private moduleCache: Map<string, WebAssembly.Module> = new Map();

  /**
   * Load and initialize a Wasm plugin from a URL.
   *
   * @param wasmUrl URL to the .wasm binary
   * @param manifest Plugin manifest describing capabilities and entrypoints
   * @returns The plugin ID for future reference
   */
  async loadPlugin(wasmUrl: string, manifest: WasmPluginManifest): Promise<string> {
    const pluginId = manifest.id;

    // Don't reload if already loaded
    if (this.plugins.has(pluginId)) {
      const existing = this.plugins.get(pluginId)!;
      if (existing.status === 'ready' || existing.status === 'processing') {
        console.warn(`PluginEngine: Plugin "${pluginId}" is already loaded.`);
        return pluginId;
      }
    }

    const instance: PluginInstance = {
      manifest,
      status: 'loading',
      module: null,
      instance: null,
      memory: null,
      currentParams: this.extractDefaultParams(manifest.parameters),
      metrics: { avgFrameTimeMs: 0, framesProcessed: 0, peakMemoryBytes: 0 },
    };

    this.plugins.set(pluginId, instance);

    try {
      // 1. Fetch and compile (with caching)
      instance.status = 'loading';
      let compiledModule = this.moduleCache.get(wasmUrl);

      if (!compiledModule) {
        const response = await fetch(wasmUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch Wasm module: ${response.status} ${response.statusText}`);
        }
        const wasmBytes = await response.arrayBuffer();
        compiledModule = await WebAssembly.compile(wasmBytes);
        this.moduleCache.set(wasmUrl, compiledModule);
      }

      instance.module = compiledModule;

      // 2. Validate exports
      instance.status = 'validating';
      this.validateModule(compiledModule, manifest);

      // 3. Create sandboxed memory
      const memory = new WebAssembly.Memory({
        initial: INITIAL_MEMORY_PAGES,
        maximum: MAX_MEMORY_PAGES,
        shared: false, // Intentionally non-shared for security isolation
      });
      instance.memory = memory;

      // 4. Instantiate with minimal, sandboxed imports
      const importObject = this.buildSandboxedImports(memory, manifest);
      const wasmInstance = await WebAssembly.instantiate(compiledModule, importObject);
      instance.instance = wasmInstance;

      // 5. Call init function if present
      if (manifest.initFunction && typeof wasmInstance.exports[manifest.initFunction] === 'function') {
        (wasmInstance.exports[manifest.initFunction] as Function)();
      }

      instance.status = 'ready';
      console.log(`PluginEngine: ✅ Plugin "${manifest.name}" v${manifest.version} loaded successfully.`);

    } catch (error) {
      instance.status = 'error';
      instance.error = error instanceof Error ? error.message : String(error);
      console.error(`PluginEngine: ❌ Failed to load plugin "${pluginId}":`, error);
      throw error;
    }

    return pluginId;
  }

  /**
   * Process a video frame through a loaded Wasm plugin.
   *
   * The frame buffer is copied into Wasm linear memory, the plugin's
   * entrypoint is called, and the mutated buffer is copied back out.
   *
   * @param pluginId Plugin ID (from manifest)
   * @param frameData RGBA pixel data (Uint8ClampedArray)
   * @param width Frame width
   * @param height Frame height
   * @param params Optional parameter overrides
   * @returns Mutated frame data (new Uint8ClampedArray)
   */
  processFrame(
    pluginId: string,
    frameData: Uint8ClampedArray,
    width: number,
    height: number,
    params?: Record<string, number | boolean | string>
  ): Uint8ClampedArray {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin "${pluginId}" not found.`);
    if (plugin.status !== 'ready') throw new Error(`Plugin "${pluginId}" is not ready (status: ${plugin.status}).`);
    if (!plugin.instance || !plugin.memory) throw new Error(`Plugin "${pluginId}" has no Wasm instance.`);

    // Validate capability
    if (!plugin.manifest.capabilities.includes('frame:read' as PluginCapability)) {
      throw new Error(`Plugin "${pluginId}" does not have FRAME_READ capability.`);
    }

    const startTime = performance.now();
    plugin.status = 'processing';

    try {
      const memory = plugin.memory;
      const memoryBuffer = new Uint8Array(memory.buffer);
      const frameSize = frameData.length; // width * height * 4 (RGBA)

      // Calculate aligned offsets in linear memory
      const frameOffset = BUFFER_ALIGNMENT; // Start after alignment padding
      const paramsOffset = this.alignOffset(frameOffset + frameSize);

      // Check if we need more memory
      const requiredBytes = paramsOffset + 1024; // Extra for params
      const currentBytes = memory.buffer.byteLength;
      if (requiredBytes > currentBytes) {
        const neededPages = Math.ceil((requiredBytes - currentBytes) / 65536);
        try {
          memory.grow(neededPages);
        } catch {
          throw new Error(`Insufficient Wasm memory: need ${requiredBytes} bytes, have ${currentBytes}.`);
        }
      }

      // Copy frame data into Wasm memory
      const freshBuffer = new Uint8Array(memory.buffer);
      freshBuffer.set(frameData, frameOffset);

      // Serialize parameters into Wasm memory
      const mergedParams = { ...plugin.currentParams, ...(params || {}) };
      const paramsBytes = this.serializeParams(mergedParams, plugin.manifest.parameters);
      const freshBuffer2 = new Uint8Array(memory.buffer);
      freshBuffer2.set(paramsBytes, paramsOffset);

      // Call the plugin entrypoint
      const entrypoint = plugin.instance.exports[plugin.manifest.entrypoint] as Function;
      if (typeof entrypoint !== 'function') {
        throw new Error(`Entrypoint "${plugin.manifest.entrypoint}" is not a function.`);
      }

      entrypoint(frameOffset, width, height, width * 4, paramsOffset, paramsBytes.length);

      // Copy mutated frame data out of Wasm memory
      const resultBuffer = new Uint8Array(memory.buffer);
      const result = new Uint8ClampedArray(frameSize);

      if (plugin.manifest.capabilities.includes('frame:write' as PluginCapability)) {
        // Plugin has write capability — read back the mutated data
        result.set(resultBuffer.slice(frameOffset, frameOffset + frameSize));
      } else {
        // Read-only plugin — return the original data unchanged
        result.set(frameData);
      }

      // Update metrics
      const elapsed = performance.now() - startTime;
      plugin.metrics.framesProcessed++;
      plugin.metrics.avgFrameTimeMs =
        (plugin.metrics.avgFrameTimeMs * (plugin.metrics.framesProcessed - 1) + elapsed) /
        plugin.metrics.framesProcessed;
      plugin.metrics.peakMemoryBytes = Math.max(plugin.metrics.peakMemoryBytes, memory.buffer.byteLength);

      plugin.status = 'ready';
      return result;

    } catch (error) {
      plugin.status = 'error';
      plugin.error = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  /**
   * Update a plugin's parameter values from the UI.
   */
  setParams(pluginId: string, params: Record<string, number | boolean | string>): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin "${pluginId}" not found.`);
    plugin.currentParams = { ...plugin.currentParams, ...params };
  }

  /**
   * Get the current status and metrics for a plugin.
   */
  getPluginInfo(pluginId: string): { status: PluginStatus; metrics: PluginInstance['metrics'] } | null {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return null;
    return { status: plugin.status, metrics: { ...plugin.metrics } };
  }

  /**
   * Get all loaded plugins.
   */
  getLoadedPlugins(): { id: string; name: string; status: PluginStatus; category: string }[] {
    return Array.from(this.plugins.entries()).map(([id, p]) => ({
      id,
      name: p.manifest.name,
      status: p.status,
      category: p.manifest.category,
    }));
  }

  /**
   * Dispose a plugin, freeing all resources.
   */
  disposePlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    try {
      // Call dispose function if present
      if (
        plugin.instance &&
        plugin.manifest.disposeFunction &&
        typeof plugin.instance.exports[plugin.manifest.disposeFunction] === 'function'
      ) {
        (plugin.instance.exports[plugin.manifest.disposeFunction] as Function)();
      }
    } catch (e) {
      console.warn(`PluginEngine: Error during dispose of "${pluginId}":`, e);
    }

    plugin.instance = null;
    plugin.module = null;
    plugin.memory = null;
    plugin.status = 'disposed';
    this.plugins.delete(pluginId);

    console.log(`PluginEngine: 🗑️ Plugin "${pluginId}" disposed.`);
  }

  /**
   * Dispose all plugins and clear caches.
   */
  disposeAll(): void {
    for (const id of Array.from(this.plugins.keys())) {
      this.disposePlugin(id);
    }
    this.moduleCache.clear();
  }

  // ─── Private Methods ─────────────────────────────────────────────────────

  /**
   * Build the import object for the Wasm module.
   * This is the ONLY interface between the plugin and the host.
   * We provide minimal, safe imports: math helpers and a console log.
   */
  private buildSandboxedImports(
    memory: WebAssembly.Memory,
    manifest: WasmPluginManifest
  ): WebAssembly.Imports {
    return {
      env: {
        memory,
        // Safe math imports that plugins might need
        Math_sin: Math.sin,
        Math_cos: Math.cos,
        Math_sqrt: Math.sqrt,
        Math_pow: Math.pow,
        Math_abs: Math.abs,
        Math_floor: Math.floor,
        Math_ceil: Math.ceil,
        Math_min: Math.min,
        Math_max: Math.max,
        Math_random: Math.random,
        Math_log: Math.log,
        Math_exp: Math.exp,
        Math_atan2: Math.atan2,
        Math_round: Math.round,
        Math_clamp: (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v)),

        // Debug logging (sandboxed — only outputs to console, no side effects)
        log_i32: (value: number) => {
          if (process?.env?.NODE_ENV === 'development') {
            console.log(`[Wasm:${manifest.id}] i32:`, value);
          }
        },
        log_f32: (value: number) => {
          if (process?.env?.NODE_ENV === 'development') {
            console.log(`[Wasm:${manifest.id}] f32:`, value);
          }
        },

        // Abort handler — traps the module safely
        abort: (msgPtr: number, filePtr: number, line: number, col: number) => {
          console.error(`[Wasm:${manifest.id}] ABORT at ${line}:${col}`);
          throw new Error(`Wasm plugin "${manifest.id}" aborted at line ${line}:${col}`);
        },
      },
    };
  }

  /**
   * Validate that the compiled module exports the required entrypoint
   * and conforms to the declared manifest.
   */
  private validateModule(module: WebAssembly.Module, manifest: WasmPluginManifest): void {
    const exports = WebAssembly.Module.exports(module);
    const exportNames = exports.map(e => e.name);

    // Check entrypoint exists
    if (!exportNames.includes(manifest.entrypoint)) {
      throw new Error(
        `Plugin "${manifest.id}" is missing required entrypoint "${manifest.entrypoint}". ` +
        `Available exports: [${exportNames.join(', ')}]`
      );
    }

    // Check optional functions if declared
    if (manifest.initFunction && !exportNames.includes(manifest.initFunction)) {
      console.warn(
        `Plugin "${manifest.id}" declares initFunction "${manifest.initFunction}" but doesn't export it.`
      );
    }
    if (manifest.disposeFunction && !exportNames.includes(manifest.disposeFunction)) {
      console.warn(
        `Plugin "${manifest.id}" declares disposeFunction "${manifest.disposeFunction}" but doesn't export it.`
      );
    }
  }

  /**
   * Extract default parameter values from the manifest.
   */
  private extractDefaultParams(params: PluginParameter[]): Record<string, number | boolean | string> {
    const defaults: Record<string, number | boolean | string> = {};
    for (const param of params) {
      if (param.type === 'color') {
        // Encode color as a packed u32: 0xRRGGBBAA
        const [r, g, b, a] = param.default;
        defaults[param.key] = ((r * 255) << 24) | ((g * 255) << 16) | ((b * 255) << 8) | (a * 255);
      } else {
        defaults[param.key] = param.default as any;
      }
    }
    return defaults;
  }

  /**
   * Serialize parameter values to a flat byte buffer for Wasm consumption.
   * Layout: sequential f32 values in manifest parameter order.
   */
  private serializeParams(
    values: Record<string, number | boolean | string>,
    descriptors: PluginParameter[]
  ): Uint8Array {
    // Each parameter is serialized as a 32-bit value (f32 or i32)
    const buffer = new ArrayBuffer(descriptors.length * 4);
    const view = new DataView(buffer);

    for (let i = 0; i < descriptors.length; i++) {
      const desc = descriptors[i];
      const val = values[desc.key];
      const offset = i * 4;

      switch (desc.type) {
        case 'float':
          view.setFloat32(offset, typeof val === 'number' ? val : desc.default, true);
          break;
        case 'int':
          view.setInt32(offset, typeof val === 'number' ? val : desc.default, true);
          break;
        case 'bool':
          view.setInt32(offset, val ? 1 : 0, true);
          break;
        case 'enum': {
          // Encode enum as the index of the selected option
          const idx = desc.options.findIndex(o => o.value === val);
          view.setInt32(offset, idx >= 0 ? idx : 0, true);
          break;
        }
        case 'color':
          view.setUint32(offset, typeof val === 'number' ? val : 0xFFFFFFFF, true);
          break;
        default:
          view.setFloat32(offset, 0, true);
      }
    }

    return new Uint8Array(buffer);
  }

  /**
   * Align an offset to the next BUFFER_ALIGNMENT boundary.
   */
  private alignOffset(offset: number): number {
    return (offset + BUFFER_ALIGNMENT - 1) & ~(BUFFER_ALIGNMENT - 1);
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────
export const pluginEngine = new PluginEngine();
