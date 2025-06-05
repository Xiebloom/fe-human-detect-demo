declare module '@mediapipe/tasks-vision' {
  export interface FilesetResolver {
    static forVisionTasks(wasmFilePath: string): Promise<any>;
  }

  export interface FaceDetector {
    detect(imageSource: HTMLImageElement | HTMLVideoElement): { detections: FaceDetection[] };
    close(): void;
  }

  export interface FaceDetection {
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

  export interface FaceDetectorOptions {
    baseOptions?: {
      modelAssetPath: string;
      delegate: "CPU" | "GPU" | "TPU";
    };
    runningMode?: "IMAGE" | "VIDEO" | "LIVE_STREAM";
    minDetectionConfidence?: number;
  }

  export class FaceDetector {
    static createFromOptions(vision: any, options: FaceDetectorOptions): Promise<FaceDetector>;
    detect(imageSource: HTMLImageElement | HTMLVideoElement): { detections: FaceDetection[] };
    close(): void;
  }

  export interface NormalizedLandmark {
    x: number;
    y: number;
    z: number;
  }

  export interface FaceLandmarkerResult {
    faceLandmarks: NormalizedLandmark[][];
    faceBlendshapes?: any[];
    facialTransformationMatrixes?: any[];
  }

  export class FaceLandmarker {
    static createFromOptions(vision: any, options: any): Promise<FaceLandmarker>;
    detect(imageSource: HTMLImageElement | HTMLVideoElement): FaceLandmarkerResult;
    close(): void;
  }

  export class PoseLandmarker {
    static createFromOptions(vision: any, options: any): Promise<PoseLandmarker>;
    detect(imageSource: HTMLImageElement | HTMLVideoElement): {
      landmarks: NormalizedLandmark[][]; 
      worldLandmarks: NormalizedLandmark[][];
    };
    close(): void;
  }

  export interface ImageSegmenterResult {
    categoryMask: {
      width: number;
      height: number;
      getAsFloat32Array(): Float32Array;
    };
  }

  export class ImageSegmenter {
    static createFromOptions(vision: any, options: any): Promise<ImageSegmenter>;
    segment(imageSource: HTMLImageElement | HTMLVideoElement): ImageSegmenterResult;
    close(): void;
  }
}
