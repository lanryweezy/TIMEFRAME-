
import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { VideoState } from '../types';
import { hexToRgb } from '../lib/colorUtils';

export const usePixiRenderer = (state: VideoState, onTimeUpdate: (time: number) => void, onDurationChange: (duration: number) => void) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pixiApp = useRef<PIXI.Application | null>(null);
    const videoSprite = useRef<PIXI.Sprite | null>(null);
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);
    const VIDEO_POOL_SIZE = 3;
    const videoPool = useRef<HTMLVideoElement[]>([]);
    const activeMapping = useRef<Map<string, HTMLVideoElement>>(new Map());
    const loadingUrl = useRef<string>('');
    const videoLoadState = useRef<'ready' | 'loading' | 'error'>('loading');
    const textureCache = useRef<Map<string, PIXI.Texture>>(new Map());
    const MAX_CACHE_SIZE = 5;

    // Initialize pool
    useEffect(() => {
        for (let i = 0; i < VIDEO_POOL_SIZE; i++) {
            const v = document.createElement('video');
            v.crossOrigin = 'anonymous';
            v.playsInline = true;
            v.muted = true;
            videoPool.current.push(v);
        }
        return () => {
            videoPool.current.forEach(v => v.remove());
        };
    }, []);

    const getFreeVideoElement = (clipId: string): HTMLVideoElement => {
        if (activeMapping.current.has(clipId)) {
            return activeMapping.current.get(clipId)!;
        }
        const v = videoPool.current.shift()!;
        videoPool.current.push(v); // Circular reuse
        activeMapping.current.set(clipId, v);
        return v;
    };

    useEffect(() => {
        let destroyed = false;
        const initPixi = async () => {
            if (!containerRef.current) return;

            const app = new PIXI.Application();
            try {
                await app.init({
                    width: 1920,
                    height: 1080,
                    backgroundAlpha: 0,
                    antialias: true,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                    powerPreference: 'high-performance',
                });

                if (destroyed) {
                    app.destroy(true, { children: true, texture: true });
                    return;
                }

                if (containerRef.current) {
                    containerRef.current.appendChild(app.canvas);
                    app.canvas.style.width = '100%';
                    app.canvas.style.height = '100%';
                    app.canvas.style.objectFit = 'contain';
                    pixiApp.current = app;
                } else {
                    app.destroy(true, { children: true, texture: true });
                }
            } catch (error) {
                console.error('Pixi init failed:', error);
            }
        };

        if (!pixiApp.current) {
            initPixi();
        }

        return () => {
            destroyed = true;
            if (pixiApp.current) {
                const app = pixiApp.current;
                pixiApp.current = null;
                app.destroy(true, { children: true, texture: true });
            }
        };
    }, []);

    // Ref to store latest state
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Ticker Logic
    useEffect(() => {
        if (!pixiApp.current) return;
        
        const app = pixiApp.current;
        const tickerCallback = () => {
            const currentState = stateRef.current;
            if (activeVideoRef.current && currentState.isPlaying) {
                const activeClip = currentState.videoClips
                    .find(c => !c.isAdjustmentLayer && currentState.currentTime >= c.startTime && currentState.currentTime <= c.startTime + c.duration) 
                    || currentState.videoClips.find(c => !c.isAdjustmentLayer);
                
                if (activeClip) {
                    onTimeUpdate(activeClip.startTime + activeVideoRef.current.currentTime);
                }
            }
        };

        app.ticker.add(tickerCallback);
        return () => {
            if (app.ticker) {
                app.ticker.remove(tickerCallback);
            }
        };
    }, []); // Removed state dependencies as we use stateRef

    // Sync Video Element Preparation (src, etc)
    useEffect(() => {
        if (!pixiApp.current) return;

        const activeClip = state.videoClips
            .filter(c => !c.isAdjustmentLayer && state.currentTime >= c.startTime && state.currentTime <= c.startTime + c.duration)
            .sort((a, b) => (b.trackId || 0) - (a.trackId || 0))[0] || state.videoClips.find(c => !c.isAdjustmentLayer);

        if (!activeClip) return;

        if (!activeVideoRef.current) {
            activeVideoRef.current = document.createElement('video');
            activeVideoRef.current.crossOrigin = 'anonymous';
            activeVideoRef.current.playsInline = true;
            activeVideoRef.current.muted = true;
            
            activeVideoRef.current.onloadstart = () => { videoLoadState.current = 'loading'; };
            activeVideoRef.current.oncanplay = () => { 
                videoLoadState.current = 'ready'; 
                if (stateRef.current.isPlaying) {
                    activeVideoRef.current?.play().catch((e) => console.error("Play failed oncanplay", e));
                }
            };
            
            activeVideoRef.current.onloadedmetadata = () => {
                if (activeVideoRef.current) {
                    onDurationChange(activeVideoRef.current.duration);
                    console.log("Video metadata loaded:", activeVideoRef.current.duration);
                }
            };
            
            activeVideoRef.current.onerror = (e) => {
                videoLoadState.current = 'error';
                console.error("Video element error:", e);
                if (activeVideoRef.current?.error) {
                    console.error("Video error details:", activeVideoRef.current.error.message, activeVideoRef.current.error.code);
                    
                    // If proxies fail, try falling back to the original URL
                    if (state.proxyMode && activeVideoRef.current.src.includes('proxy=true')) {
                       console.log("Proxy load failed, falling back to original URL");
                       const currentClip = state.videoClips.find(c => c.proxyUrl === activeVideoRef.current?.src);
                       if (currentClip) {
                           activeVideoRef.current.src = currentClip.url;
                           activeVideoRef.current.load();
                       }
                    }
                }
            };
        }

        const videoUrl = (state.proxyMode && activeClip.proxyUrl) ? activeClip.proxyUrl : activeClip.url;

        if (videoUrl && videoUrl !== loadingUrl.current) {
            console.log("Setting video src:", videoUrl);
            loadingUrl.current = videoUrl;
            videoLoadState.current = 'loading';
            
            activeVideoRef.current.src = videoUrl;
            activeVideoRef.current.load();
            
            // Prune cache if too large
            if (textureCache.current.size >= MAX_CACHE_SIZE) {
                const firstKey = textureCache.current.keys().next().value;
                const oldTexture = textureCache.current.get(firstKey);
                oldTexture?.destroy(true);
                textureCache.current.delete(firstKey);
            }

            // Get or create texture
            let texture = textureCache.current.get(activeClip.id);
            if (!texture) {
                texture = PIXI.Texture.from(activeVideoRef.current);
                textureCache.current.set(activeClip.id, texture);
            }
            
            // Cleanup old sprite
            if (videoSprite.current && pixiApp.current) {
                pixiApp.current.stage.removeChild(videoSprite.current);
            }
            
            if (pixiApp.current) {
                const sprite = new PIXI.Sprite(texture);
                sprite.anchor.set(0.5);
                sprite.x = pixiApp.current.screen.width / 2;
                sprite.y = pixiApp.current.screen.height / 2;
                pixiApp.current.stage.addChild(sprite);
                videoSprite.current = sprite;
            }
        }

        activeVideoRef.current.playbackRate = activeClip.speed || 1;
    }, [state.currentTime, state.videoClips]); // Only run when time or clips change

    // Sync Playback State
    useEffect(() => {
        if (!activeVideoRef.current) return;

        if (state.isPlaying && activeVideoRef.current.paused) {
            if (videoLoadState.current === 'ready') {
                activeVideoRef.current.play().catch((e) => console.error("Play failed", e));
            } else {
                console.log("Video not ready to play, current load state:", videoLoadState.current);
            }
        } else if (!state.isPlaying && !activeVideoRef.current.paused) {
            activeVideoRef.current.pause();
        }
    }, [state.isPlaying]);

    // Sync Seek Time (only when paused to avoid conflicts with ticker)
    useEffect(() => {
        if (!activeVideoRef.current || state.isPlaying) return;
        
        const activeClip = state.videoClips
            .filter(c => !c.isAdjustmentLayer && state.currentTime >= c.startTime && state.currentTime <= c.startTime + c.duration)
            .sort((a, b) => (b.trackId || 0) - (a.trackId || 0))[0] || state.videoClips.find(c => !c.isAdjustmentLayer);
            
        if (!activeClip) return;

        const relativeTime = Math.max(0, state.currentTime - activeClip.startTime);
        if (Math.abs(activeVideoRef.current.currentTime - relativeTime) > 0.05) {
            activeVideoRef.current.currentTime = relativeTime;
        }
    }, [state.currentTime, state.isPlaying]);


    // Apply Effects and Transforms
    useEffect(() => {
        if (!pixiApp.current || !videoSprite.current) return;

        const filters: PIXI.Filter[] = [];

        const colorMatrix = new PIXI.ColorMatrixFilter();
        const adj = state.adjustment;
        colorMatrix.brightness(adj.brightness / 100, false);
        colorMatrix.contrast(adj.contrast / 100, false);
        colorMatrix.saturate(adj.saturation / 100, false);
        colorMatrix.hue(adj.hue, false);
        filters.push(colorMatrix);
        
        if (state.adjustment.blur > 0) {
            filters.push(new PIXI.BlurFilter({ strength: state.adjustment.blur }));
        }

        if (state.chromaKey.enabled) {
            const target = hexToRgb(state.chromaKey.color);
            const chromaFilter = new PIXI.Filter({
                glProgram: PIXI.GlProgram.from({
                    vertex: `
                        attribute vec2 aVertexPosition;
                        attribute vec2 aTextureCoord;
                        uniform mat3 projectionMatrix;
                        varying vec2 vTextureCoord;
                        void main(void) {
                            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                            vTextureCoord = aTextureCoord;
                        }
                    `,
                    fragment: `
                        precision mediump float;
                        varying vec2 vTextureCoord;
                        uniform sampler2D uSampler;
                        uniform vec3 uTargetColor;
                        uniform float uThreshold;
                        uniform float uFeather;
                        void main(void) {
                            vec4 color = texture2D(uSampler, vTextureCoord);
                            float dist = distance(color.rgb, uTargetColor);
                            float alpha = smoothstep(uThreshold, uThreshold + uFeather, dist);
                            gl_FragColor = vec4(color.rgb * alpha, alpha);
                        }
                    `
                }),
                resources: {
                    uTargetColor: new Float32Array([target.r / 255, target.g / 255, target.b / 255]),
                    uThreshold: state.chromaKey.intensity / 100,
                    uFeather: state.chromaKey.shadow / 100,
                }
            });
            filters.push(chromaFilter);
        }

        videoSprite.current.filters = filters;

        // Apply Global Transform
        videoSprite.current.scale.set(state.transform.scale / 100);
        videoSprite.current.rotation = state.transform.rotation * (Math.PI / 180);
        videoSprite.current.x = pixiApp.current.screen.width / 2 + state.transform.positionX;
        videoSprite.current.y = pixiApp.current.screen.height / 2 + state.transform.positionY;
        videoSprite.current.alpha = state.transform.opacity / 100;

    }, [state.activeFilter, state.adjustment, state.chromaKey, state.transform, state.currentTime]);

    return { containerRef };
};
