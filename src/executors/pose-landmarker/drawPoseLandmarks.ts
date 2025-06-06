import { drawConnectors } from '@/utils/drawingUtils';
import type { DetectionResult } from '../../components/MediaPipe/types';

// Define pose connections
const POSE_CONNECTIONS = [
  // Torso
  [11, 12], [12, 24], [24, 23], [23, 11],
  // Left arm
  [11, 13], [13, 15], [15, 17], [17, 19], [19, 15], [15, 21],
  // Right arm
  [12, 14], [14, 16], [16, 18], [18, 20], [20, 16], [16, 22],
  // Left leg
  [23, 25], [25, 27], [27, 29], [29, 31], [31, 27],
  // Right leg
  [24, 26], [26, 28], [28, 30], [30, 32], [32, 28]
];

export function drawPoseLandmarks(
  detectionResult: DetectionResult,
  canvas: HTMLCanvasElement,
  element: HTMLImageElement | HTMLVideoElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !detectionResult.poses || detectionResult.poses.length === 0) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image or video frame first
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  // Draw each detected pose
  detectionResult.poses.forEach(poseLandmarks => {
    // Draw landmark points
    for (const landmark of poseLandmarks) {
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(
        landmark.x * canvas.width,
        landmark.y * canvas.height,
        3, // point size
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // Draw connections between landmarks
    drawConnectors(
      ctx, 
      poseLandmarks, 
      POSE_CONNECTIONS, 
      canvas.width, 
      canvas.height,
      '#00FF00', // green connections
      2 // line width
    );
  });
}
