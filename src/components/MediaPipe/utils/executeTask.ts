import { createFaceDetector, detectFaces, drawFaceDetections } from "@/executors/face-detection";
import { createFaceLandmarker, detectFaceLandmarks, drawFaceLandmarks } from "@/executors/face-landmarker";
import { createSegmenter, performSegmentation, drawSegmentation } from "@/executors/person-background-segmentation";
import { createPoseLandmarker, detectPoseLandmarks, drawPoseLandmarks } from "@/executors/pose-landmarker";
import { runExecutor } from "@/utils/runExecutor";
import { AnalysisMode, MediaType } from "../types";
import { RunningMode } from "@/types";

type Context = Parameters<typeof runExecutor>[4];

export async function executeTask(mode: AnalysisMode, mediaType: MediaType, executorContext: Context) {
  // Run the appropriate detection based on the selected mode
  const runningMode: RunningMode = mediaType === "video" ? "VIDEO" : "IMAGE";

  switch (mode) {
    case "detection":
      await runExecutor(createFaceDetector, detectFaces, drawFaceDetections, "Face Detection", executorContext);
      break;
    case "landmarks":
      await runExecutor(
        () => createFaceLandmarker(runningMode),
        detectFaceLandmarks,
        drawFaceLandmarks,
        "Face Landmarks " + runningMode,
        executorContext
      );
      break;
    case "pose":
      await runExecutor(
        () => createPoseLandmarker(runningMode),
        detectPoseLandmarks,
        drawPoseLandmarks,
        "Pose Detection " + runningMode,
        executorContext
      );

      break;
    case "segmentation":
      await runExecutor(createSegmenter, performSegmentation, drawSegmentation, "Segmentation", executorContext);
      break;
  }
}
