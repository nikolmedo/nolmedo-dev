import { useState } from 'react';
import {
  isSoundEnabled,
  setSoundEnabled,
  isVibrateEnabled,
  setVibrateEnabled,
  triggerClick,
  playGalacticHover
} from '../utils/feedbackManager';

export function useFeedback() {
  const [soundEnabled, setSoundEnabledState] = useState(isSoundEnabled);
  const [vibrateEnabled, setVibrateEnabledState] = useState(isVibrateEnabled);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    setSoundEnabledState(nextState);
    
    // Play a preview click if enabled
    if (nextState) {
      triggerClick();
    }
  };

  const toggleVibrate = () => {
    const nextState = !vibrateEnabled;
    setVibrateEnabled(nextState);
    setVibrateEnabledState(nextState);

    // Provide a physical tap to confirm if vibrator is turned ON
    if (nextState && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(10);
      } catch (e) {
        // Safe fallback
      }
    }
  };

  return {
    soundEnabled,
    vibrateEnabled,
    toggleSound,
    toggleVibrate,
    triggerClick,
    playGalacticHover
  };
}
