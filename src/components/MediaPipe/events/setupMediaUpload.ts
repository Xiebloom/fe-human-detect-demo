import { useCallback } from 'react';
import { MediaType, MediaPipeContextType } from '../types';

// Custom hook for media upload functionality
export const useMediaUpload = ({
  setCurrentMediaType,
  runCurrentModeAnalysis
}: Pick<MediaPipeContextType, 'setCurrentMediaType' | 'runCurrentModeAnalysis'>) => {
  
  // Handle file upload
  const handleFileUpload = useCallback((
    file: File, 
    imageRef: React.RefObject<HTMLImageElement>,
    videoRef: React.RefObject<HTMLVideoElement>,
    setFileName: (name: string) => void
  ) => {
    if (!file) return;
    
    const reader = new FileReader();
    const isVideo = file.type.startsWith('video/');
    
    setFileName(file.name);
    setCurrentMediaType(isVideo ? 'video' : 'image');
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      if (isVideo) {
        if (videoRef.current && imageRef.current) {
          videoRef.current.src = dataUrl;
          imageRef.current.style.display = 'none';
          videoRef.current.style.display = 'block';
          
          // Run analysis when video is ready
          videoRef.current.onloadeddata = () => {
            runCurrentModeAnalysis();
          };
        }
      } else {
        if (imageRef.current && videoRef.current) {
          imageRef.current.src = dataUrl;
          imageRef.current.style.display = 'block';
          videoRef.current.style.display = 'none';
          
          // Run analysis when image is loaded
          imageRef.current.onload = () => {
            runCurrentModeAnalysis();
          };
        }
      }
    };
    
    reader.readAsDataURL(file);
  }, [setCurrentMediaType, runCurrentModeAnalysis]);
  
  return { handleFileUpload };
};
