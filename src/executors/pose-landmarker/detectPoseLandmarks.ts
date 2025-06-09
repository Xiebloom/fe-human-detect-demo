import { RunningMode } from "@/types";
import { PoseLandmarker, PoseLandmarkerResult } from "@mediapipe/tasks-vision";

export async function detectPoseLandmarks(
  poseLandmarker: PoseLandmarker,
  mediaElement: HTMLImageElement | HTMLVideoElement
): Promise<PoseLandmarkerResult> {
  const runningMode: RunningMode = mediaElement instanceof HTMLImageElement ? "IMAGE" : "VIDEO";

  try {
    // Detect pose landmarks
    const poseResults =
      runningMode === "IMAGE"
        ? poseLandmarker.detect(mediaElement)
        : poseLandmarker.detectForVideo(mediaElement, Date.now());

    // Return the detection results with pose landmarks
    return poseResults;
  } catch (error) {
    console.error("Pose landmark detection failed:", error);
    throw new Error("Pose landmark detection failed");
  }
}
