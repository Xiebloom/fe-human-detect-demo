import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import * as tf from "@tensorflow/tfjs-core";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";

const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
const segmenterConfig = {
  runtime: "tfjs",
};
const segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
