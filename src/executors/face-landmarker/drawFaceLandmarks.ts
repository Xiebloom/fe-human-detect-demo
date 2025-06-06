import type { DetectionResult } from '../../components/MediaPipe/types';
import { drawConnectors } from '../../utils/drawingUtils';

export function drawFaceLandmarks(
  detectionResult: DetectionResult,
  canvas: HTMLCanvasElement,
  element: HTMLImageElement | HTMLVideoElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !detectionResult.landmarks || detectionResult.landmarks.length === 0) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image or video frame first
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  // Define face mesh connections (simplified version)
  const FACE_CONNECTIONS = [
    // Lips connections
    [61, 146], [146, 91], [91, 181], [181, 84], [84, 17],
    [17, 314], [314, 405], [405, 321], [321, 375], [375, 291],
    // Left eye
    [33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154], [154, 155], [155, 133], [33, 133],
    // Right eye
    [362, 382], [382, 381], [381, 380], [380, 374], [374, 373], [373, 390], [390, 249], [249, 263], [263, 362]
  ];

  // Draw each face's landmarks
  detectionResult.landmarks.forEach(landmarks => {
    // Draw all landmarks as points
    for (const landmark of landmarks) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(
        landmark.x * canvas.width,
        landmark.y * canvas.height,
        1, // small point size
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // Draw connections
    drawConnectors(ctx, landmarks, FACE_CONNECTIONS, canvas.width, canvas.height);
  });
}
