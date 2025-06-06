import { FaceLandmarker, type FaceLandmarkerResult } from '@mediapipe/tasks-vision';

export async function detectFaceLandmarks(
  faceLandmarker: FaceLandmarker,
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<FaceLandmarkerResult> {
  try {
    // Detect face landmarks
    const landmarksResult = faceLandmarker.detect(imageElement);
    
    // Return the detection results with face landmarks
    return landmarksResult;
  } catch (error) {
    console.error("Face landmark detection failed:", error);
    throw new Error("Face landmark detection failed");
  }
}
