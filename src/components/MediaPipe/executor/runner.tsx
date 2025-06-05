import React, { useRef, useEffect, useState } from 'react';
import { drawExecutor } from './drawer';
import { useMediaPipe } from '../context/MediaPipeContext';
import { DetectionResult } from '../types';
import { useMeasureExecutionTime } from '../utils/timeMeasure';

interface RunExecutorProps {
  creator: () => Promise<any>;
  detector: (detector: any, imageElement: HTMLImageElement | HTMLVideoElement) => Promise<DetectionResult>;
  drawer: (canvas: HTMLCanvasElement, image: HTMLImageElement | HTMLVideoElement, result: DetectionResult) => void;
}

export const useRunExecutor = ({ creator, detector, drawer }: RunExecutorProps) => {
  const { updateStatus } = useMediaPipe();
  const measureExecutionTime = useMeasureExecutionTime();
  const [detector_, setDetector] = useState<any>(null);

  // Initialize the detector
  useEffect(() => {
    const initDetector = async () => {
      try {
        updateStatus({ message: "Creating detector...", type: "loading" });
        const newDetector = await creator();
        setDetector(newDetector);
        updateStatus({ message: "Detector created successfully", type: "success" });
      } catch (error) {
        console.error("Failed to create detector:", error);
        updateStatus({ message: "Failed to create detector. See console for details.", type: "error" });
      }
    };

    initDetector();

    // Cleanup function
    return () => {
      if (detector_ && typeof detector_.close === 'function') {
        detector_.close();
      }
    };
  }, [creator, updateStatus]);

  // Function to run detection
  const runDetection = async (imageElement: HTMLImageElement | HTMLVideoElement, canvasElement: HTMLCanvasElement) => {
    if (!detector_) {
      updateStatus({ message: "Detector not initialized", type: "error" });
      return;
    }

    try {
      updateStatus({ message: "Processing...", type: "loading" });
      
      // Measure execution time of detection
      const detectionResult = await measureExecutionTime(() => 
        detector(detector_, imageElement)
      );

      // Draw detection results
      drawExecutor({ 
        imageElement, 
        detectionResult, 
        updateStatus: (message, type) => updateStatus({ message, type: type as any }), 
        drawer,
        canvasElement
      });
      
    } catch (error) {
      console.error("Detection failed:", error);
      updateStatus({ message: "Detection failed. See console for details.", type: "error" });
    }
  };

  return { runDetection, detector: detector_ };
};

// React component wrapper for the executor
export const RunExecutor: React.FC<RunExecutorProps & {
  imageElementRef: React.RefObject<HTMLImageElement | HTMLVideoElement>;
  canvasElementRef: React.RefObject<HTMLCanvasElement>;
}> = ({ creator, detector, drawer, imageElementRef, canvasElementRef }) => {
  const { runDetection } = useRunExecutor({ creator, detector, drawer });
  const { currentMediaType } = useMediaPipe();
  
  useEffect(() => {
    const imageElement = imageElementRef.current;
    const canvasElement = canvasElementRef.current;
    
    if (!imageElement || !canvasElement) return;

    const runDetectionWhenReady = async () => {
      // For images, wait for them to load
      if (currentMediaType === 'image' && imageElement instanceof HTMLImageElement) {
        if (!imageElement.complete) {
          await new Promise<void>((resolve) => {
            const onLoad = () => {
              imageElement.removeEventListener('load', onLoad);
              resolve();
            };
            imageElement.addEventListener('load', onLoad);
          });
        }
      }

      // Run detection
      runDetection(imageElement, canvasElement);
    };

    runDetectionWhenReady();
  }, [imageElementRef, canvasElementRef, runDetection, currentMediaType]);

  return null; // This is a functional component, no UI needed
};
