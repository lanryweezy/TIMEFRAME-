
import { VideoState, VideoClip, SubtitleBlock, TextBlock, AudioBlock, ProjectFormat, ProjectTemplate } from './types';

const DEFAULT_ADJUSTMENT = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  hue: 0,
  filterIntensity: 100,
  vignetteIntensity: 0,
  vignetteSize: 50,
};

const MOCK_CLIPS: VideoClip[] = [
  {
    id: 'c1',
    name: 'Intro Sequence',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=100&h=60',
    startTime: 0,
    duration: 15,
    trackId: 1,
    speed: 1.0,
    fadeInDuration: 1.5,
    fadeOutDuration: 1.0,
    isEnhanced: false,
    isStabilized: false,
    adjustment: { ...DEFAULT_ADJUSTMENT }
  },
  {
    id: 'c2',
    name: 'Cinematic Landscape',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&h=60',
    startTime: 15,
    duration: 15,
    trackId: 1,
    speed: 1.0,
    fadeInDuration: 1.0,
    fadeOutDuration: 1.5,
    isEnhanced: false,
    isStabilized: false,
    adjustment: { ...DEFAULT_ADJUSTMENT }
  },
  {
    id: 'c3',
    name: 'B-Roll Overlay',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=100&h=60',
    startTime: 5,
    duration: 5,
    trackId: 2,
    speed: 1.0,
    fadeInDuration: 0.5,
    fadeOutDuration: 0.5,
    isEnhanced: false,
    isStabilized: false,
    adjustment: { ...DEFAULT_ADJUSTMENT }
  }
];

const MOCK_SUBTITLES: SubtitleBlock[] = [
  { id: 's1', startTime: 2, duration: 4, text: "Welcome to Vision Editor" },
  { id: 's2', startTime: 10, duration: 3, text: "Start your creative project" }
];

const MOCK_TEXT: TextBlock[] = [
    {
        id: 'txt1',
        text: 'Vision',
        startTime: 1,
        duration: 5,
        animation: 'typewriter',
        style: {
            fontFamily: 'Inter',
            fontSize: 48,
            color: '#FFFFFF',
            x: 50,
            y: 30,
            opacity: 1,
            shadow: '0 0 20px rgba(255, 255, 255, 0.4)',
            fontWeight: '700',
            textAlign: 'center'
        }
    }
];

const MOCK_AUDIO: AudioBlock[] = [
    {
        id: 'aud1',
        name: 'Master Sequence Audio',
        url: '',
        startTime: 0,
        duration: 30,
        volume: 0.8,
        trackId: 1,
        type: 'music',
        speed: 1.0,
        voiceEffect: 'none'
    }
];

export const INITIAL_VIDEO_STATE: VideoState = {
  markers: [],
  regions: [],
  isPlaying: false,
  currentTime: 0,
  duration: 30,
  volume: 0.8,
  activeMode: 'media',
  showCommandPalette: false,
  
  playbackSpeed: 1.0,
  aspectRatio: '16:9',
  
  chromaKey: {
      enabled: false,
      color: '#00ff00',
      intensity: 30,
      shadow: 20
  },
  
  audioSettings: {
      duckingEnabled: true,
      duckingRatio: 0.6
  },

  activeFilter: 'none',
  environmentUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1920&q=80',

  videoClips: MOCK_CLIPS,
  subtitleTrack: MOCK_SUBTITLES,
  textTrack: MOCK_TEXT,
  audioTrack: MOCK_AUDIO,
  effectTrack: [],
  shapeTrack: [],
  particleTrack: [],
  
  transform: {
    scale: 1,
    positionX: 0,
    positionY: 0,
    rotation: 0,
    opacity: 100,
    keyframes: {
        scale: [],
        positionX: [],
        positionY: [],
        rotation: [],
        opacity: []
    }
  },
  adjustment: { ...DEFAULT_ADJUSTMENT },
  sequences: [],
  activeSequenceId: undefined,
  lastSaved: Date.now(),
  isAnalyzing: false,
  isGenerating: false,
  // Fix: Removed 'isEnhanced' as it is not a property of VideoState.
  isEnhancing: false,
  isStabilizing: false,
  generationProgress: 0,
  zoomLevel: 100,
  projectName: 'Untitled Project',
  projectSettings: {
    resolution: { width: 1920, height: 1080 },
    fps: 24,
    colorSpace: 'rec709',
    bitDepth: 10,
    proxyEnabled: false,
  },
  socialPlatform: 'none',
  isAutoCaptioning: false,
  isRemovingBackground: false,
  isGeneratingAvatar: false,
  isTrackingFace: false,
  isAutoCutting: false,
  isRemovingSilence: false,
  isDetectingScenes: false,
  isOptimizingPacing: false,
  isRemovingObject: false,
  isSmoothingMotion: false,
  isDubbing: false,
  isGeneratingClips: false,
  isStabilizingFootage: false,
  isStoryboarding: false,
  isCloningVoice: false,
  isTranslating: false,
  isCleaningAudio: false,
  isReframing: false,
  isStyleTransferring: false,
  isGeneratingMusic: false,
  isGeneratingSFX: false,
  isGeneratingBroll: false,
  isGeneratingScene: false,
  isGeneratingCharacter: false,
  isGeneratingEnvironment: false,
  isGeneratingAnimation: false,
  isGeneratingLighting: false,
  isGeneratingCamera: false,
  isGeneratingThumbnails: false,
  isGeneratingVariants: false,
  isAnalyzingNarrative: false,
  isGeneratingScript: false,
  isGeneratingSocialCaption: false,
  isGeneratingHashtags: false,
  isPlatformOptimizing: false,
  isTrackingTrends: false,
  isGeneratingBrandAssets: false,
  isRotoscoping: false,
  isTrackingMotion: false,
  isGeneratingParticles: false,
  isApplyingAudioFX: false,
  isAnalyzingAudio: false,
  audioMetering: {
    peak: [0, 0],
    integrated: -70,
    shortTerm: -70,
  },
  showCreatorHub: false,
  collaboration: {
    activeProjectId: 'project-123',
    sessionUsers: [
        { id: '1', name: 'Alex Rivera', email: 'alex@studio.ai', role: 'owner', isOnline: true, lastActive: Date.now() },
        { id: '2', name: 'Jordan Chen', email: 'jordan@studio.ai', role: 'editor', isOnline: true, lastActive: Date.now() }
    ],
    isMultiplayerActive: true,
    lastSyncTime: Date.now(),
    liveComments: [],
    activeAgents: [
        { id: 'a1', type: 'creative', status: 'idle' }
    ]
  },
  currentProject: {
    id: 'project-123',
    name: 'Untitled Project',
    ownerId: '1',
    members: [
        { id: '1', name: 'Alex Rivera', email: 'alex@studio.ai', role: 'owner', isOnline: true, lastActive: Date.now() },
        { id: '2', name: 'Jordan Chen', email: 'jordan@studio.ai', role: 'editor', isOnline: true, lastActive: Date.now() },
        { id: '3', name: 'Sarah Miller', email: 'sarah@studio.ai', role: 'viewer', isOnline: false, lastActive: Date.now() - 3600000 }
    ],
    comments: [
        { id: 'c1', authorId: '1', authorName: 'Alex Rivera', text: 'Consider boosting the saturation in the intro highlights.', timestamp: Date.now() - 7200000, timecode: 5.2, resolved: false },
        { id: 'c2', authorId: '2', authorName: 'Jordan Chen', text: 'Transition at 00:12 feels a bit too abrupt.', timestamp: Date.now() - 3600000, timecode: 12.0, resolved: true }
    ],
    versions: [
        { id: 'v1', name: 'Final Review Candidate', commitHash: 'a7b8c9', authorId: '1', timestamp: Date.now() - 86400000, snapshot: {}, description: 'Final grade applied, audio normalized.' },
        { id: 'v2', name: 'Client Feedback V2', commitHash: 'x1y2z3', authorId: '2', timestamp: Date.now() - 172800000, snapshot: {}, description: 'Reduced length of middle section.' }
    ],
    sharedAssets: [],
    createdAt: Date.now() - 604800000,
    updatedAt: Date.now(),
    status: 'draft'
  },
  assetManager: {
    library: [
        { 
            id: 'a1', name: 'Intro_Shot_NYC.mp4', type: 'video', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&q=80', size: 45000000, path: '/Raw/Footage', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000,
            metadata: { tags: ['city', 'drone', 'night'], resolution: { width: 3840, height: 2160 }, sceneDescription: 'Cinematic drone shot of Manhattan skyline at dusk.' },
            isFavorite: true, isBrandAsset: false
        },
        { 
            id: 'b1', name: 'Logo_Primary_White.png', type: 'image', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80', thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&q=80', size: 1200000, path: '/Brand/Logos', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000,
            metadata: { tags: ['logo', 'branding', 'vector'], colors: ['#FFFFFF'] },
            isFavorite: false, isBrandAsset: true
        }
    ],
    collections: [
        { id: 's1', name: 'Faces Detected', query: 'type:video has:face', assetIds: ['a1'], icon: 'User' },
        { id: 's2', name: 'Brand Assets', query: 'is:brand', assetIds: ['b1'], icon: 'Shield' }
    ],
    searchQuery: '',
    isSearching: false,
    selectedAssetIds: [],
    storageUsage: { total: 10000000000, used: 4280000000 }
  },
  agentLayer: {
    agents: [
        { id: 'ag1', name: 'Zoe', role: 'editor', description: 'Expert in narrative pacing and multi-cam sync.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', status: 'online', skills: ['pacing', 'trimming'], tasks: [], specialization: 'Narrative Storytelling', isInstalledFromEcosystem: true },
        { id: 'ag2', name: 'Lens', role: 'cinematography', description: 'AI specialist for 3D camera paths and lighting.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', status: 'online', skills: ['framing', 'lighting'], tasks: [], specialization: '3D Scene Physics' },
        { id: 'ag3', name: 'Echo', role: 'sound', description: 'Neural audio engineer for immersive design.', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80', status: 'online', skills: ['foley', 'cleanup'], tasks: [], specialization: 'Immersive Soundscapes' },
        { id: 'ag4', name: 'Aura', role: 'branding', description: 'Guardian of brand identity and aesthetic consistency.', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80', status: 'online', skills: ['color', 'typography'], tasks: [], specialization: 'Visual Identity' },
        { id: 'ag5', name: 'Spark', role: 'marketing', description: 'Conversion-focused editor for social growth.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80', status: 'busy', skills: ['hooks', 'trending'], tasks: ['t1'], specialization: 'Growth Loops' },
        { id: 'ag6', name: 'Flash', role: 'vfx', description: 'Real-time particle dynamics and neural compositing.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', status: 'online', skills: ['particles', 'masking'], tasks: [], specialization: 'Procedural VFX' },
        { id: 'ag7', name: 'Snap', role: 'thumbnail', description: 'Generates high-CTR thumbnails using heat-map prediction.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', status: 'online', skills: ['composition', 'ctr_prediction'], tasks: [], specialization: 'Visual Marketing' },
        { id: 'ag8', name: 'Optima', role: 'optimizer', description: 'AI ad-spend optimization and variant generator.', avatar: 'https://images.unsplash.com/photo-1506794778202-95e026b9119f?w=200&q=80', status: 'offline', skills: ['variants', 'ab_testing'], tasks: [], specialization: 'Performance Creative' },
        { id: 'ag9', name: 'Fable', role: 'storytelling', description: 'Narrative structure and emotional arc specialist.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', status: 'online', skills: ['pacing', 'narrative_flow'], tasks: [], specialization: 'Narrative Arcs' }
    ],
    tasks: [
        { id: 't1', agentId: 'ag5', type: 'Viral Hook Optimization', status: 'processing', progress: 65, createdAt: Date.now() - 120000, updatedAt: Date.now() }
    ],
    skills: [
        { id: 'pacing', name: 'Neural Pacing', description: 'Analyze dialogue and emotional beats for perfect cuts.', capability: 'auto_cut' },
        { id: 'framing', name: 'Golden Focus', description: 'Auto-reframe footage using cinematic composition rules.', capability: 'set_neural_reframe' },
        { id: 'particles', name: 'Neuro-Particles', description: 'Generate 3D particles that react to scene movement.', capability: 'set_spatial_state' },
        { id: 'ctr_prediction', name: 'CTR Predictor', description: 'Simulates viewer eye-tracking to optimize thumbnail click-through.', capability: 'analyze_thumbnail' },
        { id: 'narrative_flow', name: 'Story Weaver', description: 'Identifies narrative gaps and suggests B-roll bridges.', capability: 'analyze_narrative' },
        { id: 'variants', name: 'Variant Forge', description: 'Auto-generates multi-platform ad variations.', capability: 'generate_variants' },
        { id: 'hooks', name: 'Viral Hook AI', description: 'Synthesizes high-retention openings based on current trends.', capability: 'generate_hook' }
    ],
    activeAgentId: 'ag1'
  },
  beatSync: {
    enabled: false,
    intensity: 50,
    syncType: 'cut'
  },
  selectedIds: [],
  magneticTimeline: true,
  rippleEdit: true,
  snapSettings: {
    playhead: true,
    clips: true,
    markers: true
  },
  lockedTracks: [],
  trackNames: { 1: 'Video Track 1', 2: 'Overlay Track 1' },
  trackHeights: { 1: 80, 2: 80 },
  proxyMode: false,
  multiCamMode: false,
  analytics: {
    views: { label: 'Total Views', value: '1.2M', change: 12.5, trend: 'up' },
    engagement: { label: 'Engagement', value: '8.4%', change: 2.1, trend: 'up' },
    retention: { label: 'Avg. Retention', value: '42s', change: 5.4, trend: 'up' },
    reach: { label: 'Reach', value: '4.8M', change: 8.9, trend: 'up' },
    heatmapData: Array.from({ length: 20 }).map((_, i) => ({ x: i, y: 30 + Math.random() * 60 }))
  },
  distribution: {
    schedules: [
      {
        id: 'sch_1',
        platform: 'tiktok',
        scheduledTime: Date.now() + 3600000 * 5,
        status: 'scheduled',
        caption: 'The future of AI video is here. #ai #video #studio',
        hashtags: ['ai', 'video', 'studio'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop'
      },
      {
        id: 'sch_2',
        platform: 'reels',
        scheduledTime: Date.now() + 3600000 * 24,
        status: 'draft',
        caption: 'Behind the scenes of our latest creation.',
        hashtags: ['creative', 'vfx'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop'
      }
    ],
    abTests: [
      {
        id: 'ab_1',
        name: 'Launch Thumbnail Test',
        status: 'running',
        variants: [
          { id: 'v1', thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=225&fit=crop', title: 'Minimalist Dark', metrics: { ctr: 4.2, avgViewTime: 45 } },
          { id: 'v2', thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop', title: 'Action Portrait', metrics: { ctr: 5.8, avgViewTime: 52 } }
        ]
      }
    ],
    connectedAccounts: [
      { platform: 'tiktok', username: '@vision_studio', isConnected: true },
      { platform: 'instagram', username: 'vision_studio_official', isConnected: true },
      { platform: 'youtube', username: 'Vision Studio', isConnected: true },
      { platform: 'twitter', username: '@vision_ai', isConnected: true }
    ]
  },
  brandKit: {
    name: 'Default Brand',
    colors: ['#000000', '#ffffff', '#eab308'],
    fonts: ['Inter', 'Space Grotesk'],
    logos: []
  },
  history: {
    past: [],
    future: []
  }
};

export const INITIAL_STATE = INITIAL_VIDEO_STATE;

export const PROJECT_FORMATS: ProjectFormat[] = [
  { id: 'yt-long', name: 'YouTube Long', ratio: '16:9', dimensions: { width: 1920, height: 1080 }, icon: 'Monitor' },
  { id: 'tiktok', name: 'TikTok / Shorts', ratio: '9:16', dimensions: { width: 1080, height: 1920 }, icon: 'Smartphone' },
  { id: 'insta', name: 'Instagram', ratio: '1:1', dimensions: { width: 1080, height: 1080 }, icon: 'Instagram' },
  { id: 'vimeo', name: 'Vimeo', ratio: '16:9', dimensions: { width: 1920, height: 1080 }, icon: 'Video' },
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  { id: 'cinematic', name: 'Cinematic Masterpiece', description: 'Deep color grading, slow pacing.', category: 'Cinematic', icon: 'Sparkles' },
  { id: 'music-video', name: 'Music Video', description: 'Beat-synced transitions.', category: 'Music', icon: 'Music' },
  { id: 'vlog-fast', name: 'Viral Vlog', description: 'Fast cuts, high motion.', category: 'Social', icon: 'Zap' },
  { id: 'doc', name: 'Documentary', description: 'Clear narrative, subtle.', category: 'Cinematic', icon: 'Film' },
];

const STORAGE_KEY = 'vision_editor_save_v1';

export const saveProject = (state: VideoState) => {
  try {
    // Strip large objects that shouldn't be persisted to localStorage to prevent QuotaExceededError
    const { history, lastSaved, ...stateToSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.warn('Failed to save project to local storage:', error);
    // If it's still failing, we might want to clear some more things or just fail silently
  }
};

export const loadProject = (): VideoState | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    const state: VideoState = JSON.parse(saved);
    // Sanitize: filter out bad URLs
    if (state.audioTrack) {
        state.audioTrack = state.audioTrack.filter(track => !track.url?.includes('soundhelix'));
    }
    return state;
  } catch {
    return null;
  }
};

export const SAMPLE_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
export const INITIAL_CHAT_MESSAGE = "Timeframe Studio AI active. I can help you synthesize high-frontier content:\n- Gen-AI: Text-to-Video, Image-to-Video & Environment synthesis\n- Smart Editing: Auto-cut, Pacing optimization & Beat-sync\n- Visual FX: Background removal, Neural rotoscoping & Tracking\n- Audio: Voice cloning, Noise cleanup & Immersive soundscapes\n\nWhat are we creating today?";
