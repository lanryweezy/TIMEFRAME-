console.log("INDEX_SIMPLE: STARTING DIAGNOSTIC MODULE LOADS");

async function runDiagnostics() {
  try {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = "<h1 style='color: white; padding: 20px; font-family: sans-serif;'>Running module import diagnostics...</h1>";
    }

    console.log("DIAGNOSTIC: Loading React...");
    const React = await import('react');
    console.log("DIAGNOSTIC: React loaded successfully");

    console.log("DIAGNOSTIC: Loading ReactDOM...");
    const ReactDOM = await import('react-dom/client');
    console.log("DIAGNOSTIC: ReactDOM loaded successfully");

    console.log("DIAGNOSTIC: Loading ErrorBoundary...");
    const { ErrorBoundary } = await import('./components/ErrorBoundary');
    console.log("DIAGNOSTIC: ErrorBoundary loaded successfully");

    console.log("DIAGNOSTIC: Loading videoStore...");
    const { useVideoStore } = await import('./store/videoStore');
    console.log("DIAGNOSTIC: videoStore loaded successfully");

    console.log("DIAGNOSTIC: Loading App...");
    const App = await import('./App');
    console.log("DIAGNOSTIC: App loaded successfully");

    console.log("DIAGNOSTIC: ALL MODULES LOADED SUCCESSFULLY!");
    if (rootElement) {
      rootElement.innerHTML = "<h1 style='color: #4ade80; padding: 20px; font-family: sans-serif;'>All modules loaded successfully! Ready for mount.</h1>";
    }
  } catch (error) {
    console.error("DIAGNOSTIC: FATAL ERROR DURING MODULE LOAD:", error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `<h1 style='color: #f87171; padding: 20px; font-family: sans-serif;'>Module load failed: ${error.message}</h1><pre style='color: #ef4444; padding-left: 20px;'>${error.stack}</pre>`;
    }
  }
}

runDiagnostics();
