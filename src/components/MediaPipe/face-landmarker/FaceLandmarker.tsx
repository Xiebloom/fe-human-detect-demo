import React from "react";
import type { MediaType } from "../types";

interface FaceLandmarkerProps {
  mediaElement: HTMLImageElement | HTMLVideoElement;
  canvas: HTMLCanvasElement;
  mediaType: MediaType;
}

const FaceLandmarker: React.FC<FaceLandmarkerProps> = () => {
  // No UI needed as detection is now triggered by mode change in MediaPipeDemo
  return null;
};

export default FaceLandmarker;
