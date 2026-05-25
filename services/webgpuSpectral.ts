/**
 * WebGPU Compute Shader for Spectral Analysis
 * Performs high-speed FFT and spectral heatmap generation on the GPU.
 */

export const SPECTRAL_COMPUTE_SHADER = `
struct Params {
  fftSize: u32,
  sampleRate: f32,
  intensity: f32,
};

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> inputBuffer: array<f32>;
@group(0) @binding(2) var<storage, read_write> outputSpectrogram: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let k = global_id.x;
  let N = params.fftSize;
  
  if (k >= N) { return; }

  var real_sum: f32 = 0.0;
  var imag_sum: f32 = 0.0;

  let PI: f32 = 3.141592653589793;
  let angle_factor: f32 = 2.0 * PI * f32(k) / f32(N);

  for (var n: u32 = 0u; n < N; n = n + 1u) {
    let sample = inputBuffer[n];
    let angle = angle_factor * f32(n);
    real_sum = real_sum + sample * cos(angle);
    imag_sum = imag_sum - sample * sin(angle);
  }

  let magnitude = sqrt(real_sum * real_sum + imag_sum * imag_sum) * params.intensity;

  // Output true spectral magnitude to the visualization buffer
  outputSpectrogram[k] = magnitude;
}
`;

export class WebGPUSpectralAnalyzer {
    private device: GPUDevice;
    private pipeline: GPUComputePipeline;
    private paramsBuffer: GPUBuffer;
    private inputBuffer: GPUBuffer;
    private outputBuffer: GPUBuffer;
    private readBuffer: GPUBuffer;

    constructor(device: GPUDevice, fftSize = 2048) {
        this.device = device;
        const shaderModule = device.createShaderModule({ code: SPECTRAL_COMPUTE_SHADER });

        this.pipeline = device.createComputePipeline({
            layout: 'auto',
            compute: { module: shaderModule, entryPoint: 'main' }
        });

        this.paramsBuffer = device.createBuffer({
            size: 12, // u32 + f32 + f32
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const dataSize = fftSize * 4;
        this.inputBuffer = device.createBuffer({
            size: dataSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.outputBuffer = device.createBuffer({
            size: dataSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });

        this.readBuffer = device.createBuffer({
            size: dataSize,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
        });
    }

    async analyze(audioData: Float32Array, intensity = 1.0): Promise<Float32Array> {
        // 1. Upload Data
        this.device.queue.writeBuffer(this.inputBuffer, 0, audioData);
        this.device.queue.writeBuffer(this.paramsBuffer, 0, new Uint32Array([audioData.length]));
        this.device.queue.writeBuffer(this.paramsBuffer, 4, new Float32Array([44100, intensity]));

        // 2. Dispatch Compute
        const commandEncoder = this.device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.pipeline);
        
        const bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this.paramsBuffer } },
                { binding: 1, resource: { buffer: this.inputBuffer } },
                { binding: 2, resource: { buffer: this.outputBuffer } }
            ]
        });
        
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(audioData.length / 64));
        passEncoder.end();

        commandEncoder.copyBufferToBuffer(this.outputBuffer, 0, this.readBuffer, 0, audioData.length * 4);
        this.device.queue.submit([commandEncoder.finish()]);

        // 3. Read Results
        await this.readBuffer.mapAsync(GPUMapMode.READ);
        const copy = new Float32Array(this.readBuffer.getMappedRange());
        const result = new Float32Array(copy);
        this.readBuffer.unmap();
        
        return result;
    }
}

export async function initWebGPUSpectral() {
  if (!navigator.gpu) {
    console.warn("WebGPU not supported, falling back to CPU spectral analysis.");
    return null;
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device) return null;

  console.log("DAW: WebGPU Spectral Engine Initialized (Native GPU Acceleration)");
  return new WebGPUSpectralAnalyzer(device);
}
