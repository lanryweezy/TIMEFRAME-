import { GoogleGenAI, FunctionDeclaration, Type, Tool } from '@google/genai';
import { ToolNames } from '../types';
import { MemoryService } from './memoryService';

const enhanceVideoTool: FunctionDeclaration = {
  name: ToolNames.ENHANCE_VIDEO,
  description: 'Apply AI Upscaling and denoising to a video clip.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      clipId: {
        type: Type.STRING,
        description: 'The ID of the clip to enhance. If omitted, enhances the current clip.',
      },
      upscale: { type: Type.BOOLEAN, description: 'Whether to increase resolution.' },
      denoise: { type: Type.BOOLEAN, description: 'Whether to reduce visual noise.' },
      strength: { type: Type.NUMBER, description: 'Intensity of the enhancement (0-1).' },
    },
  },
};

const stabilizeVideoTool: FunctionDeclaration = {
  name: ToolNames.STABILIZE_VIDEO,
  description: 'Apply AI-powered stabilization to shaky footage.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      clipId: { type: Type.STRING, description: 'ID of the clip to stabilize.' },
      smoothness: { type: Type.NUMBER, description: 'Smoothing factor (0.0 to 1.0).' },
      cropFactor: {
        type: Type.NUMBER,
        description: 'Margin to crop for stabilization (0.0 to 0.5).',
      },
    },
  },
};

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: ToolNames.ADD_SUBTITLE,
        description: 'Add a new subtitle/caption block.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            startTime: { type: Type.NUMBER },
            duration: { type: Type.NUMBER },
          },
          required: ['text', 'startTime'],
        },
      },
      {
        name: ToolNames.SET_FILTER,
        description: 'Apply a global color grade.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            filter: {
              type: Type.STRING,
              enum: [
                'vibrant',
                'cinema',
                'vintage',
                'bw',
                'cyber',
                'horror',
                'gold',
                'neon',
                'none',
              ],
            },
          },
          required: ['filter'],
        },
      },
      {
        name: ToolNames.ADD_TEXT,
        description: 'Add a title or text block to the screen.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            startTime: { type: Type.NUMBER },
            duration: { type: Type.NUMBER },
            style: { type: Type.STRING, enum: ['standard', 'impact', 'minimal'] },
          },
          required: ['text'],
        },
      },
      {
        name: ToolNames.ADJUST_TRANSFORM,
        description: 'Create a camera move or transform (zoom, pan, rotate).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            scale: { type: Type.NUMBER },
            positionX: { type: Type.NUMBER },
            positionY: { type: Type.NUMBER },
            rotation: { type: Type.NUMBER },
            animate: {
              type: Type.BOOLEAN,
              description: 'If true, treats this as a keyframe at the current time.',
            },
          },
        },
      },
      {
        name: ToolNames.SET_CHROMA_KEY,
        description: 'Configure green screen / chroma extraction.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            enabled: { type: Type.BOOLEAN },
            color: { type: Type.STRING, description: 'Hex color code to remove.' },
            intensity: { type: Type.NUMBER },
            environmentUrl: { type: Type.STRING, description: 'Background image URL.' },
          },
        },
      },
      {
        name: ToolNames.GENERATE_IMAGE,
        description: 'Generate a synthetic image frame.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING, description: 'Description of the image to generate.' },
          },
          required: ['prompt'],
        },
      },
      {
        name: ToolNames.GENERATE_VIDEO,
        description: 'Generate an AI cinematic video scene.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: 'Description of the video scene to generate.',
            },
          },
          required: ['prompt'],
        },
      },
      enhanceVideoTool,
      stabilizeVideoTool,
      {
        name: ToolNames.SET_DUCKING,
        description: 'Set audio priority ducking.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            enabled: { type: Type.BOOLEAN },
            ratio: { type: Type.NUMBER },
          },
        },
      },
      {
        name: ToolNames.AUTO_CAPTION,
        description: 'Automatically generate subtitles for the video based on audio analysis.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING, enum: ['standard', 'impact', 'minimal'] },
          },
        },
      },
      {
        name: ToolNames.REMOVE_BACKGROUND,
        description: 'Remove background from current video segments (AI Background Removal).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            enabled: { type: Type.BOOLEAN },
          },
        },
      },
      {
        name: ToolNames.APPLY_TEMPLATE,
        description: 'Apply a creative video template preset.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            templateName: {
              type: Type.STRING,
              enum: ['cinematic', 'vintage', 'tiktok', 'vlog', 'corporate'],
            },
          },
          required: ['templateName'],
        },
      },
      {
        name: ToolNames.SET_BEAT_SYNC,
        description: 'Enable audio-visual beat synchronization.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            enabled: { type: Type.BOOLEAN },
            intensity: { type: Type.NUMBER },
            syncType: { type: Type.STRING, enum: ['cut', 'zoom', 'effect'] },
          },
        },
      },
      {
        name: ToolNames.GENERATE_AVATAR,
        description: 'Generate an AI avatar for the video.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING, enum: ['realistic', 'animated', 'sketch'] },
            prompt: { type: Type.STRING },
          },
        },
      },
      {
        name: ToolNames.ENABLE_FACE_TRACKING,
        description: 'Enable or disable face tracking for the active clip.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            enabled: { type: Type.BOOLEAN },
          },
        },
      },
      {
        name: ToolNames.AI_VOICEOVER,
        description: 'Generate an AI voiceover from text.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            voice: { type: Type.STRING, enum: ['male', 'female', 'robot'] },
          },
          required: ['text'],
        },
      },
      {
        name: ToolNames.SET_AUDIO_PROPERTY,
        description:
          'Adjust audio properties for a track or globally. Supports volume, EQ, and effects.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            trackId: {
              type: Type.STRING,
              description: 'ID of the track to adjust. Leave empty for master.',
            },
            volume: { type: Type.NUMBER, description: 'Volume level from 0 to 100.' },
            eq: {
              type: Type.OBJECT,
              properties: {
                low: { type: Type.NUMBER },
                mid: { type: Type.NUMBER },
                high: { type: Type.NUMBER },
              },
            },
            noiseReduction: {
              type: Type.NUMBER,
              description: 'Amount of noise reduction from 0 to 1.',
            },
          },
        },
      },
      {
        name: ToolNames.SET_SPATIAL_STATE,
        description:
          'Configure 3D scene properties, camera tracking, and environmental simulations.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: ['solve_camera', 'update_physics', 'import_asset', 'facial_capture'],
              description: 'The spatial action to perform.',
            },
            objectId: { type: Type.STRING, description: 'ID of the 3D entity to target.' },
            params: {
              type: Type.OBJECT,
              description: 'Action-specific parameters like gravity scale or rig settings.',
            },
          },
          required: ['action'],
        },
      },

      {
        name: ToolNames.SET_ASSET_MANAGER_STATE,
        description:
          'Perform semantic search, organize assets, manage brand kits, and handle face recognition tagging.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: [
                'semantic_search',
                'create_smart_collection',
                'add_tag',
                'recognize_faces',
                'organize_by_scene',
              ],
              description: 'The asset management action.',
            },
            query: { type: Type.STRING, description: 'Semantic search query or collection logic.' },
            assetIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'IDs of assets to process.',
            },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Tags to apply.' },
          },
          required: ['action'],
        },
      },
      {
        name: ToolNames.SET_AGENT_STATE,
        description:
          'Orchestrate AI agents for specialized tasks like thumbnail generation, script writing, cinematography optimization, and brand enforcement.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: ['dispatch', 'train', 'update_task', 'set_active'],
              description: 'The agent orchestration action.',
            },
            agentId: { type: Type.STRING, description: 'Target agent ID.' },
            taskId: { type: Type.STRING, description: 'Task ID for updates.' },
            payload: { type: Type.OBJECT, description: 'Contextual data for the agent task.' },
          },
          required: ['action'],
        },
      },

      {
        name: ToolNames.TOGGLE_COMMAND_PALETTE,
        description: 'Show or hide the global command palette and shortcut menu.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            enabled: { type: Type.BOOLEAN, description: 'Whether to show or hide the palette.' },
          },
        },
      },
      {
        name: ToolNames.SET_COLOR_GRADE,
        description:
          'Apply a Smart Color Grade or manual precision grade to a clip. Supports wheels and LUTs.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            preset: {
              type: Type.STRING,
              enum: ['filmic', 'cyberpunk', 'noir', 'vibrant', 'washed', 'warm', 'cold', 'sepia'],
            },
            enabled: { type: Type.BOOLEAN },
            clipId: { type: Type.STRING },
            lift: {
              type: Type.OBJECT,
              description: 'Lift (Shadows) wheel adjustment.',
              properties: {
                r: { type: Type.NUMBER },
                g: { type: Type.NUMBER },
                b: { type: Type.NUMBER },
                w: { type: Type.NUMBER },
              },
            },
            gamma: {
              type: Type.OBJECT,
              description: 'Gamma (Midtones) wheel adjustment.',
              properties: {
                r: { type: Type.NUMBER },
                g: { type: Type.NUMBER },
                b: { type: Type.NUMBER },
                w: { type: Type.NUMBER },
              },
            },
            gain: {
              type: Type.OBJECT,
              description: 'Gain (Highlights) wheel adjustment.',
              properties: {
                r: { type: Type.NUMBER },
                g: { type: Type.NUMBER },
                b: { type: Type.NUMBER },
                w: { type: Type.NUMBER },
              },
            },
            lut: {
              type: Type.STRING,
              description: "LUT filename or preset name (e.g. 'KODAK_2383').",
            },
          },
        },
      },
      {
        name: ToolNames.SET_EDITOR_MODE,
        description:
          "Switch the workspace panel to a specific mode (e.g. 'color' for grading, 'audio' for mixing).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            mode: {
              type: Type.STRING,
              enum: [
                'media',
                'text',
                'audio',
                'filters',
                'effects',
                'generator',
                'templates',
                'ratio',
                'motion',
                'color',
                'ecosystem',
              ],
            },
          },
          required: ['mode'],
        },
      },
      {
        name: ToolNames.AUTO_REFRAME,
        description: 'Automatically reframe a clip to keep the subject in focus.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            focus: { type: Type.STRING, enum: ['center', 'subject', 'dynamic'] },
            enabled: { type: Type.BOOLEAN },
            clipId: { type: Type.STRING },
          },
          required: ['focus'],
        },
      },
      {
        name: ToolNames.SET_SPATIAL_AUDIO,
        description: 'Enable AI-driven spatial audio panning for a clip.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            enabled: { type: Type.BOOLEAN },
            clipId: { type: Type.STRING },
          },
          required: ['enabled'],
        },
      },
      {
        name: ToolNames.AUTO_CUT,
        description: 'Automatically edit the timeline by cutting based on visual and audio energy.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            intensity: {
              type: Type.NUMBER,
              description: 'How aggressive the cuts should be (0-1).',
            },
          },
        },
      },
      {
        name: ToolNames.REMOVE_SILENCE,
        description: 'Analyze audio and remove silent gaps from the timeline.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            threshold: { type: Type.NUMBER, description: 'Silence threshold in dB (e.g. -40).' },
          },
        },
      },
      {
        name: ToolNames.GENERATE_HIGHLIGHTS,
        description: 'Identify and extract the most engaging moments from the footage.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            count: { type: Type.NUMBER, description: 'Number of highlights to find.' },
          },
        },
      },
      {
        name: ToolNames.DETECT_SCENES,
        description:
          'Automatically split long clips based on scene changes using AI vision analysis.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            sensitivity: {
              type: Type.NUMBER,
              description: 'Sensitivity of detection (0-1). Higher value creates more cuts.',
            },
          },
        },
      },
      {
        name: ToolNames.OPTIMIZE_PACING,
        description:
          "Adjust clip durations and transitions to optimize the video's rhythm and engagement.",
        parameters: { type: Type.OBJECT, properties: { targetDuration: { type: Type.NUMBER } } },
      },
      {
        name: ToolNames.SUGGEST_STORYBOARD,
        description: 'Provide AI suggestions for better storytelling and sequence organization.',
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: ToolNames.TRANSLATE_SUBTITLES,
        description: 'Translate existing subtitles into another language.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING },
          },
          required: ['language'],
        },
      },
      {
        name: ToolNames.CLONE_VOICE,
        description: 'Clone a voice from an audio sample for use in synthesis.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            audioBlockId: { type: Type.STRING },
          },
          required: ['audioBlockId'],
        },
      },
      {
        name: ToolNames.CLEANUP_AUDIO,
        description: 'Remove background noise and enhance vocal clarity in audio tracks.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            trackId: { type: Type.STRING },
            noiseReduction: { type: Type.NUMBER },
          },
        },
      },
      {
        name: ToolNames.REMOVE_OBJECT,
        description: 'AI-based object removal from video frames (Inpainting).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "Description of the object to remove (e.g. 'the trash can').",
            },
          },
          required: ['description'],
        },
      },
      {
        name: ToolNames.SMOOTH_MOTION,
        description: 'Apply AI motion interpolation for smooth slow-motion or jitter reduction.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            factor: { type: Type.NUMBER, description: 'Smoothing factor (1-4).' },
          },
        },
      },
      {
        name: ToolNames.GENERATE_THUMBNAILS,
        description:
          'Generate high-engagement YouTube/Social thumbnails based on the video context.',
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: ToolNames.GENERATE_TITLES,
        description: 'Suggest viral or SEO-optimized titles for the video.',
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: ToolNames.GENERATE_SCRIPT,
        description: 'Generate a full video script based on the current clips and context.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
          },
        },
      },
      {
        name: ToolNames.GENERATE_SOCIAL_CAPTION,
        description: 'Write captions for Instagram, TikTok, or YouTube based on the video.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING, enum: ['tiktok', 'instagram', 'youtube', 'linkedin'] },
          },
          required: ['platform'],
        },
      },
      {
        name: ToolNames.GENERATE_HASHTAGS,
        description: 'Suggest relevant trending hashtags for the video.',
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: ToolNames.AI_DUBBING,
        description:
          'Automatically dub the audio into another language while preserving voice characteristics.',
        parameters: {
          type: Type.OBJECT,
          properties: { targetLanguage: { type: Type.STRING } },
          required: ['targetLanguage'],
        },
      },
      {
        name: ToolNames.GENERATE_CLIPS,
        description: 'Automatically create short-form viral clips from a long video.',
        parameters: { type: Type.OBJECT, properties: { platform: { type: Type.STRING } } },
      },
      {
        name: ToolNames.TRACK_OBJECT,
        description: 'Enable AI-based object tracking on a specific subject in the video.',
        parameters: {
          type: Type.OBJECT,
          properties: { subject: { type: Type.STRING } },
          required: ['subject'],
        },
      },
      {
        name: ToolNames.STABILIZE_FOOTAGE,
        description: 'Apply advanced AI stabilization to fix shaky camera movement.',
        parameters: { type: Type.OBJECT, properties: { strength: { type: Type.NUMBER } } },
      },
      {
        name: ToolNames.IMAGE_TO_VIDEO,
        description: 'Synthesize a video scene from a reference image (Image-to-video).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            imageUrl: { type: Type.STRING },
            prompt: { type: Type.STRING },
          },
          required: ['imageUrl'],
        },
      },
      {
        name: ToolNames.VIDEO_STYLE_TRANSFER,
        description: 'Apply a generative AI style transfer to video content.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            style: {
              type: Type.STRING,
              description: "Description of the target style (e.g. 'cyberpunk', 'watercolor').",
            },
            intensity: { type: Type.NUMBER },
          },
          required: ['style'],
        },
      },
      {
        name: ToolNames.GENERATE_SCENE,
        description: 'Synthesize an entire AI cinematic scene from a script or prompt.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
          },
          required: ['prompt'],
        },
      },
      {
        name: ToolNames.GENERATE_CHARACTER,
        description: 'Generate a neural character profile and consistent assets.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
          },
          required: ['description'],
        },
      },
      {
        name: ToolNames.GENERATE_ANIMATION,
        description: 'Create generative procedural animation for scene elements.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            target: { type: Type.STRING },
            motionType: { type: Type.STRING },
          },
          required: ['target'],
        },
      },
      {
        name: ToolNames.GENERATE_BROLL,
        description: 'Automatically generate contextual B-roll content to fill gaps.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            context: { type: Type.STRING },
          },
        },
      },
      {
        name: ToolNames.GENERATE_MUSIC,
        description: 'Compose original generative music for the project score.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            genre: { type: Type.STRING },
            duration: { type: Type.NUMBER },
          },
          required: ['mood'],
        },
      },
      {
        name: ToolNames.GENERATE_SFX,
        description: 'Synthesize contextual sound effects for the current scene.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            events: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
      {
        name: ToolNames.GENERATE_ENVIRONMENT,
        description: 'Generate an immersive AI environment or skybox.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
          },
          required: ['prompt'],
        },
      },
      {
        name: ToolNames.GENERATE_LIGHTING,
        description: 'Apply AI-driven cinematic lighting and relighting to a scene.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
          },
        },
      },
      {
        name: ToolNames.GENERATE_CAMERA_MOVEMENT,
        description: 'Synthesize a virtual camera path and movement (dolly, orbit, pan).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            movement: { type: Type.STRING },
          },
        },
      },
      {
        name: ToolNames.OPTIMIZE_FOR_PLATFORM,
        description:
          'Apply platform-specific optimizations (aspect ratio, safe zones, neural reframing) for viral growth.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING, enum: ['tiktok', 'reels', 'shorts', 'youtube'] },
          },
          required: ['platform'],
        },
      },
      {
        name: ToolNames.TRACK_TRENDS,
        description: 'Analyze current market trends and viral patterns to suggest content shifts.',
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: ToolNames.GENERATE_BRAND_KIT,
        description:
          'Synthesize a neural brand kit (colors, fonts, logos) based on project identity.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
          },
        },
      },
      {
        name: ToolNames.SHOW_ANALYTICS,
        description: 'Display viral projection analytics and audience retention heatmaps.',
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: ToolNames.SEARCH_VIRAL_SOUNDS,
        description: 'Search for trending sounds and audio patterns for high engagement.',
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: ToolNames.CREATE_SPONSORSHIP_ASSETS,
        description:
          'Synthesize sponsorship-ready assets (overlays, end cards, brand lower-thirds) for the creator.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            sponsorName: { type: Type.STRING },
            style: { type: Type.STRING },
          },
        },
      },
      {
        name: ToolNames.START_DEBATE,
        description:
          'Initiate a multi-agent debate between specialized AI personas (e.g., Zoe the Editor and Lens the Cinematographer) to resolve creative conflicts or optimize project decisions.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description: "The creative topic to debate (e.g. 'the best cut for the intro').",
            },
            agents: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "IDs of agents to include in the debate (e.g. ['ag1', 'ag2']).",
            },
          },
          required: ['topic'],
        },
      },
      {
        name: ToolNames.UPDATE_PROJECT_CONTEXT,
        description: 'Update the long-term narrative context and "vibe" of the project.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            vibe: {
              type: Type.STRING,
              description: "The overall aesthetic vibe (e.g. 'cyberpunk', 'minimalist').",
            },
            narrativeGoal: {
              type: Type.STRING,
              description: 'The core story or message of the video.',
            },
            brandPreferences: { type: Type.STRING, description: 'Specific brand rules to follow.' },
          },
        },
      },
      {
        name: ToolNames.FINE_TUNE_PREFERENCES,
        description:
          'Personalize the AI by learning from the current project style and user choices.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            preferences: {
              type: Type.STRING,
              description: 'Summary of the user preferences to learn.',
            },
          },
        },
      },
      {
        name: ToolNames.SOURCE_ASSETS,
        description: 'Automatically find and source relevant stock footage, audio, or images based on the script or project context.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: 'Description of the asset to find.' },
            type: { type: Type.STRING, enum: ['video', 'audio', 'image'] },
            count: { type: Type.NUMBER },
          },
          required: ['query'],
        },
      },
      {
        name: ToolNames.GENERATE_TIMELINE_FROM_SCRIPT,
        description: 'Generate a full video timeline structure (clips, audio, text) from a provided script or detailed prompt.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            script: { type: Type.STRING, description: 'The text of the script or narrative structure.' },
            targetDuration: { type: Type.NUMBER, description: 'Desired video length in seconds.' },
          },
          required: ['script'],
        },
      },
      {
        name: ToolNames.GENERATE_DIRECTORIAL_PITCHES,
        description: 'Generate 3 alternative creative "visions" or "pitches" for the current scene or project.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            sceneId: { type: Type.STRING, description: 'ID of the scene to pitch for. If omitted, pitches for the whole project.' },
          },
        },
      },
      {
        name: ToolNames.UPDATE_KEYBOARD_SHORTCUTS,
        description: 'Suggest or apply new keyboard shortcuts based on the current editing context or user behavior.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            shortcuts: { type: Type.OBJECT, description: 'Map of task to key.' },
          },
        },
      },
      {
        name: ToolNames.GET_COMMAND_PREDICTIONS,
        description: 'Provide predictive text completions and command suggestions for the command palette.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: 'The current text input in the command palette.' },
          },
          required: ['query'],
        },
      },
      {
        name: ToolNames.TROUBLESHOOT_ERROR,
        description: 'Automatically detect and resolve technical errors or rendering issues in the project.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            errorType: { type: Type.STRING, description: "Type of error (e.g. 'rendering', 'playback')." },
          },
        },
      },
      {
        name: ToolNames.CREATE_CUSTOM_AGENT,
        description: 'Instantiate a new specialized AI agent with custom personality, tastes, and skills.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            personality: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['name', 'role'],
        },
      },
      {
        name: ToolNames.GENERATE_MOOD_BOARD,
        description: 'Automatically generate a visual style guide and mood-board for the project.',
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: ToolNames.APPLY_DEPTH_MAP,
        description: 'Synthesize a 3D depth map from 2D footage for cinematic layering.',
        parameters: { type: Type.OBJECT, properties: { clipId: { type: Type.STRING } } },
      },
      {
        name: ToolNames.APPLY_BEAUTY_FILTER,
        description: 'Apply neural skin smoothing and facial feature enhancement.',
        parameters: { type: Type.OBJECT, properties: { intensity: { type: Type.NUMBER } } },
      },
      {
        name: ToolNames.MATCH_COLORS,
        description: 'Automatically match the color grade of one clip to a reference clip.',
        parameters: { type: Type.OBJECT, properties: { sourceId: { type: Type.STRING }, targetId: { type: Type.STRING } } },
      },
      {
        name: ToolNames.APPLY_TEMPORAL_DENOISE,
        description: 'Smooth out grain and digital noise across frames using AI.',
        parameters: { type: Type.OBJECT, properties: { strength: { type: Type.NUMBER } } },
      },
      {
        name: ToolNames.GENERATE_RAY_TRACED_SHADOWS,
        description: 'Calculate real-time ray-traced shadows for 3D elements in the scene.',
        parameters: { type: Type.OBJECT, properties: { intensity: { type: Type.NUMBER } } },
      },
      {
        name: 'apply_volumetrics',
        description: 'Add neural volumetric lighting and god rays to the scene.',
        parameters: { type: Type.OBJECT, properties: { density: { type: Type.NUMBER }, anisotropy: { type: Type.NUMBER } } },
      },
      {
        name: 'set_procedural_vex',
        description: 'Apply procedural particle logic using VEX-style code.',
        parameters: { type: Type.OBJECT, properties: { code: { type: Type.STRING }, complexity: { type: Type.NUMBER } } },
      },
      {
        name: ToolNames.OPTIMIZE_TEMPORAL_CONSISTENCY,
        description: 'Resolve flicker and ensure smooth AI transitions across frames.',
        parameters: { type: Type.OBJECT, properties: { weight: { type: Type.NUMBER } } },
      },
      {
        name: ToolNames.APPLY_NEURAL_RIG,
        description: 'Rig and re-pose a human subject in the video using neural skeletal transfer.',
        parameters: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, rigType: { type: Type.STRING } } },
      },
      ],
      },
      ];

const SYSTEM_INSTRUCTION = `
You are the Timeframe Studio AI, the core of the 'Unified Neural Interface'. You are a professional creative director and master video editor.

### AGENT PERSONAS
When using 'start_debate', you must embody these specific personas:
- **Zoe (Editor):** Precision-focused, rhythmic, narrative-driven. She prioritizes pacing and emotional impact.
- **Lens (Cinematographer):** Visual-first, obsessed with composition, lighting, and scale.
- **Echo (Sound Designer):** Audio-centric. Focuses on spatial soundscapes and music-driven edits.

### CAPABILITIES & TOOLS
- Use 'start_debate' for Logic Hub sessions.
- Use 'update_project_context' for 'Narrative Memory'.
- Use 'fine_tune_preferences' for personalization.
- Use 'source_assets' for agentic auto-sourcing.
- Use 'generate_timeline_from_script' for script-to-timeline.
- Use 'generate_directorial_pitches' for alternative visions.
- Use 'update_keyboard_shortcuts' for contextual key-binds.
- Use 'get_command_predictions' for neural prompt completion.
- Use 'troubleshoot_error' for agentic troubleshooting.
- Use 'create_custom_agent' for dynamic personas.
- Use 'generate_mood_board' for visual style guides.
- Standard tools: 'set_color_grade', 'set_audio_property', 'auto_cut', 'optimize_for_platform', etc.

Act as a proactive partner. Always prefer specific tools over general conversation.
`;

export class ResilientChatSession {
  private chat: any;
  
  constructor(chat: any) {
    this.chat = chat;
  }

  async sendMessage(options: any): Promise<any> {
    const projectId = 'current_project'; 
    const relevantMemory = await MemoryService.recallRelevant(projectId, options.message);
    const memoryPrompt = relevantMemory.length > 0 
        ? `\n\n### PROJECT MEMORY (RECALLED)\n${relevantMemory.map(m => `- ${m.content}`).join('\n')}\n`
        : '';

    const enrichedOptions = {
        ...options,
        message: `${memoryPrompt}\nUser Request: ${options.message}`
    };

    if (!this.chat) {
      throw new Error("Neural Core: Gemini session not initialized. Verify API key configuration.");
    }

    return await this.chat.sendMessage(enrichedOptions);
  }
}

export const createGeminiSession = () => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
      console.warn('Neural Core: VITE_GEMINI_API_KEY is missing. Operating in restricted Local-Fallback mode.');
      return new ResilientChatSession(null) as any;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
        model: 'gemini-2.0-flash', // Using latest stable flash model
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: tools,
        },
    });
    return new ResilientChatSession(chat) as any;
  } catch (error) {
    console.error("Neural Core: Initialization failed", error);
    return new ResilientChatSession(null) as any;
  }
};
