/**
 * TIMEFRAME RATIONAL TIMEBASE
 * 
 * Why integers (Ticks)?
 * JavaScript floats (0.1 + 0.2 !== 0.3) lead to "frame drift".
 * After 10 minutes of editing, a clip might be 0.0000004s off, 
 * causing a "Black Frame" glitch in the renderer.
 * 
 * We use 30,000 Ticks per second. 
 * Divisible by: 24, 25, 30, 48, 50, 60 fps.
 */

export const TICKS_PER_SECOND = 30000;

/**
 * Converts seconds (float) to timeline ticks (integer).
 */
export const secondsToTicks = (seconds: number): number => {
    return Math.round(seconds * TICKS_PER_SECOND);
};

/**
 * Converts timeline ticks (integer) to seconds (float).
 */
export const ticksToSeconds = (ticks: number): number => {
    return ticks / TICKS_PER_SECOND;
};

/**
 * Normalizes a time value to the nearest tick to prevent accumulation errors.
 */
export const normalizeToTick = (seconds: number): number => {
    return ticksToSeconds(secondsToTicks(seconds));
};

/**
 * Precise addition of timeline durations.
 */
export const addTime = (s1: number, s2: number): number => {
    return ticksToSeconds(secondsToTicks(s1) + secondsToTicks(s2));
};

/**
 * Precise subtraction of timeline durations.
 */
export const subTime = (s1: number, s2: number): number => {
    return ticksToSeconds(secondsToTicks(s1) - secondsToTicks(s2));
};
