import React, { useEffect, useRef, useState } from "react";
import { MediaPipeProvider, useMediaPipe } from "../../context/MediaPipeContext.tsx";
import "./MediaPipeDemo.css";
import type { AnalysisMode, MediaType } from "./types";
import { executeTask } from "./utils/executeTask.ts";

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
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle mode change and run detection
  const handleModeChange = async (mode: AnalysisMode) => {
    setCurrentMode(mode);
    updateStatus(`Switched to ${mode} mode`, "info");
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  useEffect(() => {
    const mediaElement = currentMediaType === "video" ? videoRef.current : imageRef.current;
    if (!mediaElement || !canvasRef.current) return;

    const executorContext = {
      mediaElement,
      canvas: canvasRef.current,
      mediaType: currentMediaType,
      mediaContext: {
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
      },
    };

    executeTask(currentMode, executorContext);
  }, [currentMode, currentMediaType, imageRef.current?.src, videoRef.current?.src]);

  return (
    <div className="container">
      {/* title and info */}
      <h1>MediaPipe Analysis Demo</h1>
      <div className={`status ${statusType}`}>{statusMessage}</div>
      <div className="info" style={{ marginTop: "15px" }}>
        <p>Detection Time: {detectionTimeMs} ms</p>
      </div>

      {/* controls */}
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

      {/* upload */}
      <div className="upload-container">
        <div className="file-input-wrapper">
          <button className="file-input-btn">Upload Media</button>
          <input type="file" id="media-upload" accept="image/*,video/*" onChange={handleFileUpload} />
        </div>
        <span className="file-name">{fileName}</span>
      </div>

      {/* media */}
      <div className="media-container">
        <img
          ref={imageRef}
          src="/imgs/default.png"
          alt="Input image for detection"
          style={{ maxWidth: "100%", display: currentMediaType === "image" ? "block" : "none" }}
        />
        <video
          ref={videoRef}
          controls
          style={{ maxWidth: "100%", display: currentMediaType === "video" ? "block" : "none" }}
        ></video>

        {/* canvas */}
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
