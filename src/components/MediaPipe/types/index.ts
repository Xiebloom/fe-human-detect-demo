export type AnalysisMode = 'detection' | 'landmarks' | 'pose' | 'segmentation';
export type MediaType = 'image' | 'video';
export type StatusType = 'info' | 'success' | 'error';

// Face detection types
export interface FaceDetectionResult {
  boundingBox: {
    originX: number;
    originY: number;
    width: number;
    height: number;
  };
  categories: {
    score: number;
    categoryName: string;
    index: number;
  }[];
}


// Main MediaPipe context interface
export interface MediaPipeContextType {
  // Current analysis mode
  currentMode: AnalysisMode;
  setCurrentMode: (mode: AnalysisMode) => void;
  
  // Media type (image or video)
  currentMediaType: MediaType;
  setCurrentMediaType: (type: MediaType) => void;
  
  // Status management
  statusMessage: string;
  statusType: StatusType;
  updateStatus: (message: string, type: StatusType) => void;
  
  // Detection performance
  detectionTimeMs: string;
  updateDetectionTime: (timeMs: number) => void;
  
  // Analysis execution
  runCurrentModeAnalysis: () => void;
}
