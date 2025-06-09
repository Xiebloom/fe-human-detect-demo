import { RunningMode } from "@/types";
import { ImageSegmenter, ImageSegmenterResult } from "@mediapipe/tasks-vision";

export async function performSegmentation(
  mediaSegmenter: ImageSegmenter,
  mediaElement: HTMLImageElement | HTMLVideoElement
): Promise<ImageSegmenterResult> {
  const runningMode: RunningMode = mediaElement instanceof HTMLImageElement ? "IMAGE" : "VIDEO";

  try {
    // Perform image segmentation
    if (runningMode === "IMAGE") {
      const segmentationResult = mediaSegmenter.segment(mediaElement);
      // Return the segmentation results
      return segmentationResult;
    } else {
      const segmentationResult = mediaSegmenter.segmentForVideo(mediaElement, Date.now());
      // Return the segmentation results
      return segmentationResult;
    }
  } catch (error) {
    console.error("Segmentation failed:", error);
    throw new Error("Segmentation failed");
  }
}
