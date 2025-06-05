import { ImageSegmenter } from '@mediapipe/tasks-vision';
import { DetectionResult } from '../types';

export async function performSegmentation(
  imageSegmenter: ImageSegmenter,
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<DetectionResult> {
  try {
    // Perform image segmentation
    const segmentationResult = imageSegmenter.segment(imageElement);
    
    // Return the segmentation results
    return {
      segmentation: segmentationResult.categoryMask
    };
  } catch (error) {
    console.error("Segmentation failed:", error);
    throw new Error("Segmentation failed");
  }
}
