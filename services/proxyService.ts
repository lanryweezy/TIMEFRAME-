import { getProxyFromCache, saveProxyToCache } from './indexedDbService';

/**
 * Generates or retrieves a high-speed video proxy stream for editor timeline scrubbing.
 * Intercepts calls, checks IndexedDB cache, streams binary chunks, and caches completed streams on the fly.
 */
export const generateProxy = async (assetUrl: string): Promise<ReadableStream<Uint8Array>> => {
  // Step 1: Check IndexedDB Cache first
  try {
    const cachedObjectUrl = await getProxyFromCache(assetUrl);
    if (cachedObjectUrl) {
      const cachedResponse = await fetch(cachedObjectUrl);
      if (cachedResponse.ok && cachedResponse.body) {
        return cachedResponse.body;
      }
    }
  } catch (error) {
    console.warn('[ProxyService] Cache lookup failed, proceeding with direct stream generation:', error);
  }

  // Step 2: Stream generation with real-time chunk accumulation for automated caching
  let sourceStream: ReadableStream<Uint8Array>;

  try {
    if (assetUrl.startsWith('http') || assetUrl.startsWith('/') || assetUrl.startsWith('blob:')) {
      const response = await fetch(assetUrl, { headers: { Range: 'bytes=0-' } });
      if (response.ok && response.body) {
        sourceStream = response.body;
      } else {
        throw new Error(`Failed HTTP status: ${response.status}`);
      }
    } else {
      throw new Error(`Unsupported protocol: ${assetUrl}`);
    }
  } catch (error) {
    console.error('[ProxyService] Stream generation failed:', error);
    throw error;
  }

  // Step 3: Pipe through a custom accumulator that intercepts chunks and stores them
  const chunks: Uint8Array[] = [];
  const reader = sourceStream.getReader();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      // Begin background reader loop
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Save the accumulated binary chunks to IndexedDB cache
            if (chunks.length > 0) {
              const fullBlob = new Blob(chunks, { type: 'video/mp4' });
              await saveProxyToCache(assetUrl, fullBlob);
              console.log(`[ProxyService] Successfully cached video proxy stream for: ${assetUrl} (${fullBlob.size} bytes)`);
            }
            controller.close();
            break;
          }
          if (value) {
            chunks.push(value);
            controller.enqueue(value);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      reader.cancel();
    }
  });
};
