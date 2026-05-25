import { useVideoStore } from '../store/videoStore';
import { writeSharedTime, writeSharedPlaying } from './sharedState';
import { performanceMonitor } from './performanceMonitor';

/**
 * TITAN-LOAD STRESS TEST ENGINE
 * Empirically tests the limits of the TIMEFRAME architecture.
 */
export class TitanStressTest {
    private isRunning = false;
    private originalState: any = null;

    async run() {
        if (this.isRunning) return;
        this.isRunning = true;

        console.log('🚀 [TITAN-LOAD] Initializing Extreme Workload Test...');
        const store = useVideoStore.getState();
        this.originalState = { ...store };

        // 1. GENERATE "PROJECT FROM HELL" (100+ Clips, 8K Mock resolution)
        const stressClips = Array.from({ length: 150 }, (_, i) => ({
            id: `stress-clip-${i}`,
            name: `Extreme Clip ${i}`,
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            startTime: i * 2,
            duration: 10,
            trackId: (i % 10) + 1,
            adjustment: {
                brightness: 100,
                contrast: 120,
                saturation: 150,
                filterIntensity: 100
            },
            vfx: {
                halation: 80,
                grain: 50,
                chromaticAberration: 60
            }
        }));

        (store as any).setState({
            videoClips: stressClips,
            duration: 500,
            projectName: '🔥 TITAN STRESS TEST'
        });

        // 2. TRIGGER RAPID SCRUBBING (Stress the O(1) Binary Seek)
        console.log('🔥 [TITAN-LOAD] Testing Rapid O(1) Seek Performance...');
        for (let i = 0; i < 50; i++) {
            const randomTime = Math.random() * 500;
            writeSharedTime(randomTime);
            await new Promise(r => setTimeout(r, 50)); // 50ms per jump
        }

        // 3. TRIGGER HIGH-VELOCITY PLAYBACK
        console.log('🔥 [TITAN-LOAD] Testing High-Velocity Playback (4x Speed)...');
        writeSharedPlaying(true);
        // Simulate high-speed playback by jumping ahead rapidly in the shared clock
        let testTime = 0;
        const playInterval = setInterval(() => {
            testTime += 0.5; // Jump half a second every frame (15x speed)
            writeSharedTime(testTime);
            if (testTime >= 100) {
                clearInterval(playInterval);
                this.finalize();
            }
        }, 16);
    }

    private finalize() {
        writeSharedPlaying(false);
        this.isRunning = false;
        console.log('✅ [TITAN-LOAD] Stress Test Complete.');
        
        const metrics = performanceMonitor.getMetrics();
        console.log('📊 [RESULTS]:', {
            avgFPS: metrics.fps,
            peakMemory: metrics.memoryUsage,
            totalReRenders: metrics.reRenderCount
        });

        if (metrics.fps < 55) {
            console.warn('⚠️ PERFORMANCE WARNING: Frame rate dropped below 55fps under Titan Load.');
        } else {
            console.log('🏆 PERFORMANCE SUCCESS: Maintained near-60fps under Extreme Load.');
        }
    }

    restore() {
        if (this.originalState) {
            (useVideoStore.getState() as any).setState(this.originalState);
        }
    }
}

export const titanStressTest = new TitanStressTest();
