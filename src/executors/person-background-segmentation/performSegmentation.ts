import { ImageSegmenter, ImageSegmenterResult } from "@mediapipe/tasks-vision";

export async function performSegmentation(
  imageSegmenter: ImageSegmenter,
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<ImageSegmenterResult> {
  try {
    // Perform image segmentation
    const segmentationResult = imageSegmenter.segment(imageElement);

    // Return the segmentation results
    return segmentationResult;
  } catch (error) {
    console.error("Segmentation failed:", error);
    throw new Error("Segmentation failed");
  }
}
