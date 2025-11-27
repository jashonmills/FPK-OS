import React from 'react';
import { AdvancedScormPlayer } from '@/scorm/player/AdvancedScormPlayer';

interface ScormPlayerProps {
  mode?: 'preview' | 'launch';
}

const ScormPlayer: React.FC<ScormPlayerProps> = ({ mode = 'preview' }) => {
  console.log('🎮 ScormPlayer component rendering, mode:', mode);
  return <AdvancedScormPlayer mode={mode} />;
};

export default ScormPlayer;