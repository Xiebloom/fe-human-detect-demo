import { createFaceDetector, detectFaces, drawFaceDetections } from "@/executors/face-detection";
import { createFaceLandmarker, detectFaceLandmarks, drawFaceLandmarks } from "@/executors/face-landmarker";
import { createSegmenter, performSegmentation, drawSegmentation } from "@/executors/person-background-segmentation";
import { createPoseLandmarker, detectPoseLandmarks, drawPoseLandmarks } from "@/executors/pose-landmarker";
import { runExecutor } from "@/utils/runExecutor";
import { AnalysisMode, MediaType } from "../types";

export async function executeTask(mode: AnalysisMode, mediaType: MediaType, executorContext) {
  // Run the appropriate detection based on the selected mode
  switch (mode) {
    case "detection":
      await runExecutor(createFaceDetector, detectFaces, drawFaceDetections, "Face Detection", executorContext);
      break;
    case "landmarks":
      await runExecutor(
        createFaceLandmarker,
        detectFaceLandmarks,
        drawFaceLandmarks,
        "Face Landmarks",
        executorContext
      );
      break;
    case "pose":
      if (mediaType === "video") {
        runExecutor(
          () => createPoseLandmarker("VIDEO"),
          detectPoseLandmarks,
          drawPoseLandmarks,
          "Pose Detection VIDEO",
          executorContext
        );
        break;
      }

      await runExecutor(
        createPoseLandmarker,
        detectPoseLandmarks,
        drawPoseLandmarks,
        "Pose Detection",
        executorContext
      );
      break;
    case "segmentation":
      await runExecutor(createSegmenter, performSegmentation, drawSegmentation, "Segmentation", executorContext);
      break;
  }
}
