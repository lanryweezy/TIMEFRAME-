/**
 * High-Performance .CUBE LUT Parser
 * Parses Adobe/DaVinci 3D LUT files into a WebGPU/WebGL compatible 3D Texture array.
 */

export class LUTParser {
  static parseCube(cubeText: string): { size: number; data: Float32Array } | null {
    const lines = cubeText.split('\\n');
    let size = 0;
    const data: number[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || trimmed.length === 0) continue;

      if (trimmed.startsWith('LUT_3D_SIZE')) {
        size = parseInt(trimmed.split(' ')[1], 10);
      } else {
        // RGB values
        const parts = trimmed.split(/\\s+/);
        if (parts.length >= 3) {
          const r = parseFloat(parts[0]);
          const g = parseFloat(parts[1]);
          const b = parseFloat(parts[2]);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            data.push(r, g, b);
          }
        }
      }
    }

    if (size === 0 || data.length === 0) {
      console.error('Invalid .CUBE file format');
      return null;
    }

    // Convert to Float32Array for GPU upload
    return {
      size,
      data: new Float32Array(data)
    };
  }

  // Converts the 1D flat Float32Array into a 3D format suitable for PIXI.js or WebGPU
  static generate3DTexture(lutData: Float32Array, size: number) {
    // In standard WebGL, 3D textures can be emulated using a 2D sprite sheet
    // or natively in WebGL2/WebGPU via DataTexture3D.
    // Assuming WebGL2/WebGPU environment:
    
    // Creating a buffer for RGBA (adding Alpha channel as 1.0 for alignment)
    const rgbaData = new Float32Array(size * size * size * 4);
    for (let i = 0, j = 0; i < lutData.length; i += 3, j += 4) {
      rgbaData[j] = lutData[i];         // R
      rgbaData[j + 1] = lutData[i + 1]; // G
      rgbaData[j + 2] = lutData[i + 2]; // B
      rgbaData[j + 3] = 1.0;            // A
    }

    return { size, rgbaData };
  }
}
