import React, { useEffect, useRef, useState } from "react";
import { createTFSegmentation } from "./tsModelSegmentor";

import "./TensorFlowDemo.css";

type MediaType = "camera" | "image" | "video";

export const TensorFlowDemo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [fileName, setFileName] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [detectionTime, setDetectionTime] = useState<number | null>(null);
  const segmentationRef = useRef<ReturnType<typeof createTFSegmentation> | null>(null);

  // Initialize segmentation when component mounts
  useEffect(() => {
    segmentationRef.current = createTFSegmentation({
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
      <h2 className="demo-title">TensorFlow.js 图像分割演示</h2>

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
            onLoadedData={() => console.log("Video loaded")}
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
            {isRunning ? "停止" : "启动摄像头和分割"}
          </button>

          <div className="upload-container">
            <div className="file-input-wrapper">
              <button className="file-input-btn">上传媒体</button>
              <input type="file" id="media-upload" accept="image/*,video/*" onChange={handleFileUpload} />
            </div>
            <span className="file-name">{fileName}</span>
          </div>

          {detectionTime !== null && (
            <div className="detection-time">
              <p>检测时间: {detectionTime.toFixed(2)} ms</p>
            </div>
          )}

          <div className="instructions">
            <h3>工作原理</h3>
            <p>
              此演示使用 TensorFlow.js 的 MediaPipe Selfie Segmentation 模型将您与背景分离。
              背景被模糊处理，而您保持清晰。
            </p>
            <p>您可以上传图片或视频，或使用摄像头进行实时分割。</p>
          </div>
        </div>
      </div>
    </div>
  );
};
