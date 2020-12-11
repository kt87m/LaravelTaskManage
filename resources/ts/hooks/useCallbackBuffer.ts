import { useRef } from 'react';

type Callback = (args: any[]) => void;

function useCallbackBuffer(timeoutMs = 1000): (callback: Callback) => void {
  const timeoutRef = useRef<undefined | number>(undefined);
  return (callback: Callback) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(callback, timeoutMs);
  };
}

export default useCallbackBuffer;
