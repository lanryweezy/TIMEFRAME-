
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/opfs/')) {
        event.respondWith(
            (async function() {
                try {
                    const filename = decodeURIComponent(url.pathname.replace('/opfs/', ''));
                    const root = await navigator.storage.getDirectory();
                    const fileHandle = await root.getFileHandle(filename);
                    const file = await fileHandle.getFile();
                    return new Response(file, {
                        headers: {
                            'Content-Type': file.type || 'application/octet-stream',
                            'Content-Length': file.size.toString(),
                            'Cross-Origin-Resource-Policy': 'cross-origin'
                        }
                    });
                } catch (e) {
                    return new Response('File not found', { status: 404 });
                }
            })()
        );
    }
});
