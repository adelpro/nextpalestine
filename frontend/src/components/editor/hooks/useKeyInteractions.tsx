import { useEffect, useState } from 'react';

/**
 * Detect if the user currently presses or releases a mouse button.
 */

export default function useKeyInteractions() {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isPointerReleased, setIsPointerReleased] = useState(true);
  const [isKeyDown, setIsKeyDown] = useState(false);

  useEffect(() => {
    const handlePointerUp = () => {
      setIsPointerDown(false);
      setIsPointerReleased(true);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    const handlePointerDown = () => {
      setIsPointerDown(true);
      setIsPointerReleased(false);
      document.addEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyUp = () => {
      setIsKeyDown(false);
      document.removeEventListener('keyup', handleKeyUp);
    };

    const handleKeyDown = () => {
      setIsKeyDown(true);
      document.addEventListener('keyup', handleKeyUp);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return { isPointerDown, isPointerReleased, isKeyDown };
}
