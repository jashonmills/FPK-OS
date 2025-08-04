/**
 * Progressive loading hook for dashboard components
 */

import { useState, useEffect, useRef } from 'react';

interface LoadingPhase {
  id: string;
  priority: number;
  loaded: boolean;
}

export const useProgressiveLoading = (phases: Omit<LoadingPhase, 'loaded'>[]) => {
  const [loadedPhases, setLoadedPhases] = useState<Set<string>>(new Set());
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Sort phases by priority
    const sortedPhases = [...phases].sort((a, b) => a.priority - b.priority);
    
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Load phases progressively with delays
    sortedPhases.forEach((phase, index) => {
      const delay = index * 50; // 50ms between each phase
      
      const timeout = setTimeout(() => {
        setLoadedPhases(prev => new Set([...prev, phase.id]));
      }, delay);
      
      timeoutsRef.current.push(timeout);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [phases]);

  const isPhaseLoaded = (phaseId: string) => loadedPhases.has(phaseId);
  
  const loadAllImmediately = () => {
    const allIds = phases.map(p => p.id);
    setLoadedPhases(new Set(allIds));
    timeoutsRef.current.forEach(clearTimeout);
  };

  return {
    isPhaseLoaded,
    loadAllImmediately,
    loadedCount: loadedPhases.size,
    totalCount: phases.length
  };
};