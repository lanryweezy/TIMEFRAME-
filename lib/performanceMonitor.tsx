/**
 * Performance Monitoring and Profiling (#27)
 * React DevTools integration and performance metrics
 */

import React from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  componentCount: number;
  reRenderCount: number;
  bundleSize: number;
}

interface ComponentProfile {
  name: string;
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private componentProfiles: Map<string, ComponentProfile> = new Map();
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private isMonitoring = false;
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];
  private fpsHistory: number[] = [];

  private constructor() {
    this.metrics = {
      fps: 0,
      memoryUsage: 0,
      renderTime: 0,
      componentCount: 0,
      reRenderCount: 0,
      bundleSize: 0,
    };
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.setupPerformanceObserver();
    this.startFPSMonitoring();
    this.setupMemoryMonitoring();
    
    // Enable React DevTools profiling in development
    if (process.env.NODE_ENV === 'development') {
      this.enableReactProfiling();
    }
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      // Monitor paint timing
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            console.log(`FCP: ${entry.startTime}ms`);
          }
          if (entry.name === 'largest-contentful-paint') {
            console.log(`LCP: ${entry.startTime}ms`);
          }
        });
      });
      
      paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      // Monitor layout shifts
      const layoutObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.hadRecentInput) return;
          console.log(`CLS: ${entry.value}`);
        });
      });
      
      layoutObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.warn(`Long task detected: ${entry.duration}ms`);
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  private startFPSMonitoring(): void {
    const measureFPS = () => {
      if (!this.isMonitoring) return;
      
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.frameCount++;
      
      if (delta >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / delta);
        this.fpsHistory.push(this.metrics.fps);
        if (this.fpsHistory.length > 50) this.fpsHistory.shift();
        
        this.frameCount = 0;
        this.lastFrameTime = now;
        this.notifyObservers();
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  private setupMemoryMonitoring(): void {
    const measureMemory = () => {
      if (!this.isMonitoring) return;
      
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      }
      
      setTimeout(measureMemory, 5000); // Check every 5 seconds
    };
    
    measureMemory();
  }

  private enableReactProfiling(): void {
    // Inject React DevTools profiler
    if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      
      // Listen for React profiler events
      hook.onCommitFiberRoot = (id: number, root: any, priorityLevel: any) => {
        this.metrics.componentCount = this.countComponents(root);
        this.metrics.reRenderCount++;
      };
    }
  }

  private countComponents(fiber: any): number {
    let count = 0;
    
    const traverse = (node: any) => {
      if (node) {
        count++;
        traverse(node.child);
        traverse(node.sibling);
      }
    };
    
    traverse(fiber.current);
    return count;
  }

  // Profile individual component renders
  profileComponent(componentName: string, renderFn: () => void): void {
    const startTime = performance.now();
    
    renderFn();
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    const profile = this.componentProfiles.get(componentName) || {
      name: componentName,
      renderCount: 0,
      totalRenderTime: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
    };
    
    profile.renderCount++;
    profile.totalRenderTime += renderTime;
    profile.averageRenderTime = profile.totalRenderTime / profile.renderCount;
    profile.lastRenderTime = renderTime;
    
    this.componentProfiles.set(componentName, profile);
    
    // Warn about slow renders
    if (renderTime > 16) { // 60fps threshold
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Get performance recommendations
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.fps < 30) {
      recommendations.push('Low FPS detected. Consider optimizing render loops or reducing component complexity.');
    }
    
    if (this.metrics.memoryUsage > 100) {
      recommendations.push('High memory usage detected. Check for memory leaks or large object retention.');
    }
    
    if (this.metrics.reRenderCount > 100) {
      recommendations.push('High re-render count. Consider using React.memo, useMemo, or useCallback.');
    }
    
    // Check component profiles
    this.componentProfiles.forEach((profile) => {
      if (profile.averageRenderTime > 10) {
        recommendations.push(`Component "${profile.name}" has slow average render time (${profile.averageRenderTime.toFixed(2)}ms).`);
      }
      
      if (profile.renderCount > 50) {
        recommendations.push(`Component "${profile.name}" is re-rendering frequently (${profile.renderCount} times).`);
      }
    });
    
    return recommendations;
  }

  // Bundle size analysis
  analyzeBundleSize(): void {
    if ('navigator' in window && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      const bundleSize = document.querySelectorAll('script[src]').length;
      
      this.metrics.bundleSize = bundleSize;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        console.warn('Slow network detected. Consider code splitting or reducing bundle size.');
      }
    }
  }

  // Export performance data
  exportPerformanceData(): string {
    const data = {
      metrics: this.metrics,
      componentProfiles: Array.from(this.componentProfiles.values()),
      recommendations: this.getRecommendations(),
      timestamp: new Date().toISOString(),
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Subscribe to performance updates
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(callback);
    
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(): void {
    this.observers.forEach(callback => callback(this.metrics));
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getFPSHistory(): number[] {
    return [...this.fpsHistory];
  }

  getComponentProfiles(): ComponentProfile[] {
    return Array.from(this.componentProfiles.values());
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(monitor.getMetrics());
  
  React.useEffect(() => {
    monitor.startMonitoring();
    const unsubscribe = monitor.subscribe(setMetrics);
    
    return () => {
      unsubscribe();
      monitor.stopMonitoring();
    };
  }, [monitor]);
  
  return {
    metrics,
    componentProfiles: monitor.getComponentProfiles(),
    recommendations: monitor.getRecommendations(),
    exportData: () => monitor.exportPerformanceData(),
    profileComponent: (name: string, fn: () => void) => monitor.profileComponent(name, fn),
  };
}

// HOC for automatic component profiling
export function withPerformanceProfiler<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const ProfiledComponent = React.forwardRef<any, P>((props, ref) => {
    const monitor = PerformanceMonitor.getInstance();
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
    
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    
    React.useEffect(() => {
      monitor.profileComponent(name, forceUpdate);
    });
    
    return React.createElement(WrappedComponent as any, { ...props, ref });
  });
  
  ProfiledComponent.displayName = `withPerformanceProfiler(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ProfiledComponent;
}

export const performanceMonitor = PerformanceMonitor.getInstance();