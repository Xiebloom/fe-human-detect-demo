import React from "react";
import type { MediaType } from "../types";

interface FaceDetectionProps {
  mediaElement: HTMLImageElement | HTMLVideoElement;
  canvas: HTMLCanvasElement;
  mediaType: MediaType;
}

const FaceDetection: React.FC<FaceDetectionProps> = () => {
  // No UI needed as detection is now triggered by mode change in MediaPipeDemo
  return null;
};

export default FaceDetection;
