interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

/**
 * Draw connectors (lines) between landmarks
 */
export function drawConnectors(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: number[][],
  canvasWidth: number,
  canvasHeight: number,
  color: string = '#00FF00',
  lineWidth: number = 2
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

/**
 * Draw landmarks as circles
 */
export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  color: string = '#FF0000',
  radius: number = 2
): void {
  if (!landmarks) return;

  ctx.fillStyle = color;

  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(
      landmark.x * canvasWidth,
      landmark.y * canvasHeight,
      radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}
