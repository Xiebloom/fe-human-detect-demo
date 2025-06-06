import { PoseLandmarker, PoseLandmarkerResult } from '@mediapipe/tasks-vision';

export async function detectPoseLandmarks(
  poseLandmarker: PoseLandmarker,
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<PoseLandmarkerResult> {
  try {
    // Detect pose landmarks
    const poseResults = poseLandmarker.detect(imageElement);
    
    // Return the detection results with pose landmarks
    return poseResults;
  } catch (error) {
    console.error("Pose landmark detection failed:", error);
    throw new Error("Pose landmark detection failed");
  }
}
