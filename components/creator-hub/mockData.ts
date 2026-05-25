export const TRAJECTORY_DATA = [
  { hour: '0h', potential: 10, actual: 5 },
  { hour: '4h', potential: 45, actual: 38 },
  { hour: '8h', potential: 85, actual: 92 },
  { hour: '12h', potential: 140, actual: 156 },
  { hour: '16h', potential: 220, actual: 210 },
  { hour: '20h', potential: 380, actual: 410 },
  { hour: '24h', potential: 650, actual: 720 },
];

export const RETENTION_DATA = [
  { time: '0s', retention: 100 },
  { time: '3s', retention: 92 },
  { time: '10s', retention: 78 },
  { time: '30s', retention: 65 },
  { time: '1m', retention: 58 },
  { time: '2m', retention: 42 },
  { time: '5m', retention: 35 },
];

export const VIRAL_TRENDS = [
  { name: 'Cinematic Glitch', score: 94, platform: 'TikTok', trend: 'rising' },
  { name: 'Cyberpunk Aesthetic', score: 88, platform: 'Instagram', trend: 'stable' },
  { name: 'Hyperlapse HDR', score: 72, platform: 'YouTube', trend: 'hot' },
  { name: 'AI Voiceover V4', score: 91, platform: 'Reels', trend: 'rising' },
];

export const MOCK_SCHEDULES = [
  {
    id: 'sch_1',
    platform: 'tiktok',
    scheduledTime: Date.now() + 3600000 * 5,
    status: 'scheduled',
    caption: 'The future of AI video is here. #ai #video #studio',
    hashtags: ['ai', 'video', 'studio'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
  },
  {
    id: 'sch_2',
    platform: 'reels',
    scheduledTime: Date.now() + 3600000 * 24,
    status: 'draft',
    caption: 'Behind the scenes of our latest creation.',
    hashtags: ['creative', 'vfx'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop',
  },
];

export const MOCK_AB_TESTS = [
  {
    id: 'ab_1',
    name: 'Thumbnail Performance Test',
    status: 'running',
    variants: [
      {
        id: 'v1',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=225&fit=crop',
        title: 'Option A: Abstract',
        metrics: { ctr: 4.2, avgViewTime: 45 },
      },
      {
        id: 'v2',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
        title: 'Option B: Portrait',
        metrics: { ctr: 5.8, avgViewTime: 52 },
      },
    ],
  },
];
