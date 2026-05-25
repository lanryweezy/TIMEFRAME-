import { Keyframe } from './common';
import { AudioBlock } from './audio';

export interface VideoTransform {
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
  opacity: number;
  keyframes: Record<string, Keyframe[]>;
}

export interface VideoAdjustment {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hue: number;
  filterIntensity: number;
  vignetteIntensity: number;
  vignetteSize: number;
  neuralDenoise?: number; // 0-100
  edgeEnhancement?: number; // 0-100
}

export interface EnhancementProfile {
  upscale: boolean;
  denoise: boolean;
  colorCorrection: boolean;
  strength: number;
}

export interface StabilizationProfile {
  smoothness: number;
  cropFactor: number;
  temporalSmoothing: boolean;
}

export interface Hotspot {
  id: string;
  time: number;
  x: number;
  y: number;
  label: string;
  url: string;
  duration: number;
}

export interface MaskProfile {
  id: string;
  type: 'rectangle' | 'circle' | 'path' | 'luminance' | 'alpha';
  points?: { x: number; y: number }[];
  feather: number;
  invert: boolean;
  expansion: number;
  opacity?: number;
}

export interface VfxNodeData {
  id: string;
  type: string; // 'input' | 'blur' | 'color' | 'mask' | 'composite' | 'output'
  label: string;
  position: { x: number; y: number };
  params: Record<string, any>;
  inputs: Record<string, string | null>; // inputName -> outputNodeId
}

export interface VfxGraph {
  nodes: VfxNodeData[];
  outputNodeId: string | null;
}

export interface VideoClip {
  id: string;
  url: string;
  proxyUrl?: string;
  thumbnail: string;
  startTime: number;
  duration: number;
  name: string;
  trackId: number; // For multi-track
  transitionIn?: 'none' | 'fade' | 'slide' | 'zoom';
  transitionOut?: 'none' | 'fade' | 'slide' | 'zoom';
  transitionDuration?: number;
  speed: number; // For speed ramping
  contentStartOffset?: number; // Offset into the source file
  linkedAudioId?: string; // For J/L Cuts
  audioOffset?: number; // For J/L Cuts (relative to video start)
  audioDuration?: number; // For J/L Cuts
  fadeInDuration?: number;
  fadeOutDuration?: number;
  isEnhanced?: boolean;
  enhancementProfile?: EnhancementProfile;
  isStabilized?: boolean;
  stabilizationProfile?: StabilizationProfile;
  isAdjustmentLayer?: boolean;
  color?: string; // Optional custom color for the clip
  adjustment?: VideoAdjustment;
  smartGradeEnabled?: boolean;
  smartGradePreset?: string;
  spatialAudioEnabled?: boolean;
  autoReframeEnabled?: boolean;
  reframeFocus?: 'center' | 'subject' | 'dynamic';
  mask?: MaskProfile;
  motionBlur?: boolean;
  motionBlurIntensity?: number;
  shutterAngle?: number;
  samples?: number;
  blendMode?:
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'add'
    | 'difference'
    | 'exclusion'
    | 'color_dodge'
    | 'color_burn'
    | 'hard_light'
    | 'soft_light'
    | 'vivid_light'
    | 'pin_light';
  colorGrading?: {
    lift: { r: number; g: number; b: number; w: number };
    gamma: { r: number; g: number; b: number; w: number };
    gain: { r: number; g: number; b: number; w: number };
    offset: { r: number; g: number; b: number; w: number };
    lut?: string;
    curves?: {
      luma: { x: number; y: number }[];
      red: { x: number; y: number }[];
      green: { x: number; y: number }[];
      blue: { x: number; y: number }[];
    };
    gradingNodes?: {
      id: string;
      label: string;
      type: 'corrector' | 'lut' | 'curved' | 'cst';
      enabled: boolean;
      data: any;
    }[];
    colorSpace: 'rec709' | 'log' | 'linear';
  };
  vfxGraph?: VfxGraph;
  tracking?: {
    id: string;
    type: 'point' | 'planar' | 'camera';
    status: 'idle' | 'tracking' | 'done';
    confidence: number;
    points: { x: number; y: number; t: number }[];
    searchRange: number;
    featureQuality: number;
    occlusionHandling: 'none' | 'linear_prediction' | 'smart_fill';
    smoothing: number;
  };
  rotoscope?: {
    enabled: boolean;
    points: { x: number; y: number }[];
    feather: number;
    autoKeyframe: boolean;
    mode: 'smart_segmentation' | 'manual_spline' | 'magic_edge';
    refinement: number;
    propagation: boolean;
  };
  audio?: {
    volume: number;
    pan: number;
    eq: { low: number; mid: number; high: number };
    voiceClarity: boolean;
    voiceIsolation: number;
    spectralRepair: boolean;
    deClickEnabled?: boolean;
    deClickIntensity?: number;
    loudnessStandard: 'EBU_R128' | 'ATSC_A85' | 'CUSTOM';
  };
  transform?: VideoTransform;
  motionIntensity?: number; // Added
  audioEnergy?: number; // Added
  narrativeRole?: 'hook' | 'setup' | 'climax' | 'resolution' | 'filler'; // Added
  depth?: {
    enabled: boolean;
    near: number;
    far: number;
    focalLength: number;
    depthMapUrl?: string;
  };
  effects?: {
    chromaticAberration: number;
    glitchIntensity: number;
    scanlineOpacity: number;
    vignette: number;
    noise: number;
    bloom: number;
  };
  vfx?: {
    halation: number;
    grain: number;
    motionBlur: number;
    beauty: number;
    rayTracing: {
      enabled: boolean;
      intensity: number;
      samples: number;
      bounces: number;
      denoise: boolean;
    };
    relighting: {
      enabled: boolean;
      intensity: number;
      lightPosition: { x: number; y: number; z: number };
      lightColor: string;
      faceMapping: boolean;
    };
    denoising: {
      enabled: boolean;
      strength: number;
      temporalWeight: number;
      mode: 'fast' | 'cinematic' | 'neural';
    };
    inPainting: {
      enabled: boolean;
      targetId: string;
      propagation: boolean;
      fillMode: 'content_aware' | 'neural_dream';
    };
    depthMap: {
      enabled: boolean;
      intensity: number;
      focalPoint: number;
      visualization: boolean;
    };
    styleDNA: {
      signature: string;
      intensity: number;
      colorBias: number;
      textureBias: number;
    };
    bokeh: {
      enabled: boolean;
      aperture: number;
      shape: 'circle' | 'hexagon' | 'anamorphic';
      highlightBoost: number;
    };
    colorMatch: {
      referenceClipId: string;
      lumaMatch: number;
      chromaMatch: number;
    };
    volumetrics: {
      enabled: boolean;
      density: number;
      anisotropy: number; // God rays direction
      shadows: boolean;
      neuralAtmosphere: boolean;
    };
    procedural: {
      vexCode: string;
      seed: number;
      complexity: number;
      isActive: boolean;
    };
    temporalConsistency: {
      enabled: boolean;
      flowWeight: number;
      historyBuffer: number; // Number of frames to look back
      neuralDeFlicker: boolean;
    };
    realitySynthesis: {
      enabled: boolean;
      nerfModelId: string;
      cameraPath: string; // Serialized 3D path
      focalDepth: number;
      reconstructionQuality: number;
    };
    quantumSimulation: {
      type: 'fluid' | 'smoke' | 'fire' | 'cloth';
      viscosity: number;
      turbulence: number;
      vorticity: number;
      neuralEnhancement: boolean;
      isActive: boolean;
    };
    holographicDepth: {
      enabled: boolean;
      planes: number;
      lightFieldIntensity: number;
      parallaxStrength: number;
    };
    sentientLogic: {
      enabled: boolean;
      narrativeIntent: string;
      emotionalBias: number; // -1 (Melancholy) to 1 (Euphoria)
      autonomousAdjustment: boolean;
    };
    multiversalBranching: {
      active: boolean;
      branchSeed: string;
      divergenceFactor: number;
      realityBlend: number;
    };
    bioDigitalSim: {
      type: 'growth' | 'decay' | 'cellular' | 'neural_network';
      organicWeight: number;
      evolutionSpeed: number;
      dnaSignature: string;
    };
    noeticSynthesis: {
      enabled: boolean;
      archetypeId: string; // Jungian/Collective Archetypes
      consciousnessSync: number;
      manifestationStrength: number;
    };
    ontologicalVariables: {
      gravityConstant: number;
      lightSpeedShift: number;
      timeDilation: number;
      physicalLawDivergence: number;
    };
    hyperDimensional: {
      active: boolean;
      dimensionScale: number; // 3D to 5D
      parallaxFolding: number;
      nonEuclideanGeometry: boolean;
    };
    recursiveSingularity: {
      enabled: boolean;
      recursionDepth: number; // Infinite zoom/detail
      neuralFractalMode: boolean;
      detailIntensity: number;
    };
    akashicSourcing: {
      enabled: boolean;
      dataStream: 'history' | 'future' | 'mythology' | 'parallel';
      hallucinationDepth: number;
      sourcingQuery: string;
    };
    zeroPointEnergy: {
      active: boolean;
      vacuumFluctuation: number;
      radianceIntensity: number; // HDR beyond 32-bit
      energyStability: number;
    };
    quantumEntanglement: {
      isEntangled: boolean;
      targetClipId: string;
      propertySync: 'all' | 'color' | 'motion' | 'vfx';
      entanglementStrength: number;
    };
    metaNarrative: {
      enabled: boolean;
      symbolismWeight: number;
      subtextVisualization: boolean;
      archetypalOverlayId: string;
    };
    particleSystemId?: string;
    customShader?: string;
  };
  hotspots?: Hotspot[];
}

export interface SubtitleBlock {
  id: string;
  startTime: number;
  duration: number;
  text: string;
  style?: 'standard' | 'impact' | 'minimal';
}

export interface TextBlock {
  id: string;
  text: string;
  startTime: number;
  duration: number;
  animation:
    | 'none'
    | 'fade'
    | 'pop'
    | 'slide'
    | 'typewriter'
    | 'glitch'
    | 'mask_reveal'
    | 'floating'
    | '3d_flip';
  is3D?: boolean;
  depth?: number;
  rotation3D?: { x: number; y: number; z: number };
  extrude?: number;
  perspective?: number;
  bevel?: number;
  reflection?: number;
  material?: 'matte' | 'metallic' | 'neon' | 'glass' | 'iridescent' | 'brushed_metal';
  lightingIntensity?: number;
  lightSource?: { x: number; y: number; z: number };
  glowColor?: string;
  letterSpacing?: number;
  wordSpacing?: number;
  lineHeight?: number;
  typingSpeed?: number;
  characterPhysics?: boolean;
  motionBlur?: boolean;
  motionBlurIntensity?: number;
  easing?:
    | 'linear'
    | 'ease_in_out'
    | 'elastic'
    | 'bounce'
    | 'exponential'
    | 'easeIn'
    | 'easeOut'
    | 'easeInOut'
    | 'circIn'
    | 'circOut'
    | 'backIn'
    | 'backOut'
    | 'anticipate';
  stiffness?: number;
  damping?: number;
  mass?: number;
  motionPath?:
    | 'linear'
    | 'bezier'
    | 'orbital'
    | 'sine'
    | 'infinite_loop'
    | 'random_walk'
    | 'turbulence_field'
    | 'magnetic_point'
    | 'geometric_snapping';
  typographyPreset?:
    | 'none'
    | 'glitch'
    | 'kinetic'
    | 'floating'
    | 'flicker'
    | 'scatter'
    | 'reveal'
    | 'matrix_cascade'
    | 'typewriter_advanced'
    | 'depth_pulse'
    | 'voxel_build'
    | 'vibrant_glow';
  animationPreset?:
    | 'pop_in'
    | 'slide_mask'
    | 'elastic_bounce'
    | 'liquid_distortion'
    | 'overshoot_3d'
    | 'physics_drop'
    | 'cloth_ripple'
    | 'magnetic_attract';
  behavior?:
    | 'none'
    | 'drift'
    | 'float'
    | 'pulse'
    | 'avoid_mouse'
    | 'attract_mouse'
    | 'orbit_center'
    | 'shake_on_beat';
  mask?: MaskProfile;
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
    x: number;
    y: number;
    opacity: number;
    shadow: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    backgroundOpacity?: number;
    padding?: number;
    borderRadius?: number;
    blendMode?:
      | 'normal'
      | 'multiply'
      | 'screen'
      | 'overlay'
      | 'lighten'
      | 'darken'
      | 'add'
      | 'difference'
      | 'exclusion'
      | 'color_dodge'
      | 'color_burn'
      | 'hard_light'
      | 'soft_light';
  };
}

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'star' | 'polygon';

export interface ShapeBlock {
  id: string;
  type: ShapeType;
  startTime: number;
  duration: number;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  points?: number;
  cornerRadius?: number;
  sides?: number;
  innerRadius?: number;
  morphPath?: string;
  dashOffset?: number;
  is3D?: boolean;
  depth?: number;
  material?: 'matte' | 'metallic' | 'glass' | 'neon';
  animation: 'none' | 'draw' | 'scale' | 'fade' | 'morph' | 'path_reveal' | 'trim_path';
  transform: VideoTransform;
  blendMode:
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'add'
    | 'difference'
    | 'exclusion'
    | 'color_dodge'
    | 'color_burn'
    | 'hard_light'
    | 'soft_light';
  mask?: MaskProfile;
  behavior?:
    | 'none'
    | 'drift'
    | 'float'
    | 'pulse'
    | 'avoid_mouse'
    | 'attract_mouse'
    | 'orbit_center'
    | 'shake_on_beat';
  mass?: number;
  stiffness?: number;
  motionBlur?: boolean;
  motionBlurIntensity?: number;
}

export interface ParticleSystem {
  id: string;
  type: 'snow' | 'fire' | 'dust' | 'sparkles' | 'confetti' | 'energy' | 'nebula' | 'plasma';
  startTime: number;
  duration: number;
  intensity: number;
  color: string;
  direction: number; // angle
  spread: number;
  velocity: number;
  size: number;
  life: number;
  gravity: number;
  turbulence: number;
  vorticity?: number;
  attraction?: number;
  noiseScale?: number;
  particleShadow?: boolean;
  collisionRange?: number;
  restitution?: number;
  colorPrimary: string;
  colorSecondary?: string;
  blendMode: 'normal' | 'screen' | 'overlay' | 'add' | 'multiply' | 'color_dodge';
}

export type EffectType =
  | 'none'
  | 'vhs'
  | 'glitch'
  | 'scanline'
  | 'film_grain'
  | 'chromatic_aberration'
  | 'data_stream'
  | 'shake'
  | 'bounce'
  | 'slide_up'
  | 'motion_blur'
  | 'bloom'
  | 'kaleidoscope'
  | 'pixelate'
  | 'rotoscoped_glow';

export interface EffectBlock {
  id: string;
  type: EffectType;
  startTime: number;
  duration: number;
  intensity: number;
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '2.35:1';
export type FilterPreset =
  | 'none'
  | 'vibrant'
  | 'cinema'
  | 'vintage'
  | 'bw'
  | 'cyber'
  | 'horror'
  | 'gold'
  | 'neon'
  | 'tiktok_vibes'
  | 'reel_glow';

export interface BeatSyncSettings {
  enabled: boolean;
  intensity: number;
  syncType: 'cut' | 'zoom' | 'effect';
}

export interface ChromaKey {
  enabled: boolean;
  color: string;
  intensity: number;
  shadow: number;
  spillSuppression?: number;
  edgeThinning?: number;
}

export interface StyleProfile {
  favoriteFilters: Record<string, number>;
  averagePacing: number; // clips per minute
  preferredTransitions: Record<string, number>;
  colorVibeBias: {
    warmth: number;
    vibrancy: number;
    contrast: number;
  };
  lastNeuralSync?: number;
}

export interface Sequence {
  id: string;
  name: string;
  videoClips: VideoClip[];
  subtitleTrack: SubtitleBlock[];
  textTrack: TextBlock[];
  audioTrack: AudioBlock[];
  effectTrack: EffectBlock[];
  shapeTrack: ShapeBlock[];
  particleTrack: ParticleSystem[];
}
