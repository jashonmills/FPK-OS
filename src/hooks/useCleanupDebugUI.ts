/**
 * Debug UI Cleanup Hook
 * Removes debug elements and developer-only UI in production
 */

import { useEffect } from 'react';

interface DebugCleanupOptions {
  removeDebugAttributes?: boolean;
  removeTestIds?: boolean;
  removeConsoleOutputs?: boolean;
  hideDevOnlyElements?: boolean;
}

export const useCleanupDebugUI = (options: DebugCleanupOptions = {}) => {
  const {
    removeDebugAttributes = true,
    removeTestIds = true,
    removeConsoleOutputs = false,
    hideDevOnlyElements = true
  } = options;

  useEffect(() => {
    // Only run cleanup in production or when explicitly requested
    if (process.env.NODE_ENV !== 'production' && !options.removeDebugAttributes) {
      return;
    }

    const cleanupTasks: Array<() => void> = [];

    // Remove debug attributes
    if (removeDebugAttributes) {
      const elementsWithDebugAttrs = document.querySelectorAll('[data-debug], [debug], [data-dev]');
      elementsWithDebugAttrs.forEach(el => {
        el.removeAttribute('data-debug');
        el.removeAttribute('debug');
        el.removeAttribute('data-dev');
      });
    }

    // Remove test IDs in production
    if (removeTestIds) {
      const elementsWithTestIds = document.querySelectorAll('[data-testid]');
      elementsWithTestIds.forEach(el => {
        el.removeAttribute('data-testid');
      });
    }

    // Hide dev-only elements
    if (hideDevOnlyElements) {
      const devOnlyElements = document.querySelectorAll('.dev-only, [data-dev-only]');
      devOnlyElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    }

    // Override console methods in production (optional)
    if (removeConsoleOutputs && process.env.NODE_ENV === 'production') {
      const originalConsole = { ...console };
      console.log = () => {};
      console.debug = () => {};
      console.warn = (...args) => {
        // Only show actual warnings, not debug warnings
        if (args.some(arg => typeof arg === 'string' && arg.includes('Warning:'))) {
          originalConsole.warn(...args);
        }
      };
      
      cleanupTasks.push(() => {
        Object.assign(console, originalConsole);
      });
    }

    // Remove debug text content
    const debugTextElements = document.querySelectorAll('*');
    debugTextElements.forEach(el => {
      if (el.textContent) {
        // Remove common debug phrases
        const debugPhrases = [
          'Allow multiple content types',
          '[DEBUG]',
          '[DEV]',
          'Test content',
          'Lorem ipsum dolor sit amet' // Remove placeholder text
        ];
        
        let textContent = el.textContent;
        debugPhrases.forEach(phrase => {
          if (textContent.includes(phrase)) {
            textContent = textContent.replace(phrase, '').trim();
          }
        });
        
        if (textContent !== el.textContent && el.children.length === 0) {
          el.textContent = textContent;
        }
      }
    });

    // Cleanup function
    return () => {
      cleanupTasks.forEach(cleanup => cleanup());
    };
  }, [removeDebugAttributes, removeTestIds, removeConsoleOutputs, hideDevOnlyElements]);

  // Utility function to mark elements as dev-only
  const markAsDevOnly = (element: HTMLElement) => {
    element.setAttribute('data-dev-only', 'true');
    if (process.env.NODE_ENV === 'production') {
      element.style.display = 'none';
    }
  };

  // Utility function to add debug info (only in development)
  const addDebugInfo = (element: HTMLElement, info: string) => {
    if (process.env.NODE_ENV === 'development') {
      element.setAttribute('data-debug', info);
    }
  };

  return {
    markAsDevOnly,
    addDebugInfo
  };
};

export default useCleanupDebugUI;