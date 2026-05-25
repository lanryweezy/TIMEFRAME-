/// <reference lib="webworker" />
import * as PIXI from 'pixi.js';
import { initSharedState, readSharedTime, readSharedPlaying, getCommandSequence, writeHistogram, incrementFrameCounter, getFrameCount } from '../lib/sharedState';
import { TemporalIndex } from '../lib/temporalIndex';

let app: PIXI.Application | null = null;
let sharedBuffer: SharedArrayBuffer | null = null;
let sceneState: any = { 
    videoClips: [], 
    textTrack: [], 
    subtitleTrack: [], 
    particleTrack: [],
    shapeTrack: [],
    effectTrack: []
};
let decoderWorker: Worker | null = null;
let vfxWorker: Worker | null = null;

// HIGH-PERFORMANCE TEMPORAL INDICES
const videoIndex = new TemporalIndex();
const textIndex = new TemporalIndex();
const subtitleIndex = new TemporalIndex();
const particleIndex = new TemporalIndex();

// ELITE POOLING & GRAPH SYSTEM
const spritePool = new Map<string, PIXI.Sprite>();
const textPool = new Map<string, PIXI.Text>();
const trackContainers = new Map<string, PIXI.Container>();

// CONTAINERS
const videoContainer = new PIXI.Container();
const textContainer = new PIXI.Container();
const subtitleContainer = new PIXI.Container();
const particleContainer = new PIXI.Container();

// GPU ARENA ALLOCATION: Texture Recycling
const gpuTexturePool = new Map<string, PIXI.Texture[]>();

const getPooledTexture = (frame: VideoFrame): PIXI.Texture => {
    const key = `${frame.displayWidth}-${frame.displayHeight}`;
    const pool = gpuTexturePool.get(key) || [];
    
    if (pool.length > 0) {
        const tex = pool.pop()!;
        tex.source.update(frame);
        return tex;
    }
    
    return PIXI.Texture.from(frame);
};

const recycleTexture = (texture: PIXI.Texture) => {
    const key = `${texture.width}-${texture.height}`;
    if (!gpuTexturePool.has(key)) gpuTexturePool.set(key, []);
    
    const pool = gpuTexturePool.get(key)!;
    if (pool.length < 40) {
        pool.push(texture);
    } else {
        texture.destroy(true);
    }
};

const textureCache = new Map<string, PIXI.Texture>();
const imageCache = new Map<string, PIXI.Texture>();
const lastAccessTime = new Map<string, number>();
const pendingFrames = new Set<string>();
const MAX_TEXTURE_CACHE = 120;

let lastRenderTime = -1;
let lastStateHash = '';

const getStateHash = (state: any) => {
    return `${state.videoClips?.length}-${state.textTrack?.length}-${state.subtitleTrack?.length}`;
};

const getStaticImage = async (url: string): Promise<PIXI.Texture | null> => {
    if (imageCache.has(url)) return imageCache.get(url)!;
    
    try {
        let texture: PIXI.Texture;
        if (url.startsWith('opfs://')) {
            const filename = url.replace('opfs://', '');
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(filename);
            const file = await fileHandle.getFile();
            const bitmap = await createImageBitmap(file);
            texture = PIXI.Texture.from(bitmap);
        } else {
            texture = await PIXI.Assets.load(url);
        }
        imageCache.set(url, texture);
        return texture;
    } catch (e) {
        console.error(`Renderer: Failed to load static image: ${url}`, e);
        return null;
    }
};

const scheduleLookahead = (currentTime: number, isPlaying: boolean) => {
    if (!decoderWorker) return;

    const fps = 30;
    const currentSeq = getCommandSequence();
    
    if (isPlaying) {
        const lookaheadSeconds = 1.0;
        const lookaheadFrames = lookaheadSeconds * fps;

        for (let i = 1; i <= lookaheadFrames; i++) {
            const futureTime = currentTime + (i / fps);
            const activeItems = videoIndex.getActiveItems(futureTime);

            // TRANSITION LOOKAHEAD (Item #117)
            // If multiple clips are active (likely a transition), prioritize both
            for (const clip of activeItems) {
                if (isImage(clip.url)) continue;

                const frameKey = `${clip.id}-${futureTime.toFixed(2)}`;
                if (!textureCache.has(frameKey) && !pendingFrames.has(frameKey)) {
                    pendingFrames.add(frameKey);
                    // FORCE PROXY DURING PLAYBACK: Item #3 Fix
                    // Transitions get 'immediate' priority to ensure both buffers are ready
                    const priority = (activeItems.length > 1 || i <= 5) ? 'immediate' : 'high'; 
                    decoderWorker.postMessage({ 
                        type: 'REQUEST_FRAME', 
                        payload: { clipId: clip.id, timestamp: futureTime, priority, quality: 'proxy', sequence: currentSeq } 
                    });
                }
            }
        }
    } else {
        const activeClips = videoIndex.getActiveItems(currentTime).filter((c: any) => !isImage(c.url));
        for (const clip of activeClips) {
            const frameKey = `${clip.id}-${currentTime.toFixed(2)}`;
            if (!textureCache.has(frameKey) && !pendingFrames.has(frameKey)) {
                pendingFrames.add(frameKey);
                decoderWorker.postMessage({ 
                    type: 'REQUEST_FRAME', 
                    payload: { clipId: clip.id, timestamp: currentTime, priority: 'immediate', quality: 'full', sequence: currentSeq } 
                });
            }
        }
    }
};

const isImage = (url: string) => {
    return url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || url.includes('images.unsplash.com') || (url.startsWith('opfs://') && !url.match(/\.(mp4|mov|webm|avi|mkv)/i));
};

const garbageCollect = (currentTime: number) => {
    if (textureCache.size > MAX_TEXTURE_CACHE) {
        const keys = Array.from(textureCache.keys());
        keys.sort((a, b) => {
            const timeA = parseFloat(a.split('-')[1]);
            const timeB = parseFloat(b.split('-')[1]);
            return Math.abs(timeA - currentTime) - Math.abs(timeB - currentTime);
        });
        const toEvict = keys.slice(MAX_TEXTURE_CACHE);
        toEvict.forEach(key => {
            const texture = textureCache.get(key);
            if (texture) {
                recycleTexture(texture);
                textureCache.delete(key);
            }
        });
    }

    const now = Date.now();
    for (const [url, texture] of imageCache.entries()) {
        const lastAccess = lastAccessTime.get(url) || 0;
        if (lastAccess > 0 && now - lastAccess > 60000) {
            texture.destroy(true);
            imageCache.delete(url);
            lastAccessTime.delete(url);
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        }
    }
};

let initParams: any = null;

const tryReinitialize = async () => {
    if (!initParams) return;
    if (app) {
        try { app.destroy(false, { children: true, texture: false, baseTexture: false }); } catch(e) {}
    }

    const { canvas, width, height, devicePixelRatio } = initParams;
    app = new PIXI.Application();
    try {
        await app.init({
            canvas, width, height, backgroundAlpha: 0, antialias: true,
            resolution: devicePixelRatio || 1, autoDensity: true,
            preference: 'webgpu',
        });
        
        app.stage.addChild(videoContainer);
        app.stage.addChild(textContainer);
        app.stage.addChild(subtitleContainer);
        app.stage.addChild(particleContainer);
    } catch (e) {
        setTimeout(tryReinitialize, 2000);
    }
};

const updateScopes = (texture: PIXI.Texture) => {
    if (!app || !texture.baseTexture.resource) return;
    
    // Sampled readback for scopes
    const extract = app.renderer.extract as any;
    const canvas = extract.canvas(texture);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const bins = new Int32Array(1024).fill(0);
    
    for (let i = 0; i < imageData.length; i += 16) {
        bins[imageData[i]]++;        
        bins[256 + imageData[i+1]]++; 
        bins[512 + imageData[i+2]]++; 
        const luma = Math.floor(0.299 * imageData[i] + 0.587 * imageData[i+1] + 0.114 * imageData[i+2]);
        bins[768 + luma]++;          
    }
    
    for (let i = 0; i < 1024; i++) {
        writeHistogram(Math.floor(i / 256), i % 256, bins[i]);
    }
};

const renderLoop = async () => {
    if (!app || !sharedBuffer) {
        requestAnimationFrame(renderLoop);
        return;
    }

    if (app.renderer.destroyed) {
        await tryReinitialize();
        requestAnimationFrame(renderLoop);
        return;
    }

    const currentTime = readSharedTime();
    const isPlaying = readSharedPlaying();

    const currentStateHash = getStateHash(sceneState);
    if (!isPlaying && currentTime === lastRenderTime && currentStateHash === lastStateHash) {
        requestAnimationFrame(renderLoop);
        return;
    }

    lastRenderTime = currentTime;
    lastStateHash = currentStateHash;

    scheduleLookahead(currentTime, isPlaying);
    const activeThisFrame = new Set<string>();

    const activeClips = videoIndex.getActiveItems(currentTime).sort((a: any, b: any) => (a.trackId || 0) - (b.trackId || 0));

    for (const clip of activeClips) {
        let texture: PIXI.Texture | null = null;
        if (isImage(clip.url)) {
            lastAccessTime.set(clip.url, Date.now());
            texture = imageCache.get(clip.url) || null;
            if (!texture) getStaticImage(clip.url); 
        } else {
            const frameKey = `${clip.id}-${currentTime.toFixed(2)}`;
            texture = textureCache.get(frameKey) || null;

            // ELITE GRAPH DISPATCH: If clip has a node graph, process it in the VFX worker
            if (!texture && clip.vfxGraph && !pendingFrames.has(frameKey)) {
                 // 1. Get raw frame first (Full Quality for graph)
                 decoderWorker?.postMessage({ 
                    type: 'REQUEST_FRAME', 
                    payload: { clipId: clip.id, timestamp: currentTime, priority: 'immediate', quality: 'full', sequence: getCommandSequence() } 
                 });
            }
            else if (!texture && !pendingFrames.has(frameKey)) {
                pendingFrames.add(frameKey);
                decoderWorker?.postMessage({ 
                    type: 'REQUEST_FRAME', 
                    payload: { clipId: clip.id, timestamp: currentTime, priority: 'immediate', quality: isPlaying ? 'proxy' : 'full', sequence: getCommandSequence() } 
                });
            }
        }

        if (texture) {
            let sprite = spritePool.get(clip.id);
            if (!sprite) {
                sprite = new PIXI.Sprite(texture);
                sprite.anchor.set(0.5);
                spritePool.set(clip.id, sprite);
                videoContainer.addChild(sprite);
            }
            sprite.texture = texture;
            sprite.position.set(app.screen.width / 2, app.screen.height / 2);
            sprite.visible = true;
            if (clip.transform) {
                sprite.scale.set(clip.transform.scale);
                sprite.rotation = clip.transform.rotation * (Math.PI / 180);
                sprite.alpha = clip.transform.opacity;
            }
            activeThisFrame.add(clip.id);
        }
    }

    const activeTexts = textIndex.getActiveItems(currentTime);
    for (const textBlock of activeTexts) {
        const elapsed = currentTime - textBlock.startTime;
        let displayText = textBlock.text;
        if (textBlock.animation === 'typewriter') {
            displayText = textBlock.text.substring(0, Math.floor(elapsed * (textBlock.typingSpeed || 20)));
        }

        let pixiText = textPool.get(textBlock.id);
        if (!pixiText) {
            const style = new PIXI.TextStyle({
                fontFamily: textBlock.style.fontFamily || 'Inter',
                fontSize: textBlock.style.fontSize || 32,
                fill: textBlock.style.color || '#ffffff',
                fontWeight: textBlock.style.fontWeight as any || '700',
                align: textBlock.style.textAlign || 'center',
            });
            pixiText = new PIXI.Text({ text: displayText, style });
            pixiText.anchor.set(0.5);
            textPool.set(textBlock.id, pixiText);
            textContainer.addChild(pixiText);
        }
        pixiText.text = displayText;
        pixiText.position.set((textBlock.style.x / 100) * app.screen.width, (textBlock.style.y / 100) * app.screen.height);
        pixiText.alpha = textBlock.style.opacity;
        pixiText.visible = true;
        activeThisFrame.add(textBlock.id);
    }

    const activeSub = subtitleIndex.getActiveItems(currentTime)[0];
    if (activeSub) {
        let subText = textPool.get('global-subtitle');
        if (!subText) {
            const subStyle = new PIXI.TextStyle({ fontFamily: 'Inter', fontSize: 24, fill: '#ffffff', fontWeight: '600' });
            subText = new PIXI.Text({ text: activeSub.text, style: subStyle });
            subText.anchor.set(0.5, 1);
            textPool.set('global-subtitle', subText);
            subtitleContainer.addChild(subText);
        }
        subText.text = activeSub.text;
        subText.position.set(app.screen.width / 2, app.screen.height - 100);
        subText.visible = true;
        activeThisFrame.add('global-subtitle');
    }

    const activeParticles = particleIndex.getActiveItems(currentTime);
    for (const p of activeParticles) {
        let container = trackContainers.get(p.id);
        if (!container) {
            container = new PIXI.Container();
            trackContainers.set(p.id, container);
            particleContainer.addChild(container);
            for (let i = 0; i < 100; i++) {
                const dot = new PIXI.Graphics();
                dot.beginFill(0xFFFFFF);
                dot.drawCircle(0, 0, 5);
                dot.endFill();
                container.addChild(dot);
            }
        }
        container.visible = true;
        activeThisFrame.add(p.id);
        const count = Math.floor(p.intensity / 2);
        container.children.forEach((dot: any, i) => {
            if (i < count) {
                dot.visible = true;
                const seed = Math.sin(currentTime * 10 + i);
                dot.x = app!.screen.width / 2 + seed * 300;
                dot.y = app!.screen.height / 2 + Math.cos(currentTime * 5 + i) * 300;
                dot.tint = p.color || 0xFFFFFF;
                const visualSeed = (Math.abs(seed) * 1000) % 1;
                dot.scale.set((p.size || 5) / 5 * (0.5 + visualSeed * 0.5));
                dot.alpha = Math.max(0, 1 - (visualSeed * 0.5));
            } else { dot.visible = false; }
        });
    }

    spritePool.forEach((sprite, id) => { if (!activeThisFrame.has(id)) sprite.visible = false; });
    textPool.forEach((text, id) => { if (!activeThisFrame.has(id)) text.visible = false; });
    trackContainers.forEach((cont, id) => { if (!activeThisFrame.has(id)) cont.visible = false; });
    
    app.renderer.render({ container: app.stage, target: app.canvas });
    
    if (getFrameCount() % 10 === 0 && activeClips.length > 0) {
        const primaryClip = spritePool.get(activeClips[0].id);
        if (primaryClip && primaryClip.visible) updateScopes(primaryClip.texture);
    }

    incrementFrameCounter();
    garbageCollect(currentTime);
    requestAnimationFrame(renderLoop);
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    initParams = payload;
    const { canvas, sharedBuffer: buffer, width, height, devicePixelRatio } = payload;
    sharedBuffer = buffer;
    initSharedState(buffer);

    decoderWorker = new Worker(new URL('./decoder.worker.ts', import.meta.url), { type: 'module' });
    decoderWorker.postMessage({ type: 'INIT', payload: { sharedBuffer: buffer } });
    
    // RELIABILITY UPGRADE: VFX Engine Orchestration
    vfxWorker = new Worker(new URL('./vfxProcessor.worker.ts', import.meta.url), { type: 'module' });
    vfxWorker.postMessage({ type: 'SYNC_STATE', payload: { ...sceneState } });

    decoderWorker.onmessage = (de) => {
        const { type, payload } = de.data;
        if (type === 'FRAME_READY') {
            const { clipId, timestamp, frame } = payload;
            const key = `${clipId}-${timestamp.toFixed(2)}`;
            const clip = sceneState.videoClips.find((c: any) => c.id === clipId);

            // IF GRAPH PRESENT: Dispatch to VFX Worker for node-based processing
            if (clip?.vfxGraph) {
                pendingFrames.add(key);
                vfxWorker?.postMessage({
                    type: 'PROCESS_GRAPH',
                    payload: { clipId, timestamp, graph: clip.vfxGraph, frame }
                }, [frame]);
            } else {
                const texture = getPooledTexture(frame);
                textureCache.set(key, texture);
                pendingFrames.delete(key);
                frame.close();
            }
        }
    };

    vfxWorker.onmessage = (ve) => {
        const { type, payload } = ve.data;
        if (type === 'GRAPH_COMPLETE') {
            const { clipId, timestamp, frame } = payload;
            const key = `${clipId}-${timestamp.toFixed(2)}`;
            
            const texture = getPooledTexture(frame);
            textureCache.set(key, texture);
            pendingFrames.delete(key);
            frame.close();
        }
    };

    app = new PIXI.Application();
    await app.init({ canvas, width, height, backgroundAlpha: 0, antialias: true, resolution: devicePixelRatio || 1, autoDensity: true, preference: 'webgpu' });
    app.stage.addChild(videoContainer, textContainer, subtitleContainer, particleContainer);
    renderLoop();
  } 
  
  else if (type === 'SYNC_STATE') {
      sceneState = { ...sceneState, ...payload };
      if (payload.videoClips) videoIndex.rebuild(payload.videoClips);
      if (payload.textTrack) textIndex.rebuild(payload.textTrack);
      if (payload.subtitleTrack) subtitleIndex.rebuild(payload.subtitleTrack);
      if (payload.particleTrack) particleIndex.rebuild(payload.particleTrack);

      payload.videoClips?.forEach((c: any) => {
          if (!isImage(c.url)) {
              decoderWorker?.postMessage({ type: 'REGISTER_CLIP', payload: { clipId: c.id, url: c.url } });
          } else {
              getStaticImage(c.url); 
          }
      });
  }
};
