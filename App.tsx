console.log("APP.TSX: TOP-LEVEL EXECUTION START");
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { I18nProvider } from './i18n';
import { initErrorTracking, ErrorTracker } from './lib/errorTracking';
import { Settings } from './components/Settings';
import { Dashboard } from './components/Dashboard';
import { AssetUniverse } from './components/AssetUniverse';
import { LandingPage } from './components/LandingPage';
import { EditorView } from './components/EditorView';
import { VideoState, ProjectFormat, ProjectTemplate } from './types';
import { INITIAL_STATE } from './constants';
import { useVideoStore } from './store/videoStore';
import { workerPool } from './services/workerPool';
import { performanceMonitor } from './lib/performanceMonitor';

console.log("APP.TSX: LIBRARIES IMPORTED SUCCESSFULLY");

const App: React.FC = () => {
  console.log("APP.TSX: APP COMPONENT RENDERING...");
  const [view, setView] = useState<
    'landing' | 'dashboard' | 'editor' | 'settings' | 'assets' | 'generative' | 'vfx' | 'audio'
  >('landing');

  const setVideoState = useVideoStore((state: any) => state.setState);
  const isAnalyzing = useVideoStore((state: any) => state.isAnalyzing);

  useEffect(() => {
    initErrorTracking();
    performanceMonitor.startMonitoring();
    workerPool.prewarm();
  }, []);

  const handleOpenProject = (projectState: VideoState) => {
    setVideoState(projectState);
    setView('editor');
  };

  const handleNewProject = (format: ProjectFormat, template: ProjectTemplate) => {
    setVideoState({
      ...INITIAL_STATE,
      projectName: 'Untitled Project',
      projectSettings: {
        ...INITIAL_STATE.projectSettings,
        resolution: format.dimensions,
      },
    });
    setView('editor');
  };

  return (
    <ThemeProvider>
      <I18nProvider>
        {/* Colorblind Filters */}
        <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
          <defs>
            <filter id="protanopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.567, 0.433, 0,     0, 0
                        0.558, 0.442, 0,     0, 0
                        0,     0.242, 0.758, 0, 0
                        0,     0,     0,     1, 0"
              />
            </filter>
            <filter id="deuteranopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.625, 0.375, 0,   0, 0
                        0.7,   0.3,   0,   0, 0
                        0,     0.3,   0.7, 0, 0
                        0,     0,     0,   1, 0"
              />
            </filter>
            <filter id="tritanopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.95, 0.05,  0,     0, 0
                        0,    0.433, 0.567, 0, 0
                        0,    0.475, 0.525, 0, 0
                        0,    0,     0,     1, 0"
              />
            </filter>
          </defs>
        </svg>

        <ErrorTracker>
          <div
            className={`flex h-screen w-screen bg-studio-bg text-studio-text select-none overflow-hidden font-sans relative ${isAnalyzing ? 'chromatic-aberration' : ''}`}
          >
            <div className="grain-overlay" />
            {view === 'landing' && <LandingPage onStart={() => setView('dashboard')} />}
            {view === 'dashboard' && (
              <Dashboard
                onNewProject={handleNewProject}
                onOpenProject={handleOpenProject}
                onOpenSettings={() => setView('settings')}
              />
            )}
            {view === 'settings' && <Settings onClose={() => setView('dashboard')} />}
            {view === 'assets' && <AssetUniverse state={useVideoStore.getState()} />}
            {view === 'editor' && <EditorView />}
          </div>
        </ErrorTracker>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
