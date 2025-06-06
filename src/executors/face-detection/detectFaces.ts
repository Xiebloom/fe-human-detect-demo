import { FaceDetector, type FaceDetectorResult } from '@mediapipe/tasks-vision';

export async function detectFaces(
  faceDetector: FaceDetector,
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<{ detections: FaceDetectorResult['detections'] }> {
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
