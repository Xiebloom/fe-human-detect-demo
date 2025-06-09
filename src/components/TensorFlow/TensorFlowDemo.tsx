import React, { useEffect, useRef, useState } from "react";
import { createSegmentation } from "./utils/segment";

import "./TensorFlowDemo.css";

export type MediaType = "camera" | "image" | "video";

export const TensorFlowDemo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [fileName, setFileName] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [detectionTime, setDetectionTime] = useState<number | null>(null);
  const segmentationRef = useRef<ReturnType<typeof createSegmentation> | null>(null);

  // Initialize segmentation when component mounts
  useEffect(() => {
    segmentationRef.current = createSegmentation({
      onFrame: () => {
        // You can do additional processing here if needed
        console.log("Frame processed");
      },
      onDetectionTime: (timeMs) => {
        setDetectionTime(timeMs);
      },
    });

    return () => {
      // Clean up when component unmounts
      if (segmentationRef.current) {
        segmentationRef.current.stop();
      }
    };
  }, []);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setFileName(file.name);

    // Stop any running segmentation
    if (isRunning && segmentationRef.current) {
      segmentationRef.current.stop();
      setIsRunning(false);
    }

    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith("image/") ? "image" : "video";
    setMediaType(fileType);

    if (fileType === "image" && imageRef.current) {
      imageRef.current.src = fileUrl;
    } else if (fileType === "video" && videoRef.current) {
      videoRef.current.src = fileUrl;
      videoRef.current.onloadedmetadata = () => {
        processUploadedMedia(fileType);
      };
    }
  };

  // Process uploaded media
  const processUploadedMedia = async (fileType: MediaType) => {
    if (!canvasRef.current || !segmentationRef.current) return;

    console.log("Processing uploaded media");

    try {
      if (fileType === "image" && imageRef.current) {
        await segmentationRef.current.processImage(imageRef.current, canvasRef.current);
      } else if (fileType === "video" && videoRef.current) {
        await segmentationRef.current.processVideo(videoRef.current, canvasRef.current);
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Failed to process media:", error);
    }
  };

  // Start camera and segmentation
  const startCameraAndSegmentation = async () => {
    if (!videoRef.current || !canvasRef.current || !segmentationRef.current) return;

    setMediaType("camera");
    setFileName("");

    try {
      await segmentationRef.current.startCamera(videoRef.current, canvasRef.current);
      setIsRunning(true);
    } catch (error) {
      console.error("Failed to start segmentation:", error);
    }
  };

  // Stop segmentation
  const stopSegmentation = () => {
    if (segmentationRef.current) {
      segmentationRef.current.stop();
      setIsRunning(false);
    }
  };

  return (
    <div className="segmentation-demo">
      <h2 className="demo-title">MediaPipe Segmentation Demo</h2>

      <div className="demo-container">
        <div className="video-container">
          {/* Video element (hidden when in image mode) */}
          <video
            ref={videoRef}
            style={{
              display: mediaType === "image" ? "none" : "block",
              width: "100%",
              maxWidth: "640px",
              height: "auto",
              borderRadius: "8px",
            }}
            playsInline
            muted
            controls={mediaType === "video"}
          />

          {/* Image element (hidden when not in image mode) */}
          <img
            ref={imageRef}
            src="./imgs/default.png"
            onLoad={() => {
              processUploadedMedia("image");
            }}
            style={{
              display: mediaType !== "image" ? "none" : "block",
              width: "100%",
              maxWidth: "640px",
              height: "auto",
              borderRadius: "8px",
            }}
            alt="Uploaded image"
          />

          {/* Canvas element (displays the processed output) */}
          <canvas ref={canvasRef} width="640" height="480" style={{ pointerEvents: "none" }} />
        </div>

        <div className="controls-panel">
          <button
            className={`control-button ${isRunning ? "stop" : "start"}`}
            onClick={isRunning ? stopSegmentation : startCameraAndSegmentation}
          >
            {isRunning ? "Stop" : "Start Camera and Segmentation"}
          </button>

          <div className="upload-container">
            <div className="file-input-wrapper">
              <button className="file-input-btn">Upload Media</button>
              <input type="file" id="media-upload" accept="image/*,video/*" onChange={handleFileUpload} />
            </div>
            <span className="file-name">{fileName}</span>
          </div>

          {detectionTime !== null && (
            <div className="detection-time">
              <p>Detection Time: {detectionTime.toFixed(2)} ms</p>
            </div>
          )}

          <div className="instructions">
            <h3>How it works</h3>
            <p>
              This demo uses MediaPipe's Selfie Segmentation to separate you from the background. The background is
              blurred while keeping you in focus.
            </p>
            <p>Adjust the slider to control the amount of background blur.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
