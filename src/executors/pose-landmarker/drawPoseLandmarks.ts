import type { MPMask, PoseLandmarkerResult } from "@mediapipe/tasks-vision";

// Define pose connections
// const POSE_CONNECTIONS = [
//   // Torso
//   [11, 12],
//   [12, 24],
//   [24, 23],
//   [23, 11],
//   // Left arm
//   [11, 13],
//   [13, 15],
//   [15, 17],
//   [17, 19],
//   [19, 15],
//   [15, 21],
//   // Right arm
//   [12, 14],
//   [14, 16],
//   [16, 18],
//   [18, 20],
//   [20, 16],
//   [16, 22],
//   // Left leg
//   [23, 25],
//   [25, 27],
//   [27, 29],
//   [29, 31],
//   [31, 27],
//   // Right leg
//   [24, 26],
//   [26, 28],
//   [28, 30],
//   [30, 32],
//   [32, 28],
// ];

export function drawPoseLandmarks(
  detectionResult: PoseLandmarkerResult,
  canvas: HTMLCanvasElement,
  element: HTMLImageElement | HTMLVideoElement
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx || !detectionResult.landmarks || detectionResult.landmarks.length === 0) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image or video frame first
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  // Draw mask
  if (detectionResult.segmentationMasks && detectionResult.segmentationMasks.length > 0) {
    drawSegmentationMask(ctx, detectionResult.segmentationMasks[0]);
  }

  // Draw each detected pose
  // drawPoseLandmarkers(detectionResult, ctx, canvas);
}

// Function to draw segmentation mask
function drawSegmentationMask(ctx: CanvasRenderingContext2D, segmentationMask: MPMask) {
  try {
    const { width, height } = ctx.canvas;

    // Create a temporary canvas to draw the mask
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) {
      return;
    }

    // Create ImageData object
    const imageData = tempCtx.createImageData(width, height);
    const data = imageData.data;

    // Get mask dimensions
    const maskWidth = segmentationMask.width;
    const maskHeight = segmentationMask.height;

    // Get the mask data as a Float32Array
    let mask;
    try {
      mask = segmentationMask.getAsFloat32Array();
    } catch (e) {
      console.error("Error getting mask data:", e);
      return;
    }

    // Calculate scaling factors if mask dimensions don't match canvas
    const scaleX = width / maskWidth;
    const scaleY = height / maskHeight;

    // Fill the image data with mask values
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Map canvas coordinates to mask coordinates
        const maskX = Math.min(Math.floor(x / scaleX), maskWidth - 1);
        const maskY = Math.min(Math.floor(y / scaleY), maskHeight - 1);

        // Get mask value (0-1)
        const maskIndex = maskY * maskWidth + maskX;

        // Safety check for index bounds
        if (maskIndex >= 0 && maskIndex < mask.length) {
          const maskValue = mask[maskIndex];

          // Set pixel in ImageData (RGBA)
          const pixelIndex = (y * width + x) * 4;

          if (maskValue > 0.4) {
            // Semi-transparent white overlay
            data[pixelIndex] = 117; // R
            data[pixelIndex + 1] = 49; // G
            data[pixelIndex + 2] = 23; // B
            data[pixelIndex + 3] = Math.min(maskValue * 255, 255); // A - semi-transparent
          } else {
            // Transparent
            data[pixelIndex + 3] = 0;
          }
        }
      }
    }

    // Put the image data on the temporary canvas
    tempCtx.putImageData(imageData, 0, 0);

    // Draw the temporary canvas onto the main canvas
    // Try different blend modes
    ctx.save();
    ctx.globalAlpha = 0.7; // Make it more visible
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();

    // console.log("Segmentation mask drawn successfully");
  } catch (error) {
    console.error("Error drawing segmentation mask:", error);
  }
}

// function drawPoseLandmarkers(
//   detectionResult: PoseLandmarkerResult & {
//     segmentationMasks?: Array<{ width: number; height: number; getAsFloat32Array(): Float32Array }>;
//   },
//   ctx: CanvasRenderingContext2D,
//   canvas: HTMLCanvasElement
// ) {
//   detectionResult.landmarks.forEach((poseLandmarks) => {
//     // Draw landmark points
//     for (const landmark of poseLandmarks) {
//       ctx.fillStyle = "#FF0000";
//       ctx.beginPath();
//       ctx.arc(
//         landmark.x * canvas.width,
//         landmark.y * canvas.height,
//         3, // point size
//         0,
//         2 * Math.PI
//       );
//       ctx.fill();
//     }

//     // Draw connections between landmarks
//     drawConnectors(
//       ctx,
//       poseLandmarks,
//       POSE_CONNECTIONS,
//       canvas.width,
//       canvas.height,
//       "#00FF00", // green connections
//       2
//     );
//   });
// }

/**
 * Draw connectors (lines) between landmarks
 */
// function drawConnectors(
//   ctx: CanvasRenderingContext2D,
//   landmarks: NormalizedLandmark[],
//   connections: number[][],
//   canvasWidth: number,
//   canvasHeight: number,
//   color: string = "#00FF00",
//   lineWidth: number = 2
// ): void {
//   if (!landmarks || !connections) return;

//   ctx.strokeStyle = color;
//   ctx.lineWidth = lineWidth;

//   for (const connection of connections) {
//     const from = landmarks[connection[0]];
//     const to = landmarks[connection[1]];

//     if (from && to) {
//       ctx.beginPath();
//       ctx.moveTo(from.x * canvasWidth, from.y * canvasHeight);
//       ctx.lineTo(to.x * canvasWidth, to.y * canvasHeight);
//       ctx.stroke();
//     }
//   }
// }
