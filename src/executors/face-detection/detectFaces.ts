import { FaceDetector } from '@mediapipe/tasks-vision';
import type { DetectionResult } from '../../components/MediaPipe/types';

export async function detectFaces(
  faceDetector: FaceDetector,
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<DetectionResult> {
  try {
    // Detect faces in the image
    const detectionResult = faceDetector.detect(imageElement);
    
    // Return the detection results
    return {
      detections: detectionResult.detections
    };
  } catch (error) {
    console.error("Face detection failed:", error);
    throw new Error("Face detection failed");
  }
}
