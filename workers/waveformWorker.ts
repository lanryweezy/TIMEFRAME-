
self.onmessage = (e: MessageEvent<{id: string}>) => {
    const { id } = e.data;
    const seed = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const bars = Array.from({ length: 60 }).map((_, i) => {
        const val = Math.sin((seed + i) * 0.5) * 40 + Math.cos((seed + i) * 0.3) * 20 + 50;
        return Math.max(10, Math.min(100, val));
    });
    self.postMessage(bars);
};
