import { z } from 'zod';

// Video Clip Validation Schema
export const VideoClipSchema = z.object({
  id: z.string().uuid(),
  src: z.string().url(),
  startTime: z.number().min(0),
  duration: z.number().positive(),
  trimStart: z.number().min(0).default(0),
  trimEnd: z.number().positive(),
  volume: z.number().min(0).max(1).default(1),
  opacity: z.number().min(0).max(1).default(1),
  speed: z.number().positive().default(1),
  filters: z.array(z.string()).default([]),
  transform: z.object({
    x: z.number().default(0),
    y: z.number().default(0),
    scale: z.number().positive().default(1),
    rotation: z.number().default(0),
  }).default({}),
  audio: z.object({
    volume: z.number().min(0).max(1).default(1),
    pan: z.number().min(-1).max(1).default(0),
    fadeIn: z.number().min(0).default(0),
    fadeOut: z.number().min(0).default(0),
    eq: z.object({
      low: z.number().min(0).max(200).default(100),
      mid: z.number().min(0).max(200).default(100),
      high: z.number().min(0).max(200).default(100),
    }).default({}),
  }).optional(),
});

// Text Overlay Validation Schema
export const TextOverlaySchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1).max(2000),
  startTime: z.number().min(0),
  duration: z.number().positive(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  style: z.object({
    fontFamily: z.string().default('Outfit'),
    fontSize: z.number().positive().default(48),
    fontWeight: z.number().min(100).max(900).default(700),
    color: z.string().default('#ffffff'),
    backgroundColor: z.string().optional(),
    textAlign: z.enum(['left', 'center', 'right']).default('center'),
    lineHeight: z.number().positive().default(1.2),
  }),
  animation: z.object({
    type: z.enum(['none', 'fade', 'slide', 'scale', 'typewriter']).default('fade'),
    easing: z.string().default('ease-out'),
    duration: z.number().positive().default(1),
  }).optional(),
});

// Audio Track Validation Schema
export const AudioTrackSchema = z.object({
  id: z.string().uuid(),
  src: z.string().url(),
  startTime: z.number().min(0),
  duration: z.number().positive(),
  volume: z.number().min(0).max(1).default(1),
  fadeIn: z.number().min(0).default(0),
  fadeOut: z.number().min(0).default(0),
  ducking: z.object({
    enabled: z.boolean().default(false),
    threshold: z.number().min(0).max(1).default(0.3),
    ratio: z.number().positive().default(4),
    attack: z.number().positive().default(0.01),
    release: z.number().positive().default(0.25),
  }).optional(),
});

// Project Settings Validation Schema
export const ProjectSettingsSchema = z.object({
  resolution: z.object({
    width: z.number().positive().multipleOf(2),
    height: z.number().positive().multipleOf(2),
  }),
  frameRate: z.number().positive().default(30),
  aspectRatio: z.string().default('16:9'),
  colorSpace: z.enum(['srgb', 'rec709', 'rec2020', 'p3']).default('srgb'),
});

// Project State Validation Schema
export const ProjectStateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  settings: ProjectSettingsSchema,
  videoClips: z.array(VideoClipSchema).default([]),
  audioTrack: z.array(AudioTrackSchema).default([]),
  textTrack: z.array(TextOverlaySchema).default([]),
  markers: z.array(z.object({
    id: z.string().uuid(),
    time: z.number().min(0),
    label: z.string(),
    color: z.string(),
  })).default([]),
});

// API Response Validation Schemas
export const AIResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export const ExportSettingsSchema = z.object({
  format: z.enum(['mp4', 'webm', 'mov', 'gif']),
  quality: z.enum(['low', 'medium', 'high', 'ultra']),
  resolution: z.enum(['720p', '1080p', '1440p', '4k']),
  frameRate: z.number().positive(),
  codec: z.enum(['h264', 'h265', 'vp9', 'av1']),
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    return { success: false, errors: new z.ZodError([{
      code: 'invalid_type',
      expected: 'unknown',
      received: 'unknown',
      path: [],
      message: 'Unknown validation error',
    }])};
  }
}

// Type exports
export type VideoClip = z.infer<typeof VideoClipSchema>;
export type TextOverlay = z.infer<typeof TextOverlaySchema>;
export type AudioTrack = z.infer<typeof AudioTrackSchema>;
export type ProjectSettings = z.infer<typeof ProjectSettingsSchema>;
export type ProjectState = z.infer<typeof ProjectStateSchema>;
export type ExportSettings = z.infer<typeof ExportSettingsSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;