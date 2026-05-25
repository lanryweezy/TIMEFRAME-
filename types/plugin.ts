/**
 * TIMEFRAME Wasm Plugin API — Type Definitions
 * ==============================================
 * This is the contract between TIMEFRAME Studio and third-party plugin developers.
 *
 * Architecture:
 *   Plugin Wasm Module
 *       ↓
 *   ArrayBuffer Sandbox (capability-gated)
 *       ↓
 *   TIMEFRAME Render Graph Node
 *
 * Security Model:
 *   - Wasm modules receive ONLY ArrayBuffer views of frame/audio data
 *   - No DOM access, no Network access, no File System access
 *   - Capabilities are declared in the manifest and validated at load time
 *   - Modules that request undeclared capabilities are rejected
 */

// ─── Capability Enum ──────────────────────────────────────────────────────────
// Each capability gates access to a specific resource type.
// Plugins MUST declare all required capabilities in their manifest.
// The runtime will reject any module that attempts to use undeclared capabilities.

export enum PluginCapability {
  /** Read pixel data from the current frame (RGBA Uint8ClampedArray) */
  FRAME_READ = 'frame:read',
  /** Write mutated pixel data back to the frame buffer */
  FRAME_WRITE = 'frame:write',
  /** Read audio sample data (Float32Array, interleaved or planar) */
  AUDIO_READ = 'audio:read',
  /** Write mutated audio sample data back to the audio buffer */
  AUDIO_WRITE = 'audio:write',
  /** Read clip metadata (duration, fps, resolution, timecode) */
  METADATA_READ = 'metadata:read',
  /** Access previous frame data for temporal effects (motion blur, denoising) */
  TEMPORAL_READ = 'temporal:read',
  /** Read LUT / lookup table data */
  LUT_READ = 'lut:read',
}

// ─── Plugin Parameter Descriptors ─────────────────────────────────────────────
// These drive automatic UI generation in the inspector panel.
// The runtime reads these to build sliders, toggles, color pickers, and dropdowns
// without the plugin needing to ship any UI code.

export type PluginParameterType = 'float' | 'int' | 'bool' | 'color' | 'enum' | 'string';

export interface PluginParameterBase {
  /** Unique key used in the params record passed to the Wasm module */
  key: string;
  /** Human-readable label for the inspector UI */
  label: string;
  /** Type discriminator */
  type: PluginParameterType;
  /** Optional tooltip description */
  description?: string;
  /** Optional group name for organizing parameters in the inspector */
  group?: string;
}

export interface FloatParameter extends PluginParameterBase {
  type: 'float';
  default: number;
  min: number;
  max: number;
  step: number;
}

export interface IntParameter extends PluginParameterBase {
  type: 'int';
  default: number;
  min: number;
  max: number;
}

export interface BoolParameter extends PluginParameterBase {
  type: 'bool';
  default: boolean;
}

export interface ColorParameter extends PluginParameterBase {
  type: 'color';
  /** Default color as [r, g, b, a] normalized 0–1 */
  default: [number, number, number, number];
}

export interface EnumParameter extends PluginParameterBase {
  type: 'enum';
  options: { value: string; label: string }[];
  default: string;
}

export interface StringParameter extends PluginParameterBase {
  type: 'string';
  default: string;
  maxLength?: number;
}

export type PluginParameter =
  | FloatParameter
  | IntParameter
  | BoolParameter
  | ColorParameter
  | EnumParameter
  | StringParameter;

// ─── Plugin Manifest ──────────────────────────────────────────────────────────
// Every .wasm plugin ships with a manifest (JSON sidecar or embedded).
// The manifest declares identity, capabilities, parameters, and entrypoints.

export interface WasmPluginManifest {
  /** Unique plugin identifier (reverse-domain, e.g. "com.timeframe.invert") */
  id: string;
  /** Human-readable plugin name */
  name: string;
  /** SemVer version string */
  version: string;
  /** Plugin author or organization */
  author: string;
  /** Brief description of what this plugin does */
  description: string;
  /** Category for marketplace organization */
  category: PluginCategory;
  /** Required capabilities — the sandbox will only provide these resources */
  capabilities: PluginCapability[];
  /** Parameter descriptors for auto-generated UI */
  parameters: PluginParameter[];
  /** Name of the exported Wasm function for per-frame processing */
  entrypoint: string;
  /** Optional: name of the exported Wasm function for initialization */
  initFunction?: string;
  /** Optional: name of the exported Wasm function for cleanup/disposal */
  disposeFunction?: string;
  /** Minimum TIMEFRAME Studio version required */
  minHostVersion?: string;
  /** Preview thumbnail URL for the marketplace */
  thumbnailUrl?: string;
  /** Tags for search and discovery */
  tags?: string[];
}

export type PluginCategory =
  | 'color'
  | 'blur'
  | 'distortion'
  | 'generate'
  | 'temporal'
  | 'audio'
  | 'analysis'
  | 'utility';

// ─── Wasm Module Signatures ───────────────────────────────────────────────────
// These define the expected exported function signatures from the Wasm module.
// The plugin engine validates that the loaded module conforms to these.

/**
 * Frame processing context passed to the Wasm module.
 * The module receives a pointer to pixel data in linear memory
 * along with dimensions and the current parameter values.
 */
export interface FrameProcessingContext {
  /** Pointer offset into Wasm linear memory where RGBA pixel data starts */
  pixelDataPtr: number;
  /** Frame width in pixels */
  width: number;
  /** Frame height in pixels */
  height: number;
  /** Bytes per row (may include padding for alignment) */
  stride: number;
  /** Current frame index in the clip */
  frameIndex: number;
  /** Current time in seconds */
  time: number;
  /** Pointer offset into Wasm linear memory where parameter data starts */
  paramsPtr: number;
  /** Size of parameter data in bytes */
  paramsSize: number;
}

/**
 * Audio processing context.
 */
export interface AudioProcessingContext {
  /** Pointer offset into Wasm linear memory where audio samples start */
  sampleDataPtr: number;
  /** Number of audio samples */
  sampleCount: number;
  /** Number of channels (1 = mono, 2 = stereo) */
  channelCount: number;
  /** Sample rate in Hz */
  sampleRate: number;
  /** Current time in seconds */
  time: number;
  /** Pointer offset for parameters */
  paramsPtr: number;
  /** Size of parameter data in bytes */
  paramsSize: number;
}

// ─── Plugin Instance State ────────────────────────────────────────────────────
// Runtime state tracked by the plugin engine for each loaded plugin.

export type PluginStatus =
  | 'unloaded'
  | 'loading'
  | 'validating'
  | 'ready'
  | 'processing'
  | 'error'
  | 'disposed';

export interface PluginInstance {
  /** The manifest that describes this plugin */
  manifest: WasmPluginManifest;
  /** Current lifecycle status */
  status: PluginStatus;
  /** The compiled Wasm module (cached for re-instantiation) */
  module: WebAssembly.Module | null;
  /** The live Wasm instance with exported functions */
  instance: WebAssembly.Instance | null;
  /** Shared linear memory used for buffer exchange */
  memory: WebAssembly.Memory | null;
  /** Current parameter values set by the user */
  currentParams: Record<string, number | boolean | string>;
  /** Error message if status is 'error' */
  error?: string;
  /** Performance metrics */
  metrics: {
    /** Average frame processing time in ms */
    avgFrameTimeMs: number;
    /** Total frames processed */
    framesProcessed: number;
    /** Peak memory usage in bytes */
    peakMemoryBytes: number;
  };
}

// ─── Plugin Registry Types ────────────────────────────────────────────────────
// For the future marketplace / plugin discovery system.

export interface PluginRegistryEntry {
  manifest: WasmPluginManifest;
  /** URL to the .wasm binary */
  wasmUrl: string;
  /** Download count */
  downloads: number;
  /** Average rating (0-5) */
  rating: number;
  /** Whether this is a verified/official plugin */
  verified: boolean;
  /** Date added to registry */
  publishedAt: string;
}
