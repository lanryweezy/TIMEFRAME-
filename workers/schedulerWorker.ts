/**
 * Nanosecond-Precision DAW Scheduler Worker
 * Provides high-priority timing interrupts for the Absolute Peak DAW.
 */

let timerId: any = null;
let interval = 25; // ms

self.onmessage = (e: MessageEvent) => {
  if (e.data === 'START') {
    timerId = setInterval(() => {
      self.postMessage('TICK');
    }, interval);
  } else if (e.data === 'STOP') {
    if (timerId) clearInterval(timerId);
    timerId = null;
  } else if (typeof e.data === 'number') {
    interval = e.data;
    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(() => self.postMessage('TICK'), interval);
    }
  }
};
