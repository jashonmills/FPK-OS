/**
 * Cleanup Manager - Centralized cleanup for timers, intervals, and subscriptions
 * Prevents memory leaks by tracking and cleaning up resources
 */

import { useEffect } from 'react';

interface CleanupTask {
  id: string;
  type: 'timeout' | 'interval' | 'listener' | 'subscription' | 'custom';
  cleanup: () => void;
  component?: string;
  createdAt: number;
}

class CleanupManager {
  private tasks = new Map<string, CleanupTask>();
  private isCleaningUp = false;

  /**
   * Register a cleanup task
   */
  register(task: Omit<CleanupTask, 'createdAt'>): string {
    const id = task.id || `cleanup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.tasks.set(id, {
      ...task,
      id,
      createdAt: Date.now()
    });

    return id;
  }

  /**
   * Register a setTimeout with automatic cleanup
   */
  setTimeout(callback: () => void, delay: number, component?: string): string {
    const timeoutId = window.setTimeout(callback, delay);
    const id = this.register({
      id: `timeout-${timeoutId}`,
      type: 'timeout',
      cleanup: () => clearTimeout(timeoutId),
      component
    });
    
    return id;
  }

  /**
   * Register a setInterval with automatic cleanup
   */
  setInterval(callback: () => void, interval: number, component?: string): string {
    const intervalId = window.setInterval(callback, interval);
    const id = this.register({
      id: `interval-${intervalId}`,
      type: 'interval', 
      cleanup: () => clearInterval(intervalId),
      component
    });
    
    return id;
  }

  /**
   * Register an event listener with automatic cleanup
   */
  addEventListener(target: EventTarget, event: string, callback: EventListener, component?: string): string {
    target.addEventListener(event, callback);
    const id = this.register({
      id: `listener-${event}-${Date.now()}`,
      type: 'listener',
      cleanup: () => target.removeEventListener(event, callback),
      component
    });
    
    return id;
  }

  /**
   * Clean up a specific task by ID
   */
  cleanup(id: string): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;

    try {
      task.cleanup();
      this.tasks.delete(id);
      return true;
    } catch (error) {
      console.warn(`Failed to cleanup task ${id}:`, error);
      this.tasks.delete(id); // Remove even if cleanup failed
      return false;
    }
  }

  /**
   * Clean up all tasks for a specific component
   */
  cleanupComponent(component: string): number {
    let cleaned = 0;
    
    for (const [id, task] of this.tasks.entries()) {
      if (task.component === component) {
        if (this.cleanup(id)) {
          cleaned++;
        }
      }
    }
    
    return cleaned;
  }

  /**
   * Clean up all tasks
   */
  cleanupAll(): number {
    if (this.isCleaningUp) return 0;
    
    this.isCleaningUp = true;
    let cleaned = 0;
    
    for (const [id] of this.tasks.entries()) {
      if (this.cleanup(id)) {
        cleaned++;
      }
    }
    
    this.isCleaningUp = false;
    return cleaned;
  }

  /**
   * Get cleanup statistics
   */
  getStats() {
    const now = Date.now();
    const tasks = Array.from(this.tasks.values());
    
    return {
      total: tasks.length,
      byType: {
        timeout: tasks.filter(t => t.type === 'timeout').length,
        interval: tasks.filter(t => t.type === 'interval').length,
        listener: tasks.filter(t => t.type === 'listener').length,
        subscription: tasks.filter(t => t.type === 'subscription').length,
        custom: tasks.filter(t => t.type === 'custom').length
      },
      byComponent: tasks.reduce((acc, task) => {
        if (task.component) {
          acc[task.component] = (acc[task.component] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      oldestTask: tasks.length > 0 ? Math.min(...tasks.map(t => t.createdAt)) : null,
      averageAge: tasks.length > 0 ? (now - tasks.reduce((sum, t) => sum + t.createdAt, 0) / tasks.length) : 0
    };
  }

  /**
   * Clean up tasks older than specified age (in milliseconds)
   */
  cleanupOld(maxAge: number = 300000): number { // Default 5 minutes
    const now = Date.now();
    let cleaned = 0;
    
    for (const [id, task] of this.tasks.entries()) {
      if (now - task.createdAt > maxAge) {
        if (this.cleanup(id)) {
          cleaned++;
        }
      }
    }
    
    return cleaned;
  }
}

// Global cleanup manager instance
export const cleanupManager = new CleanupManager();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const cleaned = cleanupManager.cleanupAll();
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} resources on page unload`);
    }
  });
  
  // Periodic cleanup of old tasks (every 5 minutes)
  setInterval(() => {
    const cleaned = cleanupManager.cleanupOld();
    if (cleaned > 0) {
      console.log(`🧹 Auto-cleaned ${cleaned} old resources`);
    }
  }, 300000);
}

// React hook for component-level cleanup
export function useCleanup(componentName?: string) {
  const componentId = componentName || `component-${Date.now()}`;
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupManager.cleanupComponent(componentId);
    };
  }, [componentId]);
  
  return {
    setTimeout: (callback: () => void, delay: number) => 
      cleanupManager.setTimeout(callback, delay, componentId),
    setInterval: (callback: () => void, interval: number) => 
      cleanupManager.setInterval(callback, interval, componentId),
    addEventListener: (target: EventTarget, event: string, callback: EventListener) => 
      cleanupManager.addEventListener(target, event, callback, componentId),
    cleanup: (id: string) => cleanupManager.cleanup(id),
    cleanupAll: () => cleanupManager.cleanupComponent(componentId)
  };
}

export default cleanupManager;