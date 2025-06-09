import { createFaceDetector, detectFaces, drawFaceDetections } from "@/executors/face-detection";
import { createFaceLandmarker, detectFaceLandmarks, drawFaceLandmarks } from "@/executors/face-landmarker";
import { createSegmenter, performSegmentation, drawSegmentation } from "@/executors/person-segmentation";
import { createPoseLandmarker, detectPoseLandmarks, drawPoseLandmarks } from "@/executors/pose-landmarker";
import { runExecutor } from "@/utils/runExecutor";
import { AnalysisMode, MediaType } from "../types";
import { RunningMode } from "@/types";

type Context = Parameters<typeof runExecutor>[3];

export async function executeTask(mode: AnalysisMode, mediaType: MediaType, executorContext: Context) {
  // Run the appropriate detection based on the selected mode
  const runningMode: RunningMode = mediaType === "video" ? "VIDEO" : "IMAGE";

  switch (mode) {
    case "detection":
      await runExecutor(createFaceDetector, detectFaces, drawFaceDetections, {
        ...executorContext,
        detectorName: "Face Detection",
      });
      break;
    case "landmarks":
      await runExecutor(() => createFaceLandmarker(runningMode), detectFaceLandmarks, drawFaceLandmarks, {
        ...executorContext,
        detectorName: "Face Landmarks " + runningMode,
      });
      break;
    case "pose":
      await runExecutor(() => createPoseLandmarker(runningMode), detectPoseLandmarks, drawPoseLandmarks, {
        ...executorContext,
        detectorName: "Pose Detection " + runningMode,
      });

      break;
    case "segmentation":
      await runExecutor(() => createSegmenter(runningMode), performSegmentation, drawSegmentation, {
        ...executorContext,
        detectorName: "Segmentation " + runningMode,
      });
      break;
  }
}
