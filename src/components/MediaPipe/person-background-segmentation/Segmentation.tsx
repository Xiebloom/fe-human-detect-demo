import React from "react";
import type { MediaType } from "../types";

interface SegmentationProps {
  mediaElement: HTMLImageElement | HTMLVideoElement;
  canvas: HTMLCanvasElement;
  mediaType: MediaType;
}

const Segmentation: React.FC<SegmentationProps> = () => {
  // No UI needed as detection is now triggered by mode change in MediaPipeDemo
  return null;
};

export default Segmentation;
