import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-backend-webgl";

// Types for segmentation options
export interface SegmentationOptions {
  modelSelection: 0 | 1; // 0 for general model, 1 for landscape model
  backgroundBlur: number;
  onFrame?: (result: any) => void; // 使用any类型，因为需要根据实际API调整
  onDetectionTime?: (timeMs: number) => void;
}

// Default options
const defaultOptions: SegmentationOptions = {
  modelSelection: 1,
  backgroundBlur: 5,
  onFrame: undefined,
  onDetectionTime: undefined,
};

// Class to handle segmentation using TensorFlow.js
export class TFSegmentationProcessor {
  private segmenter: bodySegmentation.BodySegmenter | null = null;
  private options: SegmentationOptions;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  private camera: MediaStream | null = null;
  private isRunning = false;
  private lastDetectTime: number = -1;
  private animationFrameId: number | null = null;

  constructor(options: Partial<SegmentationOptions> = {}) {
    // Merge default options with user options
    this.options = { ...defaultOptions, ...options };

    // Initialize the segmenter asynchronously
    this.initSegmenter();
  }

  /**
   * Initialize the TensorFlow.js segmenter
   */
  private async initSegmenter(): Promise<void> {
    try {
      const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      const segmenterConfig: bodySegmentation.MediaPipeSelfieSegmentationTfjsModelConfig = {
        runtime: "tfjs" as const,
        modelType: this.options.modelSelection === 1 ? "landscape" : "general",
      };

      this.segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
      console.log("TensorFlow.js segmenter initialized");
    } catch (error) {
      console.error("Failed to initialize segmenter:", error);
      throw error;
    }
  }

  /**
   * Process a frame and apply segmentation
   */
  private async processFrame(imageSource: HTMLImageElement | HTMLVideoElement): Promise<void> {
    if (!this.segmenter || !this.canvasCtx || !this.canvasElement) return;

    try {
      // Record start time for performance measurement
      const startTime = performance.now();

      // Perform segmentation
      const segmentation = await this.segmenter.segmentPeople(imageSource, {
        multiSegmentation: false,
        segmentBodyParts: false,
        segmentationThreshold: 0.5,
      });

      if (segmentation.length === 0) return;

      // Get canvas dimensions
      const width = this.canvasElement.width;
      const height = this.canvasElement.height;

      // Clear the canvas
      this.canvasCtx.clearRect(0, 0, width, height);

      // Draw the segmentation mask
      const foregroundColor = { r: 255, g: 255, b: 255, a: 120 }; // White with transparency
      const backgroundColor = { r: 0, g: 0, b: 0, a: 120 }; // Black with transparency

      // Get the segmentation mask
      const mask = await bodySegmentation.toBinaryMask(
        segmentation,
        foregroundColor,
        backgroundColor,
        false, // includeBackground
        0.2 // threshold
      );

      // Draw the mask on the canvas
      const imageData = new ImageData(mask.data, width, height);
      this.canvasCtx.putImageData(imageData, 0, 0);

      // Calculate processing time
      const endTime = performance.now();
      const detectionTime = endTime - startTime;

      // Call detection time callback if provided
      if (this.options.onDetectionTime) {
        this.options.onDetectionTime(detectionTime);
      }

      // Call the user's frame callback if provided
      if (this.options.onFrame) {
        this.options.onFrame(segmentation[0]);
      }
    } catch (error) {
      console.error("Error processing frame:", error);
    }
  }

  /**
   * Process frames continuously for video
   */
  private async processFrames(): Promise<void> {
    if (!this.isRunning || !this.videoElement) return;

    // Check if video playback has ended
    if (this.videoElement.currentTime >= this.videoElement.duration && !this.videoElement.loop) {
      console.log("Video playback completed");
      this.isRunning = false;
      return;
    }

    // Record start time
    const startTime = performance.now();

    // Throttle detection to improve performance
    const shouldDetect = this.lastDetectTime === -1 || startTime - this.lastDetectTime >= 500;

    if (shouldDetect && this.videoElement.readyState >= 2) {
      await this.processFrame(this.videoElement);
      this.lastDetectTime = startTime;
    }

    // Schedule the next frame
    this.animationFrameId = requestAnimationFrame(this.processFrames.bind(this));
  }

  /**
   * Process a single image
   */
  public async processImage(imageElement: HTMLImageElement, canvasElement: HTMLCanvasElement): Promise<void> {
    // Wait for segmenter to initialize if it hasn't already
    if (!this.segmenter) {
      await this.waitForSegmenter();
    }

    this.canvasElement = canvasElement;
    this.canvasCtx = canvasElement.getContext("2d");

    if (!this.canvasCtx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas dimensions to match image
    this.canvasElement.width = imageElement.width;
    this.canvasElement.height = imageElement.height;

    // Process the image once
    await this.processFrame(imageElement);
  }

  /**
   * Process a video
   */
  public async processVideo(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    // Wait for segmenter to initialize if it hasn't already
    if (!this.segmenter) {
      await this.waitForSegmenter();
    }

    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.canvasCtx = canvasElement.getContext("2d");

    if (!this.canvasCtx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas dimensions to match video
    this.canvasElement.width = videoElement.videoWidth;
    this.canvasElement.height = videoElement.videoHeight;

    try {
      // Start processing when video data is loaded
      this.videoElement.onloadeddata = () => {
        this.videoElement!.play();
        this.isRunning = true;
        this.processFrames();
      };
    } catch (error) {
      console.error("Error processing video:", error);
      throw error;
    }
  }

  /**
   * Start camera and segmentation
   */
  public async startCamera(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    // Wait for segmenter to initialize if it hasn't already
    if (!this.segmenter) {
      await this.waitForSegmenter();
    }

    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.canvasCtx = canvasElement.getContext("2d");

    if (!this.canvasCtx) {
      throw new Error("Could not get canvas context");
    }

    try {
      // Get camera stream
      this.camera = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      // Connect camera to video element
      this.videoElement.srcObject = this.camera;
      this.videoElement.onloadedmetadata = () => {
        this.videoElement!.play();
        this.isRunning = true;
        this.processFrames();
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      throw error;
    }
  }

  /**
   * Wait for segmenter to initialize
   */
  private async waitForSegmenter(): Promise<void> {
    const maxAttempts = 20;
    let attempts = 0;

    while (!this.segmenter && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (!this.segmenter) {
      throw new Error("Segmenter initialization timed out");
    }
  }

  /**
   * Update segmentation options
   */
  public updateOptions(options: Partial<SegmentationOptions>): void {
    this.options = { ...this.options, ...options };

    // If model selection changed, reinitialize the segmenter
    if (options.modelSelection !== undefined && options.modelSelection !== this.options.modelSelection) {
      this.initSegmenter();
    }
  }

  /**
   * Stop segmentation and release resources
   */
  public stop(): void {
    this.isRunning = false;

    // Cancel any pending animation frames
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Stop camera if active
    if (this.camera) {
      this.camera.getTracks().forEach((track) => track.stop());
      this.camera = null;
    }

    // Clear video source
    if (this.videoElement && this.videoElement.srcObject) {
      this.videoElement.srcObject = null as unknown as MediaProvider;
    }
  }
}

// Export a factory function for easier usage
export function createTFSegmentation(options?: Partial<SegmentationOptions>): TFSegmentationProcessor {
  return new TFSegmentationProcessor(options);
}
