import { FaceLandmarker } from '@mediapipe/tasks-vision';
import { DetectionResult } from '../../components/MediaPipe/types/index';

export async function detectFaceLandmarks(
  faceLandmarker: FaceLandmarker,
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<DetectionResult> {
  try {
    // Detect face landmarks
    const landmarksResult = faceLandmarker.detect(imageElement);
    
    // Return the detection results with landmarks
    return {
      landmarks: landmarksResult.faceLandmarks,
      // Include other properties if needed
      faceBlendshapes: landmarksResult.faceBlendshapes,
      facialTransformationMatrixes: landmarksResult.facialTransformationMatrixes
    };
  } catch (error) {
    console.error("Face landmark detection failed:", error);
    throw new Error("Face landmark detection failed");
  }
}
