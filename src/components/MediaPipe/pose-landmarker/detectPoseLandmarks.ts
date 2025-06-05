import { PoseLandmarker } from '@mediapipe/tasks-vision';
import { DetectionResult } from '../types';

export async function detectPoseLandmarks(
  poseLandmarker: PoseLandmarker,
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<DetectionResult> {
  try {
    // Detect pose landmarks
    const poseResults = poseLandmarker.detect(imageElement);
    
    // Return the detection results with pose landmarks
    return {
      poses: poseResults.landmarks,
      worldPoses: poseResults.worldLandmarks
    };
  } catch (error) {
    console.error("Pose landmark detection failed:", error);
    throw new Error("Pose landmark detection failed");
  }
}
