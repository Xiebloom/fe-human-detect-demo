import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export async function createPoseLandmarker(): Promise<PoseLandmarker> {
  try {
    // Create a FilesetResolver to resolve dependencies
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    
    // Create a pose landmarker instance
    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU"
      },
      runningMode: "IMAGE",
      numPoses: 1
    });
    
    return poseLandmarker;
  } catch (error) {
    console.error("Failed to create pose landmarker:", error);
    throw new Error("Failed to create pose landmarker");
  }
}
