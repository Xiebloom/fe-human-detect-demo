import { PoseLandmarker, PoseLandmarkerResult } from "@mediapipe/tasks-vision";

export async function detectPoseLandmarks(
  poseLandmarker: PoseLandmarker,
  mediaElement: HTMLImageElement | HTMLVideoElement
): Promise<PoseLandmarkerResult> {
  const mediaType = mediaElement instanceof HTMLImageElement ? "image" : "video";

  try {
    // Detect pose landmarks
    const poseResults =
      mediaType === "image"
        ? poseLandmarker.detect(mediaElement)
        : poseLandmarker.detectForVideo(mediaElement, Date.now());

    // Return the detection results with pose landmarks
    return poseResults;
  } catch (error) {
    console.error("Pose landmark detection failed:", error);
    throw new Error("Pose landmark detection failed");
  }
}
