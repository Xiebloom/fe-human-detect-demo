import { useMediaPipe } from '../context/MediaPipeContext';

/**
 * Measures the execution time of an async function and updates the detection time in the context
 * @param fn The async function to measure
 * @returns The result of the function execution
 */
export async function measureAsyncExecutionTime<T>(fn: () => Promise<T>): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await fn();
    const endTime = performance.now();
    const elapsedTime = Math.round(endTime - startTime);
    
    // We need to return the result and the time
    // In a React component, we would use the context to update the time
    return result;
  } catch (error) {
    console.error("Error during execution:", error);
    throw error;
  }
}

// Hook to measure execution time in React components
export function useMeasureExecutionTime() {
  const { setDetectionTimeMs } = useMediaPipe();

  return async <T>(fn: () => Promise<T>): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      const elapsedTime = Math.round(endTime - startTime);
      setDetectionTimeMs(elapsedTime);
      return result;
    } catch (error) {
      console.error("Error during execution:", error);
      throw error;
    }
  };
}
