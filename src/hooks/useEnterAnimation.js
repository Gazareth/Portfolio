import { useState, useEffect, useCallback } from 'react';

const useEnterAnimation = ({ ticker, enterTime, enterDelay = 0, enterDuration = 750, debug = false }) => {
  const [hasEntered, setHasEntered] = useState(false);
  const [enteredProgress, setEnteredProg] = useState(0.0);

  const updateAnimation = useCallback(() => {
    if (!hasEntered) {
      const currentTime = new Date().getTime();
      const lifeFactor = Math.min(Math.max(currentTime - enterTime - enterDelay, 0) / enterDuration, 1);

      if (lifeFactor < 1) {
        if (debug) console.log('inside!', lifeFactor);
        setEnteredProg(lifeFactor);
      } else {
        if (debug) console.log('hasEntered!', lifeFactor);
        setHasEntered(true);
      }
    }
  }, [debug, enterDelay, enterDuration, enterTime, hasEntered]);

  useEffect(() => {
    if (!hasEntered) {
      ticker.add(updateAnimation);
      if (debug) console.log('Starting ticker!', hasEntered);
    }
    return () => ticker.remove(updateAnimation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [enteredProgress, hasEntered];
};

export default useEnterAnimation;
