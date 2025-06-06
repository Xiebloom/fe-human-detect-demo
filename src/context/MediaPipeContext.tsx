import { MediaPipeContextType, AnalysisMode, MediaType, StatusType } from "@/components/MediaPipe/types";
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Create context with default values
export const MediaPipeContext = createContext<MediaPipeContextType>({
  currentMode: "pose",
  currentMediaType: "image",
  statusMessage: "Ready",
  statusType: "info",
  detectionTimeMs: "0",
  setCurrentMode: () => {},
  setCurrentMediaType: () => {},
  updateStatus: () => {},
  updateDetectionTime: () => {},
  runCurrentModeAnalysis: () => {},
});

// Provider component
interface MediaPipeProviderProps {
  children: ReactNode;
}

export const MediaPipeProvider: React.FC<MediaPipeProviderProps> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<AnalysisMode>("pose");
  const [currentMediaType, setCurrentMediaType] = useState<MediaType>("image");
  const [statusMessage, setStatusMessage] = useState("Ready");
  const [statusType, setStatusType] = useState<StatusType>("info");
  const [detectionTimeMs, setDetectionTimeMs] = useState<string>("0");

  // Update status message and type
  const updateStatus = (message: string, type: StatusType = "info") => {
    setStatusMessage(message);
    setStatusType(type);
  };

  // Update detection time with proper formatting
  const updateDetectionTime = (timeMs: number) => {
    setDetectionTimeMs(timeMs.toFixed(2));
  };

  // Placeholder function to be overridden by component implementation
  const runCurrentModeAnalysis = () => {
    console.log("Analysis function not implemented");
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
        runCurrentModeAnalysis,
      }}
    >
      {children}
    </MediaPipeContext.Provider>
  );
};

export const useMediaPipe = () => useContext(MediaPipeContext);
