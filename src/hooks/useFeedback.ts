import { useSyncExternalStore } from 'react';
import {
  isSoundEnabled,
  setSoundEnabled,
  subscribeSoundEnabled,
  triggerClick,
  playGalacticHover
} from '../utils/feedbackManager';

export function useFeedback() {
  const soundEnabled = useSyncExternalStore(subscribeSoundEnabled, isSoundEnabled);

  const toggleSound = () => {
    const nextState = !isSoundEnabled();
    setSoundEnabled(nextState);

    // Play a preview click if enabled
    if (nextState) {
      triggerClick();
    }
  };

  return {
    soundEnabled,
    toggleSound,
    triggerClick,
    playGalacticHover
  };
}
