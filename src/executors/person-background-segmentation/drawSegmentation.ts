import type { ImageSegmenterResult } from "@mediapipe/tasks-vision";

// Background color options
const BACKGROUND_COLORS = [
  // Default transparent
  { r: 0, g: 0, b: 0, a: 120 },
  // Blue background
  { r: 0, g: 120, b: 255, a: 255 },
  // Green screen
  { r: 0, g: 255, b: 0, a: 255 },
  // Red background
  { r: 255, g: 0, b: 0, a: 255 },
];

let currentBackgroundColorIndex = 0;

export function drawSegmentation(
  detectionResult: ImageSegmenterResult,
  canvas: HTMLCanvasElement,
  element: HTMLImageElement | HTMLVideoElement
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx || !detectionResult.confidenceMasks) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image or video frame first
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  // Get the segmentation mask
  const mask = detectionResult.confidenceMasks[0];
  const maskWidth = mask.width;
  const maskHeight = mask.height;
  const maskData = mask.getAsFloat32Array();

  // Get the background color
  const bgColor = BACKGROUND_COLORS[currentBackgroundColorIndex];

  // Create an image data object to manipulate pixels
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // 定义一个阈值来区分前景和背景
  const threshold = 0.3;

  // For each pixel in the mask
  for (let y = 0; y < maskHeight; y++) {
    for (let x = 0; x < maskWidth; x++) {
      // Get the mask value at this position
      // maskValue 接近 1 表示前景 (人物)，接近 0 表示背景
      const maskIdx = y * maskWidth + x;
      const maskValue = maskData[maskIdx];

      // Calculate the corresponding position in the canvas
      const canvasX = Math.floor((x * canvas.width) / maskWidth);
      const canvasY = Math.floor((y * canvas.height) / maskHeight);
      const pixelIndex = (canvasY * canvas.width + canvasX) * 4;

      // 如果当前像素属于背景 (maskValue 低于阈值)
      // 前景像素 (maskValue >= threshold) 则保持不变 (来自原始的drawImage)
      if (maskValue < threshold) {
        // 将背景像素替换为选择的背景颜色
        pixels[pixelIndex] = bgColor.r; // R
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
