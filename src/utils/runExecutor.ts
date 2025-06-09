import type { MediaType, MediaPipeContextType } from "../components/MediaPipe/types";

type Creator<T> = () => Promise<T>;
type Detector<R, T> = (detector: T, element: HTMLImageElement | HTMLVideoElement) => Promise<R>;
type Drawer<R> = (result: R, canvas: HTMLCanvasElement, element: HTMLImageElement | HTMLVideoElement) => void;

/** 每次检测时间阈值 */
const DETECT_THRESHOLD = 500;

/**
 * A function to manage the lifecycle of MediaPipe detectors
 *
 * @param create Function to create the detector
 * @param detect Function to run detection with the detector
 * @param draw Function to draw the results on canvas
 * @param detectorName Name of the detector for logging purposes
 * @param mediaContext MediaPipe context containing status update functions
 */
export async function runExecutor<T, R>(
  create: Creator<T>,
  detect: Detector<R, T>,
  draw: Drawer<R>,
  context: {
    detectorName: string;
    mediaType: MediaType;
    mediaElement: HTMLImageElement | HTMLVideoElement | null;
    canvas: HTMLCanvasElement | null;
    mediaContext: MediaPipeContextType;
  }
) {
  // Extract
  const { detectorName, mediaType, mediaElement, canvas, mediaContext } = context;
  const { updateStatus, updateDetectionTime } = mediaContext;

  // Initialize
  let detectorInstance: T | null = null;

  const elapsedTimes: number[] = [];
  const calAverageElapsedTime = () => {
    return elapsedTimes.reduce((acc, time) => acc + time, 0) / elapsedTimes.length;
  };

  // Update loading state
  try {
    updateStatus(`Loading ${detectorName} model...`, "info");
    detectorInstance = await create();
    updateStatus(`${detectorName} model loaded successfully`, "success");
  } catch (error) {
    console.error(`Error initializing ${detectorName}:`, error);
    updateStatus(`Failed to load ${detectorName} model: ${error}`, "error");
    return;
  }

  // Run detection
  if (!mediaElement || !canvas || !detectorInstance) {
    return;
  }

  // Resize canvas to match media element
  canvas.width = mediaElement.clientWidth;
  canvas.height = mediaElement.clientHeight;

  let lastDetectTime = -1;
  let lastDetectResult: R | null = null;

  // Declare the main part of this task
  const detecteAndDraw = async () => {
    const startTime = performance.now();

    const shouldDetectAndDraw = lastDetectTime === -1 || startTime - lastDetectTime > DETECT_THRESHOLD;
    if (shouldDetectAndDraw) {
      console.log("detect!");

      lastDetectResult = await detect(detectorInstance, mediaElement);

      lastDetectTime = startTime;
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      elapsedTimes.push(elapsedTime);
      updateDetectionTime(calAverageElapsedTime());

      // Clear previous drawings
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      draw(lastDetectResult, canvas, mediaElement);
    }

    // continue detection if it is video
    try {
      // Continue detection if it's video
      if (mediaType === "video" && "paused" in mediaElement && !mediaElement.paused) {
        requestAnimationFrame(() => {
          detecteAndDraw();
        });
      }

      return detectorInstance;
    } catch (error) {
      console.error(`Error in ${detectorName} detection:`, error);
      updateStatus(`${detectorName} detection error: ${error}`, "error");
      return null;
    }
  };

  // Run the task
  try {
    requestAnimationFrame(() => {
      detecteAndDraw();
    });

    return detectorInstance;
  } catch (error) {
    console.error(`Error in ${detectorName} detection:`, error);
    updateStatus(`${detectorName} detection error: ${error}`, "error");

    return null;
  }
}
