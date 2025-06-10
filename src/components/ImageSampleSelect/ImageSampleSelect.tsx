import { useState } from "react";
import { SAMPLE_IMAGES, SampleImage } from "./images";

import "./ImageSampleSelect.css";

export type ImageSampleSelectProps = {
  imageElement: HTMLImageElement;
  onImageSelected?: (src: string) => void;
};

export function ImageSampleSelect({ imageElement, onImageSelected }: ImageSampleSelectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SampleImage | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectImage = (image: SampleImage) => {
    setSelectedImage(image);
  };

  const confirmSelection = (selected: SampleImage | null = selectedImage) => {
    if (selected) {
      // 更新图像元素的src
      imageElement.src = selected.path;

      // 如果提供了回调，则调用它
      if (onImageSelected) {
        onImageSelected(selected.path);
      }

      closeModal();
    }
  };

  return (
    <div className="image-sample-select">
      <button className="select-button" onClick={openModal}>
        Select Sample
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>选择样本图片</h3>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="sample-grid">
              {SAMPLE_IMAGES.map((image) => (
                <div
                  key={image.id}
                  className={`sample-item ${selectedImage?.id === image.id ? "selected" : ""}`}
                  onClick={() => selectImage(image)}
                  onDoubleClick={() => {
                    selectImage(image);
                    confirmSelection(image);
                  }}
                >
                  <img src={image.thumbnail} alt={image.name} />
                  <span>{image.name}</span>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="confirm-button" onClick={() => confirmSelection()} disabled={!selectedImage}>
                确定
              </button>
              <button className="cancel-button" onClick={closeModal}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
