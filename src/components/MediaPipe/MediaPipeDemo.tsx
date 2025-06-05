import React, { useCallback, useRef, useState } from "react";
import { MediaPipeProvider, useMediaPipe } from "./context/MediaPipeContext";
import "./MediaPipeDemo.css";
import type { AnalysisMode, MediaType } from "./types";
import { runExecutor } from "./utils/runExecutor.ts";

// Import all executors from the new directory structure
import { createFaceDetector, detectFaces, drawFaceDetections } from "../../executors/face-detection";
import { createFaceLandmarker, detectFaceLandmarks, drawFaceLandmarks } from "../../executors/face-landmarker";
import { createPoseLandmarker, detectPoseLandmarks, drawPoseLandmarks } from "../../executors/pose-landmarker";
import { createSegmenter, performSegmentation, drawSegmentation } from "../../executors/person-background-segmentation";

// Inner component using the context
const MediaPipeDemoInner: React.FC = () => {
  const {
    currentMode,
    currentMediaType,
    statusMessage,
    statusType,
    detectionTimeMs,
    setCurrentMode,
    setCurrentMediaType,
    updateStatus,
    updateDetectionTime,
    runCurrentModeAnalysis,
  } = useMediaPipe();

  const [fileName, setFileName] = useState("No file selected");

  // Refs for media elements
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle mode change and run detection
  const handleModeChange = async (mode: AnalysisMode) => {
    setCurrentMode(mode);
    updateStatus(`Switched to ${mode} mode`, "info");

    const mediaElement = currentMediaType === "video" ? videoRef.current : imageRef.current;
    if (!mediaElement || !canvasRef.current) return;

    // Run the appropriate detection based on the selected mode
    switch (mode) {
      case "detection":
        await runExecutor(
          createFaceDetector,
          detectFaces,
          drawFaceDetections,
          "Face Detection",
          mediaElement,
          canvasRef.current,
          currentMediaType,
          {
            currentMode,
            currentMediaType,
            statusMessage,
            statusType,
            detectionTimeMs,
            setCurrentMode,
            setCurrentMediaType,
            updateStatus,
            updateDetectionTime,
            runCurrentModeAnalysis,
          }
        );
        break;
      case "landmarks":
        await runExecutor(
          createFaceLandmarker,
          detectFaceLandmarks,
          drawFaceLandmarks,
          "Face Landmarks",
          mediaElement,
          canvasRef.current,
          currentMediaType,
          {
            currentMode,
            currentMediaType,
            statusMessage,
            statusType,
            detectionTimeMs,
            setCurrentMode,
            setCurrentMediaType,
            updateStatus,
            updateDetectionTime,
            runCurrentModeAnalysis,
          }
        );
        break;
      case "pose":
        await runExecutor(
          createPoseLandmarker,
          detectPoseLandmarks,
          drawPoseLandmarks,
          "Pose Detection",
          mediaElement,
          canvasRef.current,
          currentMediaType,
          {
            currentMode,
            currentMediaType,
            statusMessage,
            statusType,
            detectionTimeMs,
            setCurrentMode,
            setCurrentMediaType,
            updateStatus,
            updateDetectionTime,
            runCurrentModeAnalysis,
          }
        );
        break;
      case "segmentation":
        await runExecutor(
          createSegmenter,
          performSegmentation,
          drawSegmentation,
          "Segmentation",
          mediaElement,
          canvasRef.current,
          currentMediaType,
          {
            currentMode,
            currentMediaType,
            statusMessage,
            statusType,
            detectionTimeMs,
            setCurrentMode,
            setCurrentMediaType,
            updateStatus,
            updateDetectionTime,
            runCurrentModeAnalysis,
          }
        );
        break;
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      const isVideo = file.type.startsWith("video/");
      const mediaType: MediaType = isVideo ? "video" : "image";

      setCurrentMediaType(mediaType);
      setFileName(file.name);

      reader.onload = (e) => {
        const result = e.target?.result as string;

        if (mediaType === "image") {
          if (imageRef.current) {
            imageRef.current.src = result;
            imageRef.current.onload = () => {
              updateStatus("Image loaded", "success");
            };
          }
        } else {
          if (videoRef.current) {
            videoRef.current.src = result;
            videoRef.current.onloadeddata = () => {
              updateStatus("Video loaded", "success");
            };
          }
        }
      };

      reader.onerror = () => {
        updateStatus("Error loading file", "error");
      };

      reader.readAsDataURL(file);
    },
    [setCurrentMediaType, updateStatus]
  );

  // No need to render separate components anymore
  // Detection is now triggered directly from handleModeChange

  return (
    <div className="container">
      <h1>MediaPipe Analysis Demo</h1>
      <div className={`status ${statusType}`}>{statusMessage}</div>
      <div className="info" style={{ marginTop: "15px" }}>
        <p>Detection Time: {detectionTimeMs} ms</p>
      </div>

      <div className="controls">
        <button
          className={`btn ${currentMode === "detection" ? "active" : ""}`}
          onClick={() => handleModeChange("detection")}
        >
          Face Detection
        </button>
        <button
          className={`btn ${currentMode === "landmarks" ? "active" : ""}`}
          onClick={() => handleModeChange("landmarks")}
        >
          Face Landmarks
        </button>
        <button className={`btn ${currentMode === "pose" ? "active" : ""}`} onClick={() => handleModeChange("pose")}>
          Pose Analysis
        </button>
        <button
          className={`btn ${currentMode === "segmentation" ? "active" : ""}`}
          onClick={() => handleModeChange("segmentation")}
        >
          Segmentation
        </button>
      </div>

      <div className="upload-container">
        <div className="file-input-wrapper">
          <button className="file-input-btn">Upload Media</button>
          <input type="file" id="media-upload" accept="image/*,video/*" onChange={handleFileUpload} />
        </div>
        <span className="file-name">{fileName}</span>
      </div>

      <div className="media-container">
        <img
          ref={imageRef}
          src="imgs/default.png"
          alt="Input image for detection"
          style={{ maxWidth: "100%", display: currentMediaType === "image" ? "block" : "none" }}
        />
        <video
          ref={videoRef}
          controls
          style={{ maxWidth: "100%", display: currentMediaType === "video" ? "block" : "none" }}
        ></video>
        <canvas ref={canvasRef} id="output-canvas"></canvas>
      </div>
    </div>
  );
};

// Main component with context provider
const MediaPipeDemo: React.FC = () => {
  return (
    <MediaPipeProvider>
      <MediaPipeDemoInner />
    </MediaPipeProvider>
  );
};

export default MediaPipeDemo;
