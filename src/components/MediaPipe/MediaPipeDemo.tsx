import React, { useRef, useState, useCallback } from "react";
import { MediaPipeProvider, useMediaPipe } from "./context/MediaPipeContext";
import { runExecutor } from "./utils/runExecutor.ts";
import { createFaceDetector } from "./face-detection/createFaceDetector";
import { detectFaces } from "./face-detection/detectFaces";
import { drawDetections } from "./face-detection/drawDetections";
import { createFaceLandmarker } from "./face-landmarker/createFaceLandmarker";
import { detectFaceLandmarks } from "./face-landmarker/detectFaceLandmarks";
import { drawLandmarks } from "./face-landmarker/drawLandmarks";
import { createPoseLandmarker } from "./pose-landmarker/createPoseLandmarker";
import { detectPoseLandmarks } from "./pose-landmarker/detectPoseLandmarks";
import { drawPoseLandmarks } from "./pose-landmarker/drawPoseLandmarks";
import { createSegmenter } from "./person-background-segmentation/createSegmenter";
import { performSegmentation } from "./person-background-segmentation/performSegmentation";
import { drawSegmentation } from "./person-background-segmentation/drawSegmentation";
import FaceDetection from "./face-detection/FaceDetection";
import FaceLandmarker from "./face-landmarker/FaceLandmarker";
import PoseLandmarker from "./pose-landmarker/PoseLandmarker";
import Segmentation from "./person-background-segmentation/Segmentation";
import type { AnalysisMode, MediaType } from "./types";
import "./MediaPipeDemo.css";

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
    runCurrentModeAnalysis
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
          drawDetections,
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
            runCurrentModeAnalysis
          }
        );
        break;
      case "landmarks":
        await runExecutor(
          createFaceLandmarker,
          detectFaceLandmarks,
          drawLandmarks,
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
            runCurrentModeAnalysis
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
            runCurrentModeAnalysis 
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
            runCurrentModeAnalysis 
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

  // Render the appropriate analysis component based on current mode
  const renderAnalysisComponent = () => {
    const mediaElement = currentMediaType === 'video' ? videoRef.current : imageRef.current;

    if (!mediaElement || !canvasRef.current) {
      return null;
    }

    switch (currentMode) {
      case 'detection':
        return <FaceDetection 
                 mediaElement={mediaElement} 
                 canvas={canvasRef.current} 
                 mediaType={currentMediaType} 
               />;
      case 'landmarks':
        return <FaceLandmarker 
                 mediaElement={mediaElement} 
                 canvas={canvasRef.current} 
                 mediaType={currentMediaType} 
               />;
      case 'pose':
        return <PoseLandmarker 
                 mediaElement={mediaElement} 
                 canvas={canvasRef.current} 
                 mediaType={currentMediaType} 
               />;
      case 'segmentation':
        return <Segmentation 
                 mediaElement={mediaElement} 
                 canvas={canvasRef.current} 
                 mediaType={currentMediaType} 
               />;
      default:
        return null;
    }
  };

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
      
      {renderAnalysisComponent()}
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
