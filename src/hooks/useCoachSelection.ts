import { useState, useEffect } from 'react';

export type CoachPersona = 'BETTY' | 'AL';

const STORAGE_KEY = 'phoenixCoachPreference';

export function useCoachSelection() {
  const [selectedCoach, setSelectedCoach] = useState<CoachPersona | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (stored as CoachPersona) : null;
  });
  
  const [showSelection, setShowSelection] = useState(!selectedCoach);

  const selectCoach = (coach: CoachPersona) => {
    setSelectedCoach(coach);
    localStorage.setItem(STORAGE_KEY, coach);
    setShowSelection(false);
  };

  const switchCoach = () => {
    const newCoach: CoachPersona = selectedCoach === 'BETTY' ? 'AL' : 'BETTY';
    setSelectedCoach(newCoach);
    localStorage.setItem(STORAGE_KEY, newCoach);
  };

  const resetCoach = () => {
    setSelectedCoach(null);
    localStorage.removeItem(STORAGE_KEY);
    setShowSelection(true);
  };

  return {
    selectedCoach,
    showSelection,
    selectCoach,
    switchCoach,
    resetCoach,
    setShowSelection
  };
}
