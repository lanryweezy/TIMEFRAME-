import { DOMParser } from '@xmldom/xmldom';
import { VideoState, VideoClip } from '../types';
import { INITIAL_STATE } from '../constants';

/**
 * Neural Project Translator Service
 * Handles importing project files from professional NLEs (Premiere, FCP, Resolve).
 */
export class NLEImportService {
  /**
   * Parses Premiere Pro / Final Cut Pro 7 XML (XMEML).
   */
  static async parseFCPXML(xmlText: string): Promise<Partial<VideoState>> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    const projectName = doc.getElementsByTagName('name')[0]?.textContent || 'Imported Project';
    const sequence = doc.getElementsByTagName('sequence')[0];
    
    if (!sequence) throw new Error('Invalid FCP XML: No sequence found');

    const videoClips: VideoClip[] = [];
    const videoTracks = sequence.getElementsByTagName('video')[0]?.getElementsByTagName('track') || [];

    // Parse Video Tracks
    for (let t = 0; t < videoTracks.length; t++) {
      const track = videoTracks[t];
      const clipItems = track.getElementsByTagName('clipitem');

      for (let i = 0; i < clipItems.length; i++) {
        const item = clipItems[i];
        const id = item.getAttribute('id') || crypto.randomUUID().slice(0, 8);
        const name = item.getElementsByTagName('name')[0]?.textContent || 'Clip';
        
        // FCP XML uses frame counts based on project FPS
        const start = parseInt(item.getElementsByTagName('start')[0]?.textContent || '0');
        const end = parseInt(item.getElementsByTagName('end')[0]?.textContent || '0');
        const in_ = parseInt(item.getElementsByTagName('in')[0]?.textContent || '0');
        const out = parseInt(item.getElementsByTagName('out')[0]?.textContent || '0');
        
        // Standard NLE mapping:
        // duration = (out - in)
        // start time on timeline = start
        const fps = 30; // Default fallback
        
        videoClips.push({
          id,
          name,
          startTime: start / fps,
          duration: (end - start) / fps,
          originalDuration: (out - in_) / fps,
          url: '', // Needs relinking
          type: 'video',
          trackId: t + 1,
          opacity: 1,
          volume: 1,
          thumbnail: '', 
          isAdjustmentLayer: false
        });
      }
    }

    return {
      projectName: `${projectName} (Translated)`,
      videoClips,
      duration: Math.max(...videoClips.map(c => c.startTime + c.duration), 30),
    };
  }

  /**
   * Parses CMX 3600 EDL (Edit Decision List).
   */
  static async parseEDL(edlText: string): Promise<Partial<VideoState>> {
    const lines = edlText.split('\n');
    const videoClips: VideoClip[] = [];
    const currentClip: Partial<VideoClip> | null = null;

    // Regex for CMX3600 line: 001  AX       V     C        00:00:01:00 00:00:02:00 00:00:10:00 00:00:11:00
    const clipRegex = /^(\d+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\d{2}:\d{2}:\d{2}:\d{2})\s+(\d{2}:\d{2}:\d{2}:\d{2})\s+(\d{2}:\d{2}:\d{2}:\d{2})\s+(\d{2}:\d{2}:\d{2}:\d{2})/;

    for (const line of lines) {
      const match = line.match(clipRegex);
      if (match) {
        const [_, id, tape, track, edit, srcIn, srcOut, recIn, recOut] = match;
        
        const startTime = this.timecodeToSeconds(recIn);
        const endTime = this.timecodeToSeconds(recOut);
        
        videoClips.push({
          id: `edl-${id}`,
          name: `Clip ${tape}`,
          startTime,
          duration: endTime - startTime,
          url: '', // Needs relinking
          type: 'video',
          trackId: 1,
          opacity: 1,
          volume: 1,
          thumbnail: '',
          isAdjustmentLayer: false
        });
      } else if (line.startsWith('* FROM CLIP NAME:')) {
          if (videoClips.length > 0) {
              videoClips[videoClips.length - 1].name = line.replace('* FROM CLIP NAME:', '').trim();
          }
      }
    }

    return {
      projectName: 'EDL Import',
      videoClips,
      duration: Math.max(...videoClips.map(c => c.startTime + c.duration), 30),
    };
  }

  private static timecodeToSeconds(tc: string, fps: number = 30): number {
    const parts = tc.split(':').map(Number);
    if (parts.length !== 4) return 0;
    return parts[0] * 3600 + parts[1] * 60 + parts[2] + parts[3] / fps;
  }
}
