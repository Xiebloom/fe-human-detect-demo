import { useCallback } from 'react';
import { AnalysisMode, MediaPipeContextType } from '../types';

// Custom hook for button listeners
export const useButtonListeners = ({
  setCurrentMode,
  runCurrentModeAnalysis
}: Pick<MediaPipeContextType, 'setCurrentMode' | 'runCurrentModeAnalysis'>) => {
  
  // Handle mode button clicks
  const handleModeChange = useCallback((mode: AnalysisMode) => {
    setCurrentMode(mode);
    // Run analysis with the new mode
    setTimeout(() => {
      runCurrentModeAnalysis();
    }, 100); // Small delay to allow state update
  }, [setCurrentMode, runCurrentModeAnalysis]);

  return { handleModeChange };
};
