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

// Persisted settings (opt-in: absent key means disabled)
function readSetting(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

let soundEnabled = readSetting('feedback_sound_enabled');
const vibrateEnabled = readSetting('feedback_vibrate_enabled');
const soundListeners = new Set<() => void>();

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('feedback_sound_enabled', String(enabled));
  } catch {
    // Storage can be blocked; keep the in-memory setting for this session
  }
  soundEnabled = enabled;
  soundListeners.forEach((listener) => listener());
}

export function subscribeSoundEnabled(listener: () => void) {
  soundListeners.add(listener);
  return () => {
    soundListeners.delete(listener);
  };
}

function canVibrate(): boolean {
  return (
    vibrateEnabled &&
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
}

function vibrate() {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(10);
  } catch (err) {
    // Safe fallback if browser security blocks vibration
  }
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

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = params.type || 'sine';

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

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

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

// Click sound presets per theme
const THEME_PRESETS: Record<string, SoundParams> = {
  default: { frequencyStart: 600, frequencyEnd: 300, duration: 0.08, type: 'triangle', gainValue: 0.025, ramp: 'exponential' },
  cyberpunk: { frequencyStart: 1100, frequencyEnd: 220, duration: 0.1, type: 'sawtooth', gainValue: 0.012, ramp: 'exponential' },
  matrix: { frequencyStart: 900, frequencyEnd: 450, duration: 0.08, type: 'sine', gainValue: 0.02, ramp: 'linear' },
  synthwave: { frequencyStart: 440, frequencyEnd: 220, duration: 0.12, type: 'triangle', gainValue: 0.03, ramp: 'exponential' },
  glacier: { frequencyStart: 1400, frequencyEnd: 700, duration: 0.1, type: 'sine', gainValue: 0.018, ramp: 'exponential' }
};

function getPreset(theme: string): SoundParams {
  return THEME_PRESETS[theme] || THEME_PRESETS.default;
}

// Trigger Click Sound & Haptic Vibration
export function triggerClick() {
  playSynthTone(getPreset(getTheme()));
  vibrate();
}

let lastChipClickTime = 0;

// Chip click sound: a short hum from two detuned triangle oscillators (beating effect),
// throttled to 150ms so rapid clicks do not stack
export function playChipClick() {
  if (!soundEnabled && !vibrateEnabled) return;

  const now = Date.now();
  if (now - lastChipClickTime < 150) return;
  lastChipClickTime = now;

  vibrate();

  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    const duration = 0.25;
    const fadeInDuration = 0.06;
    const gainValue = 0.025;

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

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

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
    console.warn('Failed to play chip click sound:', err);
  }
}
