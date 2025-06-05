import { DetectionResult } from '../types';

interface DrawExecutorProps {
  imageElement: HTMLImageElement | HTMLVideoElement;
  detectionResult: DetectionResult;
  updateStatus: (message: string, type?: string) => void;
  drawer: (canvas: HTMLCanvasElement, image: HTMLImageElement | HTMLVideoElement, result: DetectionResult) => void;
  canvasElement?: HTMLCanvasElement;
}

export function drawExecutor({ 
  imageElement, 
  detectionResult, 
  updateStatus, 
  drawer,
  canvasElement
}: DrawExecutorProps) {
  try {
    // Get the canvas element, or use the provided one
    const canvas = canvasElement || document.getElementById('output-canvas') as HTMLCanvasElement;
    
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    // Set canvas dimensions to match the image
    canvas.width = imageElement.width || imageElement.videoWidth || 640;
    canvas.height = imageElement.height || imageElement.videoHeight || 480;

    // Draw detection results on canvas
    drawer(canvas, imageElement, detectionResult);
    
    // Update status with success message
    updateStatus("Analysis completed successfully", "success");
  } catch (error) {
    console.error("Error drawing results:", error);
    updateStatus("Error drawing results. See console for details.", "error");
  }
}
