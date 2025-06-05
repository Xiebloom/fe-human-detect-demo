import { FilesetResolver } from '@mediapipe/tasks-vision';
import { FaceLandmarker } from '@mediapipe/tasks-vision';

export async function createFaceLandmarker(): Promise<FaceLandmarker> {
  try {
    // Create a FilesetResolver to resolve dependencies
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    
    // Create a face landmarker instance
    const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU"
      },
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
      runningMode: "IMAGE",
      numFaces: 1
    });
    
    return faceLandmarker;
  } catch (error) {
    console.error("Failed to create face landmarker:", error);
    throw new Error("Failed to create face landmarker");
  }
}
