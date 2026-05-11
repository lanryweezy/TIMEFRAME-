
import { analyzeCinematicFlow } from '../services/pacingEngine';
import { generateProxy } from '../services/proxyService';
import { VideoState } from '../types';

self.onmessage = async (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'ANALYZE_PACING') {
        const state = payload as VideoState;
        const suggestions = analyzeCinematicFlow(state);
        self.postMessage({ type: 'PACING_OPTIMIZED', payload: suggestions });
    } else if (type === 'GENERATE_PROXY') {
        const { clipId, assetUrl } = payload;
        const stream = await generateProxy(assetUrl);
        const reader = stream.getReader();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            self.postMessage({ type: 'PROXY_CHUNK', payload: { clipId, chunk: value } });
        }
        
        self.postMessage({ type: 'PROXY_COMPLETE', payload: { clipId } });
    }
};
