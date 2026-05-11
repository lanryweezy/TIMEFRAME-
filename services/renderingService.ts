import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { VideoState } from '../types';

let ffmpeg: FFmpeg | null = null;

export const initRendering = async () => {
    if (ffmpeg) return ffmpeg;
    
    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    return ffmpeg;
};

export const renderVideo = async (state: VideoState, onProgress: (progress: number) => void) => {
    const ffmpeg = await initRendering();
    
    // 1. Prepare files in FFmpeg FS
    const inputFiles = [];
    for (const clip of state.videoClips) {
        const filename = `${clip.id}.mp4`;
        await ffmpeg.writeFile(filename, await fetchFile(clip.url));
        inputFiles.push(filename);
    }

    // 2. Build FFmpeg command for concatenation
    // Create a concat file
    const concatContent = inputFiles.map(file => `file '${file}'`).join('\n');
    await ffmpeg.writeFile('concat.txt', concatContent);

    // 3. Exec concatenation
    // Using concat demuxer
    await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-c', 'copy', 'output.mp4']);

    // 4. Read output
    const data = await ffmpeg.readFile('output.mp4');
    
    // Clean up
    for(const file of inputFiles) await ffmpeg.deleteFile(file);
    await ffmpeg.deleteFile('concat.txt');
    
    onProgress(100);
    return URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
};
