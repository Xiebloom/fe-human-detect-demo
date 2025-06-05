import React from "react";
import type { MediaType } from "../types";

interface PoseLandmarkerProps {
  mediaElement: HTMLImageElement | HTMLVideoElement;
  canvas: HTMLCanvasElement;
  mediaType: MediaType;
}

const PoseLandmarker: React.FC<PoseLandmarkerProps> = () => {
  // No UI needed as detection is now triggered by mode change in MediaPipeDemo
  return null;
};

export default PoseLandmarker;
