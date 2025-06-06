import type { MediaType, DetectionResult, MediaPipeContextType } from '../components/MediaPipe/types';

type Creator<T> = () => Promise<T>;
type Detector<T> = (detector: T, element: HTMLImageElement | HTMLVideoElement) => Promise<DetectionResult>;
type Drawer = (
  result: DetectionResult, 
  canvas: HTMLCanvasElement, 
  element: HTMLImageElement | HTMLVideoElement
) => void;

/**
 * A function to manage the lifecycle of MediaPipe detectors
 * 
 * @param creatorFn Function to create the detector
 * @param detectorFn Function to run detection with the detector
 * @param drawerFn Function to draw the results on canvas
 * @param detectorName Name of the detector for logging purposes
 * @param mediaContext MediaPipe context containing status update functions
 */
export async function runExecutor<T>(
  creatorFn: Creator<T>,
  detectorFn: Detector<T>,
  drawerFn: Drawer,
  detectorName: string,
  context: {
    mediaType: MediaType,
    mediaElement: HTMLImageElement | HTMLVideoElement | null,
    canvas: HTMLCanvasElement | null,
    mediaContext: MediaPipeContextType
  }
) {
  const { mediaType, mediaElement, canvas, mediaContext } = context;
  const { updateStatus, updateDetectionTime } = mediaContext;

  // Initialize the detector
  let detector: T | null = null;
  
  try {
    updateStatus(`Loading ${detectorName} model...`, 'info');
    detector = await creatorFn();
    updateStatus(`${detectorName} model loaded successfully`, 'success');
  } catch (error) {
    console.error(`Error initializing ${detectorName}:`, error);
    updateStatus(`Failed to load ${detectorName} model: ${error}`, 'error');
    return;
  }

  // Run detection
  if (!mediaElement || !canvas || !detector) {
    return;
  }

  try {
    // Resize canvas to match media element
    canvas.width = mediaElement.clientWidth;
    canvas.height = mediaElement.clientHeight;
    
    // Clear previous drawings
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    const startTime = performance.now();
    const detectionResult = await detectorFn(detector, mediaElement);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    
    updateDetectionTime(elapsedTime);
    
    // Draw results
    drawerFn(detectionResult, canvas, mediaElement);
    
    // Continue detection if it's video
    if (mediaType === 'video' && 'paused' in mediaElement && !mediaElement.paused) {
      requestAnimationFrame(() => {
        runExecutor(creatorFn, detectorFn, drawerFn, detectorName, context);
      });
    }
    
    // Return the detector for potential cleanup
    return detector;
  } catch (error) {
    console.error(`Error in ${detectorName} detection:`, error);
    updateStatus(`${detectorName} detection error: ${error}`, 'error');
    
    // Clean up if possible
    const detectorWithClose = detector as { close?: () => void };
    if (detector && 'close' in detector && typeof detectorWithClose.close === 'function') {
      detectorWithClose.close?.();
    }
    return null;
  }
}
