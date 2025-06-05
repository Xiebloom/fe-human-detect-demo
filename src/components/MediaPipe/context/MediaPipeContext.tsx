import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { MediaPipeContextType, AnalysisMode, MediaType, StatusType } from '../types';

// Create context with default values
const MediaPipeContext = createContext<MediaPipeContextType>({
  currentMode: 'detection',
  currentMediaType: 'image',
  statusMessage: 'Ready',
  statusType: 'info',
  detectionTimeMs: '0',
  setCurrentMode: () => {},
  setCurrentMediaType: () => {},
  updateStatus: () => {},
  updateDetectionTime: () => {},
  runCurrentModeAnalysis: () => {}
});

// Provider component
interface MediaPipeProviderProps {
  children: ReactNode;
}

export const MediaPipeProvider: React.FC<MediaPipeProviderProps> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<AnalysisMode>('detection');
  const [currentMediaType, setCurrentMediaType] = useState<MediaType>('image');
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [statusType, setStatusType] = useState<StatusType>('info'); 
  const [detectionTimeMs, setDetectionTimeMs] = useState<string>('0');

  // Update status message and type
  const updateStatus = (message: string, type: StatusType = 'info') => {
    setStatusMessage(message);
    setStatusType(type);
  };

  // Update detection time with proper formatting
  const updateDetectionTime = (timeMs: number) => {
    setDetectionTimeMs(timeMs.toFixed(2));
  };

  // Placeholder function to be overridden by component implementation
  const runCurrentModeAnalysis = () => {
    console.log('Analysis function not implemented');
  };

  return (
    <MediaPipeContext.Provider
      value={{
        currentMode,
        currentMediaType,
        statusMessage,
        statusType,
        detectionTimeMs,
        setCurrentMode,
        setCurrentMediaType,
        updateStatus,
        updateDetectionTime,
        runCurrentModeAnalysis
      }}
    >
      {children}
    </MediaPipeContext.Provider>
  );
};

// Custom hook for using the context
export const useMediaPipe = () => useContext(MediaPipeContext);
