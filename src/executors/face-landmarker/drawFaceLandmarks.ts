import type { FaceLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';

export function drawFaceLandmarks(
  detectionResult: FaceLandmarkerResult,
  canvas: HTMLCanvasElement,
  element: HTMLImageElement | HTMLVideoElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !detectionResult.faceLandmarks || detectionResult.faceLandmarks.length === 0) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image or video frame first
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  // Define face mesh connections (simplified version)
  const faceConnections = [
    // Lips connections
    [61, 146], [146, 91], [91, 181], [181, 84], [84, 17],
    [17, 314], [314, 405], [405, 321], [321, 375], [375, 291],
    // Left eye
    [33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154], [154, 155], [155, 133], [33, 133],
    // Right eye
    [362, 382], [382, 381], [381, 380], [380, 374], [374, 373], [373, 390], [390, 249], [249, 263], [263, 362]
  ] as const;

  // Draw each detected face
  detectionResult.faceLandmarks?.forEach(landmarks => {
    // Draw landmark points
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
    drawConnectors(ctx, landmarks, faceConnections, canvas.width, canvas.height);
  });
}

// Function to draw connectors between landmarks
function drawConnectors(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: ReadonlyArray<readonly [number, number]>,
  canvasWidth: number,
  canvasHeight: number,
  color: string = '#00FF00',
  lineWidth: number = 1
): void {
  if (!landmarks || !connections) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  for (const connection of connections) {
    const from = landmarks[connection[0]];
    const to = landmarks[connection[1]];
    
    if (from && to) {
      ctx.beginPath();
      ctx.moveTo(from.x * canvasWidth, from.y * canvasHeight);
      ctx.lineTo(to.x * canvasWidth, to.y * canvasHeight);
      ctx.stroke();
    }
  }
}
