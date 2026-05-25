use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct QuantumDemuxer {
    index_ptr: usize, 
    index_len: usize,
    last_indexed_ts: f64,
}

#[wasm_bindgen]
impl QuantumDemuxer {
    #[wasm_bindgen(constructor)]
    pub fn new(ptr: usize, len: usize) -> Self {
        Self {
            index_ptr: ptr,
            index_len: len,
            last_indexed_ts: -1.0,
        }
    }

    /// SAFE MEMORY WRAPPER
    /// Ensures we don't write out of bounds of the shared buffer.
    #[inline(always)]
    unsafe fn write_index(&self, sample_idx: usize, field: usize, value: f64) {
        let offset = sample_idx * 5 + field;
        if offset < self.index_len {
            *((self.index_ptr as *mut f64).add(offset)) = value;
        }
    }

    /// ELITE INDEXING ENGINE
    pub fn index_packet(&mut self, sample_idx: usize, ts: f64, dur: f64, off: f64, sz: f64, is_key: bool) {
        // Discontinuity Detection (Item 82)
        if self.last_indexed_ts > 0.0 && ts < self.last_indexed_ts {
            // Potential B-frame or out-of-order packet, log for temporal alignment
            // web_sys::console::warn_1(&"Discontinuity detected in stream".into());
        }

        unsafe {
            self.write_index(sample_idx, 0, ts);
            self.write_index(sample_idx, 1, dur);
            self.write_index(sample_idx, 2, off);
            self.write_index(sample_idx, 3, sz);
            self.write_index(sample_idx, 4, if is_key { 1.0 } else { 0.0 });
        }
        self.last_indexed_ts = ts;
    }

    /// BINARY SEARCH KEYFRAME ENGINE (O(log N))
    /// Replaces the linear O(N) search for near-instant seeking on massive timelines.
    pub fn find_nearest_keyframe(&self, target_ts: f64) -> usize {
        let sample_count = self.index_len / 5;
        let mut low = 0;
        let mut high = sample_count - 1;
        let mut best_idx = 0;

        unsafe {
            let p_base = self.index_ptr as *const f64;
            
            while low <= high {
                let mid = (low + high) / 2;
                let ts = *p_base.add(mid * 5);
                let is_key = *p_base.add(mid * 5 + 4) == 1.0;

                if ts <= target_ts {
                    if is_key {
                        best_idx = mid;
                    }
                    low = mid + 1;
                } else {
                    if mid == 0 { break; }
                    high = mid - 1;
                }
            }
        }
        
        // Final fallback: Ensure we returned a KEYFRAME
        // If the binary search found a non-keyframe, we must scan backwards
        unsafe {
            let p_base = self.index_ptr as *const f64;
            while best_idx > 0 && *p_base.add(best_idx * 5 + 4) != 1.0 {
                best_idx -= 1;
            }
        }

        best_idx
    }

    pub fn batch_index(&mut self, start_idx: usize, data: &[f64]) {
        let packet_count = data.len() / 5;
        if (start_idx + packet_count) * 5 <= self.index_len {
            unsafe {
                let p_dest = (self.index_ptr as *mut f64).add(start_idx * 5);
                std::ptr::copy_nonoverlapping(data.as_ptr(), p_dest, data.len());
            }
            if packet_count > 0 {
                self.last_indexed_ts = data[data.len() - 5];
            }
        }
    }
}
