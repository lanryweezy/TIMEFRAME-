<div align="center">
<img width="1200" height="475" alt="Timeframe Studio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Timeframe Studio

AI-powered video editing platform with intelligent automation, real-time collaboration, and professional-grade export capabilities.

## Features

- 🎬 **AI-Powered Editing** - Intelligent scene detection, auto-editing, and smart transitions
- 🧠 **Neural Grounding** - AI agents (Zoe, Lens, Echo) provide visually-grounded suggestions directly on the timeline
- 🌪️ **Virality Wind Tunnel** - Real-time engagement heatmaps with interactive neural "fixes" for weak segments
- 🎨 **Multi-Track Timeline** - Video, audio, text, and effects tracks with precision controls
- 🤖 **Generative AI** - Text-to-video, image generation, and AI voiceovers
- 📱 **Social Export** - One-click export for TikTok, YouTube, Instagram, and more
- 💾 **Auto-Save** - Automatic project persistence with IndexedDB
- 🌍 **i18n Support** - Available in 8 languages
- 🌙 **Theme Support** - Dark and light modes with system preference detection

## Run Locally

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd TIMEFRAME--main

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

| Variable         | Description                           | Required |
| ---------------- | ------------------------------------- | -------- |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes      |

## Available Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start development server  |
| `npm run build`   | Build for production      |
| `npm run preview` | Preview production build  |
| `npm run lint`    | Run ESLint                |
| `npm run format`  | Format code with Prettier |

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host"]
```

### Environment Setup for Production

1. Set `GEMINI_API_KEY` in your deployment platform
2. Configure CORS if using external asset storage
3. Set up a reverse proxy for API rate limiting

## Project Structure

```
TIMEFRAME--main/
├── components/          # React components
│   ├── landing/        # Landing page components
│   ├── properties/     # Property panels
│   └── sidebar/        # Sidebar tabs
├── hooks/              # Custom React hooks
│   ├── useVideoEditor.ts
│   ├── useAIController.ts
│   ├── useTheme.tsx
│   └── useServiceWorker.tsx
├── services/           # API and database services
├── workers/            # Web Workers for processing
├── i18n/               # Internationalization
├── types.ts            # TypeScript definitions
├── constants.ts        # App constants
└── index.css           # Global styles
```

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (Framer Motion)
- **Graphics**: Pixi.js 8
- **Video Processing**: FFmpeg WASM
- **AI**: Google Gemini API
- **Storage**: IndexedDB via idb

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

- 📖 [Documentation](#)
- 🐛 [Report Issues](#)
- 💬 [Community Discord](#)
