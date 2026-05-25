/**
 * ULTRA-LOW LATENCY STATE SYNCHRONIZATION
 * Uses SharedArrayBuffer and Atomics for lock-free thread communication.
 * 
 * Layout:
 * 0-7:   currentTime (Float64)
 * 8-15:  playbackSpeed (Float64)
 * 16-31: controlState (Int32Array)
 *        [0] isPlaying (1/0)
 *        [1] frameCounter
 *        [2] commandSequence
 * 32-4127: Histogram Data (Int32Array, 256 bins * 4 channels: R, G, B, L)
 * 4128-5151: Waveform Data (Float32Array, 256 columns)
 */

let sharedBuffer: SharedArrayBuffer;
let timeState: Float64Array;
let speedState: Float64Array;
let controlState: Int32Array;
let histogramState: Int32Array;
let waveformState: Float32Array;

const BUFFER_SIZE = 8192;

if (typeof SharedArrayBuffer !== 'undefined') {
    sharedBuffer = new SharedArrayBuffer(BUFFER_SIZE);
} else {
    sharedBuffer = new ArrayBuffer(BUFFER_SIZE) as any;
}

// 1. Initialize Views
const initViews = (buffer: SharedArrayBuffer) => {
    timeState = new Float64Array(buffer, 0, 1);
    speedState = new Float64Array(buffer, 8, 1);
    controlState = new Int32Array(buffer, 16, 4);
    histogramState = new Int32Array(buffer, 32, 1024);
    waveformState = new Float32Array(buffer, 4128, 256);
};

initViews(sharedBuffer);

export const initSharedState = (buffer: SharedArrayBuffer) => {
    initViews(buffer);
};

export const getSharedBuffer = () => sharedBuffer;

const isShared = typeof SharedArrayBuffer !== 'undefined';

// SCOPE DATA ACCESSORS
export const writeHistogram = (channel: number, bin: number, value: number) => {
    if (isShared) {
        Atomics.store(histogramState, (channel * 256) + bin, value);
    } else {
        histogramState[(channel * 256) + bin] = value;
    }
};
export const readHistogram = (channel: number, bin: number) => {
    return isShared ? Atomics.load(histogramState, (channel * 256) + bin) : histogramState[(channel * 256) + bin];
};

export const writeWaveform = (index: number, value: number) => {
    waveformState[index] = value;
};
export const readWaveform = (index: number) => waveformState[index];

export const readSharedTime = () => timeState[0];
export const writeSharedTime = (time: number) => { timeState[0] = time; };

export const readSharedSpeed = () => speedState[0];
export const writeSharedSpeed = (speed: number) => { speedState[0] = speed; };

export const readSharedPlaying = () => isShared ? Atomics.load(controlState, 0) === 1 : controlState[0] === 1;
export const writeSharedPlaying = (isPlaying: boolean) => {
    if (isShared) {
        Atomics.store(controlState, 0, isPlaying ? 1 : 0);
    } else {
        controlState[0] = isPlaying ? 1 : 0;
    }
};

export const incrementFrameCounter = () => {
    if (isShared) {
        return Atomics.add(controlState, 1, 1);
    } else {
        const val = controlState[1];
        controlState[1] = val + 1;
        return val;
    }
};
export const getFrameCount = () => isShared ? Atomics.load(controlState, 1) : controlState[1];

export const incrementCommandSequence = () => {
    if (isShared) {
        return Atomics.add(controlState, 2, 1);
    } else {
        const val = controlState[2];
        controlState[2] = val + 1;
        return val;
    }
};
export const getCommandSequence = () => isShared ? Atomics.load(controlState, 2) : controlState[2];
