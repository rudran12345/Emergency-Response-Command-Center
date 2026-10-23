// Web Audio API sound synthesis for futuristic command center audio feedback

class SoundService {
  private audioCtx: AudioContext | null = null;
  private soundEnabled = true;

  constructor() {
    // Check initial setting
    const saved = localStorage.getItem('ercc_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.soundEnabled = parsed.notificationSounds ?? true;
      } catch {
        // ignore
      }
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  private initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public playBeep(freq = 880, type: OscillatorType = 'sine', duration = 0.08) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio not permitted without user gesture or unsupported
    }
  }

  public playAlertCritical() {
    if (!this.soundEnabled) return;
    this.playBeep(920, 'sawtooth', 0.12);
    setTimeout(() => this.playBeep(1150, 'sawtooth', 0.15), 130);
  }

  public playAlertWarning() {
    if (!this.soundEnabled) return;
    this.playBeep(640, 'triangle', 0.1);
    setTimeout(() => this.playBeep(800, 'triangle', 0.12), 120);
  }

  public playDispatch() {
    if (!this.soundEnabled) return;
    this.playBeep(440, 'sine', 0.08);
    setTimeout(() => this.playBeep(660, 'sine', 0.08), 90);
    setTimeout(() => this.playBeep(880, 'sine', 0.12), 180);
  }
}

export const soundService = new SoundService();
