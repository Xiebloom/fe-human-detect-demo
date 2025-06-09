import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";

// Types for segmentation options
export interface SegmentationOptions {
  modelSelection: 0 | 1;
  backgroundBlur: number;
  onFrame?: (results: Results) => void;
  onDetectionTime?: (timeMs: number) => void;
}

// Default options
const defaultOptions: SegmentationOptions = {
  modelSelection: 1,
  backgroundBlur: 5,
  onFrame: undefined,
  onDetectionTime: undefined,
};

// Class to handle segmentation
export class SegmentationProcessor {
  private selfieSegmentation: SelfieSegmentation;
  private options: SegmentationOptions;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  private camera: MediaStream | null = null;
  private isRunning = false;
  private lastDetectTime: number = -1;

  constructor(options: Partial<SegmentationOptions> = {}) {
    // Initialize MediaPipe Selfie Segmentation
    this.selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    // Merge default options with user options
    this.options = { ...defaultOptions, ...options };

    // Configure the segmentation model
    this.selfieSegmentation.setOptions({
      modelSelection: this.options.modelSelection,
    });

    // Set up the results handler
    this.selfieSegmentation.onResults(this.onResults.bind(this));
  }

  /**
   * Process segmentation results
   */
  private onResults(results: Results): void {
    if (!this.canvasCtx || !this.canvasElement) return;

    const { segmentationMask } = results;

    // Get canvas dimensions
    const width = this.canvasElement.width;
    const height = this.canvasElement.height;

    // Clear the canvas
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, width, height);

    // Get mask data
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext("2d");

    if (!maskCtx) return;

    // Draw the segmentation mask to the temporary canvas
    maskCtx.drawImage(segmentationMask, 0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    // Create image data for the output
    const imageData = this.canvasCtx.createImageData(width, height);
    const pixels = imageData.data;

    // Define threshold to separate foreground from background
    const threshold = 0.2;

    // Define colors
    const foregroundColor = { r: 255, g: 255, b: 255, a: 120 }; // 白色
    const backgroundColor = { r: 0, g: 0, b: 0, a: 120 }; // 黑色

    // For each pixel, set black or white based on the mask
    for (let i = 0; i < pixels.length; i += 4) {
      // The mask is grayscale, so we only need one channel (R)
      // maskData values are 0-255, where 255 is foreground
      const maskValue = maskData[i] / 255;

      if (maskValue < threshold) {
        // Background pixel - black
        pixels[i] = backgroundColor.r; // R
        pixels[i + 1] = backgroundColor.g; // G
        pixels[i + 2] = backgroundColor.b; // B
        pixels[i + 3] = backgroundColor.a; // A
      } else {
        // Foreground pixel - white
        pixels[i] = foregroundColor.r; // R
        pixels[i + 1] = foregroundColor.g; // G
        pixels[i + 2] = foregroundColor.b; // B
        pixels[i + 3] = foregroundColor.a; // A
      }
    }

    // Put the modified pixels to the canvas
    this.canvasCtx.putImageData(imageData, 0, 0);
    this.canvasCtx.restore();

    // Call the user's callback if provided
    if (this.options.onFrame) {
      this.options.onFrame(results);
    }

    console.log("Frame processed");
  }

  /**
   * Process frames continuously for video
   */
  private async processFrames() {
    if (!this.isRunning || !this.videoElement) return;

    // 检查视频是否播放完毕
    if (this.videoElement.currentTime >= this.videoElement.duration && !this.videoElement.loop) {
      console.log("Video playback completed");
      this.isRunning = false;
      return;
    }

    // 记录开始时间
    const startTime = performance.now();

    const shouldDetect = this.lastDetectTime === -1 || startTime - this.lastDetectTime >= 500;
    if (shouldDetect) {
      // Process the current frame
      if (this.videoElement.readyState >= 2) {
        await this.selfieSegmentation.send({ image: this.videoElement });
      }

      this.lastDetectTime = startTime;

      // 计算处理时间
      const endTime = performance.now();
      const detectionTime = endTime - startTime;

      // 调用检测时间回调
      if (this.options.onDetectionTime) {
        this.options.onDetectionTime(detectionTime);
      }
    }

    // Schedule the next frame
    requestAnimationFrame(this.processFrames.bind(this));
  }

  /**
   * Process a single image
   */
  public async processImage(imageElement: HTMLImageElement, canvasElement: HTMLCanvasElement): Promise<void> {
    this.canvasElement = canvasElement;
    this.canvasCtx = canvasElement.getContext("2d");

    if (!this.canvasCtx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas dimensions to match image
    this.canvasElement.width = imageElement.width;
    this.canvasElement.height = imageElement.height;

    // 记录开始时间
    const startTime = performance.now();

    // Process the image once
    await this.selfieSegmentation.send({ image: imageElement });

    // 计算处理时间
    const endTime = performance.now();
    const detectionTime = endTime - startTime;

    // 调用检测时间回调
    if (this.options.onDetectionTime) {
      this.options.onDetectionTime(detectionTime);
    }
  }

  public async processVideo(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.canvasCtx = canvasElement.getContext("2d");

    if (!this.canvasCtx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas dimensions to match image
    this.canvasElement.width = videoElement.videoWidth;
    this.canvasElement.height = videoElement.videoHeight;

    // Get camera stream
    try {
      this.videoElement.onloadeddata = () => {
        this.videoElement.play();
        this.isRunning = true;
        this.processFrames();
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      throw error;
    }
  }

  /**
   * Start segmentation with camera input
   */
  public async startCamera(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.canvasCtx = canvasElement.getContext("2d");

    if (!this.canvasCtx) {
      throw new Error("Could not get canvas context");
    }

    // Get camera stream
    try {
      this.camera = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      // Connect camera to video element
      this.videoElement.srcObject = this.camera;
      this.videoElement.onloadedmetadata = () => {
        this.videoElement.play();
        this.isRunning = true;
        this.processFrames();
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      throw error;
    }
  }

  /**
   * Update segmentation options
   */
  public updateOptions(options: Partial<SegmentationOptions>): void {
    this.options = { ...this.options, ...options };

    // Update model selection if changed
    if (options.modelSelection !== undefined) {
      this.selfieSegmentation.setOptions({
        modelSelection: options.modelSelection,
      });
    }
  }

  /**
   * Stop segmentation and release resources
   */
  public stop(): void {
    this.isRunning = false;

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
export function createSegmentation(options?: Partial<SegmentationOptions>): SegmentationProcessor {
  return new SegmentationProcessor(options);
}
