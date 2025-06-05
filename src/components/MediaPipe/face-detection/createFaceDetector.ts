import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export async function createFaceDetector(): Promise<FaceDetector> {
  // Initialize the Face Detector
  try {
    // Create a FilesetResolver to resolve dependencies
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    
    // Create a face detector instance
    const faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        delegate: "GPU"
      },
      runningMode: "IMAGE"
    });
    
    return faceDetector;
  } catch (error) {
    console.error("Failed to create face detector:", error);
    throw new Error("Failed to create face detector");
  }
}
