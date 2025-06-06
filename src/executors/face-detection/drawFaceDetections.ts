import { FaceDetectorResult } from "@mediapipe/tasks-vision";

export function drawFaceDetections(
  detectionResult: FaceDetectorResult,
  canvas: HTMLCanvasElement,
  element: HTMLImageElement | HTMLVideoElement
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx || !detectionResult.detections) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image or video frame first
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  // Get the natural dimensions of the image
  const naturalWidth = element?.naturalWidth ?? element.width;
  const naturalHeight = element?.naturalHeight ?? element.height;

  // Set canvas dimensions to match the displayed image
  canvas.width = element.width;
  canvas.height = element.height;

  // Calculate scaling factors between natural image size and displayed size
  const scaleX = canvas.width / naturalWidth;
  const scaleY = canvas.height / naturalHeight;

  // Loop through each detection and draw a rectangle
  detectionResult.detections.forEach((detection) => {
    const bbox = detection.boundingBox;
    if (!bbox) return;

    // Set drawing style
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";

    // Draw rectangle
    ctx.strokeRect(bbox.originX * scaleX, bbox.originY * scaleY, bbox.width * scaleX, bbox.height * scaleY);

    ctx.fillRect(bbox.originX * scaleX, bbox.originY * scaleY, bbox.width * scaleX, bbox.height * scaleY);

    // Draw confidence score
    if (detection.categories && detection.categories[0]) {
      const score = detection.categories[0].score;
      const scoreText = `${Math.round(score * 100)}%`;

      ctx.fillStyle = "#FF0000";
      ctx.font = "18px Arial";
      ctx.fillText(scoreText, bbox.originX * canvas.width, bbox.originY * canvas.height - 5);
    }
  });
}
