let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (typeof window === 'undefined') {
    throw new Error('AudioContext can only be initialized in browser environments');
  }
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getTheme(): string {
  if (typeof document === 'undefined') return 'default';
  const root = document.querySelector('.nolmedo-root');
  return root?.getAttribute('data-theme') || 'default';
}

// Persisted settings helpers
export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = localStorage.getItem('feedback_sound_enabled');
  // Default to true if not set
  return val === null ? true : val === 'true';
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('feedback_sound_enabled', String(enabled));
}

export function isVibrateEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = localStorage.getItem('feedback_vibrate_enabled');
  // Default to true if not set
  return val === null ? true : val === 'true';
}

export function setVibrateEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('feedback_vibrate_enabled', String(enabled));
}

interface SoundParams {
  frequencyStart: number;
  frequencyEnd?: number;
  duration: number;
  type?: OscillatorType;
  gainValue: number;
  ramp?: 'linear' | 'exponential';
}

function playSynthTone(params: SoundParams) {
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    
    // Create nodes
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = params.type || 'sine';
    
    // Set frequency
    osc.frequency.setValueAtTime(params.frequencyStart, ctx.currentTime);
    if (params.frequencyEnd) {
      if (params.ramp === 'exponential') {
        osc.frequency.exponentialRampToValueAtTime(params.frequencyEnd, ctx.currentTime + params.duration);
      } else {
        osc.frequency.linearRampToValueAtTime(params.frequencyEnd, ctx.currentTime + params.duration);
      }
    }

    // Set gain curve to prevent pops (starts at gainValue, decays exponentially to near-zero)
    gainNode.gain.setValueAtTime(params.gainValue, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + params.duration);

    // Connections
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play
    osc.start();
    osc.stop(ctx.currentTime + params.duration);

    // Disconnect nodes to prevent memory leaks
    setTimeout(() => {
      osc.disconnect();
      gainNode.disconnect();
    }, (params.duration + 0.1) * 1000);
  } catch (err) {
    console.warn('Failed to play sound feedback:', err);
  }
}

// Sound presets for theme coordinates
const THEME_PRESETS: Record<string, {
  hover: SoundParams;
  click: SoundParams;
  scroll: SoundParams;
}> = {
  default: {
    hover: { frequencyStart: 280, duration: 0.05, type: 'sine', gainValue: 0.015 },
    click: { frequencyStart: 600, frequencyEnd: 300, duration: 0.08, type: 'triangle', gainValue: 0.025, ramp: 'exponential' },
    scroll: { frequencyStart: 120, duration: 0.04, type: 'sine', gainValue: 0.02 }
  },
  cyberpunk: {
    hover: { frequencyStart: 380, duration: 0.04, type: 'triangle', gainValue: 0.01 },
    click: { frequencyStart: 1100, frequencyEnd: 220, duration: 0.1, type: 'sawtooth', gainValue: 0.012, ramp: 'exponential' },
    scroll: { frequencyStart: 90, duration: 0.05, type: 'triangle', gainValue: 0.015 }
  },
  matrix: {
    hover: { frequencyStart: 340, duration: 0.04, type: 'sine', gainValue: 0.012 },
    click: { frequencyStart: 900, frequencyEnd: 450, duration: 0.08, type: 'sine', gainValue: 0.02, ramp: 'linear' },
    scroll: { frequencyStart: 80, duration: 0.04, type: 'sine', gainValue: 0.015 }
  },
  synthwave: {
    hover: { frequencyStart: 200, duration: 0.07, type: 'triangle', gainValue: 0.02 },
    click: { frequencyStart: 440, frequencyEnd: 220, duration: 0.12, type: 'triangle', gainValue: 0.03, ramp: 'exponential' },
    scroll: { frequencyStart: 95, duration: 0.06, type: 'triangle', gainValue: 0.02 }
  },
  glacier: {
    hover: { frequencyStart: 580, duration: 0.05, type: 'sine', gainValue: 0.008 },
    click: { frequencyStart: 1400, frequencyEnd: 700, duration: 0.1, type: 'sine', gainValue: 0.018, ramp: 'exponential' },
    scroll: { frequencyStart: 200, duration: 0.05, type: 'sine', gainValue: 0.012 }
  }
};

function getPreset(theme: string) {
  return THEME_PRESETS[theme] || THEME_PRESETS.default;
}

// Trigger Click Sound & Haptic Vibration
export function triggerClick() {
  const theme = getTheme();
  const preset = getPreset(theme);
  
  // Play sound
  playSynthTone(preset.click);

  // Trigger mobile haptic feedback safely
  if (isVibrateEnabled() && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(10);
    } catch (err) {
      // Safe fallback if browser security blocks vibration
    }
  }
}

let lastGalacticHoverTime = 0;

// Galactic hover sound effect - Spaceship hum / Lightsaber whoosh (throttled to 150ms)
// Synthesized using two detuned triangle wave oscillators to create a beating effect
export function playGalacticHover() {
  const soundEnabled = isSoundEnabled();
  const vibrateEnabled = isVibrateEnabled();
  if (!soundEnabled && !vibrateEnabled) return;

  const now = Date.now();
  if (now - lastGalacticHoverTime < 150) return;
  lastGalacticHoverTime = now;

  // Trigger mobile haptic feedback safely
  if (isVibrateEnabled() && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(10);
    } catch (err) {
      // Safe fallback if browser security blocks vibration
    }
  }

  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    const duration = 0.25;
    const fadeInDuration = 0.06;
    const gainValue = 0.025;

    // Create two oscillators and a gain node
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'triangle';

    const t = ctx.currentTime;

    // Fixed low frequencies (68Hz and 71Hz for a lightsaber/spaceship hum)
    osc1.frequency.setValueAtTime(68, t);
    osc2.frequency.setValueAtTime(71, t);

    // Smooth attack (fade-in) and decay (fade-out)
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(gainValue, t + fadeInDuration);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    // Connect nodes
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start and stop
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);

    // Disconnect nodes to prevent memory leaks
    setTimeout(() => {
      osc1.disconnect();
      osc2.disconnect();
      gainNode.disconnect();
    }, (duration + 0.1) * 1000);
  } catch (err) {
    console.warn('Failed to play galactic hover sound feedback:', err);
  }
}

