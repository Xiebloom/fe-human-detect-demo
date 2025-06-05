import { ImageSegmenter, FilesetResolver } from '@mediapipe/tasks-vision';

export async function createSegmenter(): Promise<ImageSegmenter> {
  try {
    // Create a FilesetResolver to resolve dependencies
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    
    // Create an image segmenter instance
    const imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
        delegate: "GPU"
      },
      runningMode: "IMAGE",
      outputCategoryMask: true
    });
    
    return imageSegmenter;
  } catch (error) {
    console.error("Failed to create image segmenter:", error);
    throw new Error("Failed to create image segmenter");
  }
}
