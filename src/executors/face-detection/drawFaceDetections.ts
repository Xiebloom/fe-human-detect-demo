import type { DetectionResult } from '../../components/MediaPipe/types';

export function drawFaceDetections(
  detectionResult: DetectionResult,
  canvas: HTMLCanvasElement,
  element: HTMLImageElement | HTMLVideoElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !detectionResult.detections) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image or video frame first
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  // Loop through each detection and draw a rectangle
  detectionResult.detections.forEach(detection => {
    const bbox = detection.boundingBox;
    if (!bbox) return;

    // Set drawing style
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';

    // Draw rectangle
    ctx.strokeRect(
      bbox.originX * canvas.width,
      bbox.originY * canvas.height,
      bbox.width * canvas.width,
      bbox.height * canvas.height
    );
    
    ctx.fillRect(
      bbox.originX * canvas.width,
      bbox.originY * canvas.height,
      bbox.width * canvas.width,
      bbox.height * canvas.height
    );

    // Draw confidence score
    if (detection.categories && detection.categories[0]) {
      const score = detection.categories[0].score;
      const scoreText = `${Math.round(score * 100)}%`;
      
      ctx.fillStyle = '#FF0000';
      ctx.font = '18px Arial';
      ctx.fillText(
        scoreText,
        bbox.originX * canvas.width,
        (bbox.originY * canvas.height) - 5
      );
    }
  });
}
