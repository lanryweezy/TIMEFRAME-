/**
 * INCREMENTAL RENDER GRAPH (DAG)
 * The "React for Video" core.
 * Manages a tree of effects and only re-renders what is dirty.
 */

export type NodeType = 'source' | 'transform' | 'effect' | 'sink';

export interface RenderNode {
    id: string;
    type: NodeType;
    dirty: boolean;
    inputs: string[]; // IDs of parent nodes
    outputTexture?: GPUTexture;
    params: any;
    execute: (inputs: GPUTexture[], params: any) => Promise<GPUTexture>;
}

export class RenderGraph {
    private nodes: Map<string, RenderNode> = new Map();
    private texturePool: { texture: GPUTexture, lastUsed: number }[] = [];
    private device: GPUDevice | null = null;

    setDevice(device: GPUDevice) {
        this.device = device;
    }

    public getTextureFromPool(width: number, height: number, format: GPUTextureFormat): GPUTexture {
        const foundIdx = this.texturePool.findIndex(p => 
            p.texture.width === width && 
            p.texture.height === height && 
            p.texture.format === format
        );

        if (foundIdx !== -1) {
            const entry = this.texturePool.splice(foundIdx, 1)[0];
            entry.lastUsed = Date.now();
            return entry.texture;
        }

        return this.device!.createTexture({
            size: [width, height],
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });
    }

    private releaseTextureToPool(texture: GPUTexture) {
        this.texturePool.push({ texture, lastUsed: Date.now() });
        this.gcPool();
    }

    /**
     * RESOURCE GC
     * Evicts textures that haven't been used in 30 seconds to free VRAM.
     */
    private gcPool() {
        const now = Date.now();
        this.texturePool = this.texturePool.filter(p => {
            if (now - p.lastUsed > 30000) {
                p.texture.destroy();
                return false;
            }
            return true;
        });
    }

    addNode(node: RenderNode) {
        this.nodes.set(node.id, node);
    }

    async render(targetNodeId: string): Promise<GPUTexture | null> {
        const node = this.nodes.get(targetNodeId);
        if (!node) return null;

        const inputTextures: GPUTexture[] = [];
        for (const inputId of node.inputs) {
            const tex = await this.render(inputId);
            if (tex) inputTextures.push(tex);
        }

        if (node.dirty || !node.outputTexture) {
            // Recycling Logic
            if (node.outputTexture) this.releaseTextureToPool(node.outputTexture);
            
            // Execute with pooled texture
            const recycled = this.getTextureFromPool(1920, 1080, 'rgba16float'); // Assume standard size for now
            node.outputTexture = await node.execute(inputTextures, node.params); 
            node.dirty = false;
        }

        return node.outputTexture;
    }
}

export const renderGraph = new RenderGraph();
