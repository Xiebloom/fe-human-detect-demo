import type { DetectionResult } from '../../components/MediaPipe/types';

// Background color options
const BACKGROUND_COLORS = [
  // Default transparent
  { r: 0, g: 0, b: 0, a: 0 },
  // Blue background
  { r: 0, g: 120, b: 255, a: 255 },
  // Green screen
  { r: 0, g: 255, b: 0, a: 255 },
  // Red background
  { r: 255, g: 0, b: 0, a: 255 }
];

let currentBackgroundColorIndex = 0;

export function drawSegmentation(
  detectionResult: DetectionResult,
  canvas: HTMLCanvasElement,
  element: HTMLImageElement | HTMLVideoElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !detectionResult.segmentation) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image or video frame first
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  // Get the segmentation mask
  const mask = detectionResult.segmentation;
  const maskWidth = mask.width;
  const maskHeight = mask.height;
  const maskData = mask.getAsFloat32Array();

  // Get the background color
  const bgColor = BACKGROUND_COLORS[currentBackgroundColorIndex];

  // Create an image data object to manipulate pixels
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // For each pixel in the mask
  for (let y = 0; y < maskHeight; y++) {
    for (let x = 0; x < maskWidth; x++) {
      // Get the mask value at this position (1 for person, 0 for background)
      const maskIdx = y * maskWidth + x;
      const maskValue = maskData[maskIdx];
      
      // Calculate the corresponding position in the canvas
      // (may need scaling if mask and canvas have different dimensions)
      const canvasX = Math.floor(x * canvas.width / maskWidth);
      const canvasY = Math.floor(y * canvas.height / maskHeight);
      const pixelIndex = (canvasY * canvas.width + canvasX) * 4;

      // If this is a background pixel (mask value close to 0)
      if (maskValue < 0.1) {
        // Replace background with chosen color
        pixels[pixelIndex] = bgColor.r;     // R
        pixels[pixelIndex + 1] = bgColor.g; // G
        pixels[pixelIndex + 2] = bgColor.b; // B
        pixels[pixelIndex + 3] = bgColor.a; // A
      }
    }
  }

  // Put the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
}

// Function to cycle through background colors
export function cycleBackgroundColor(): void {
  currentBackgroundColorIndex = (currentBackgroundColorIndex + 1) % BACKGROUND_COLORS.length;
}
