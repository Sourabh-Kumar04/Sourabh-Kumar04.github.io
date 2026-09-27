/**
 * Procedural Cyberpunk Audio Telemetry using the Web Audio API.
 * Synthesizes pure oscillator waveforms with zero external audio assets.
 */

class AudioTelemetry {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    // Only initialize when window is defined and user has previously enabled audio
    if (typeof window !== "undefined") {
      try {
        this.enabled = window.localStorage.getItem("sk_audio_telemetry") === "true";
      } catch {
        this.enabled = false;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => undefined);
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("sk_audio_telemetry", String(enable));
      } catch {
        // Persistent storage may be blocked; keep the setting for this session.
      }
    }
    if (enable) {
      this.getContext();
      this.playSuccess();
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  /** Subtle futuristic click chirp */
  public playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // ignore disconnect errors
        }
      };

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Audio context policy
    }
  }

  /** Telemetry ping for attention re-calculation or section select */
  public playPing() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // ignore disconnect errors
        }
      };

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio context policy
    }
  }

  /** Success harmonic chime */
  public playSuccess() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const frequencies = [587.33, 880.0, 1174.66]; // D5, A5, D6
      const now = ctx.currentTime;

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        const delay = idx * 0.04;
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.04, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.onended = () => {
          try {
            osc.disconnect();
            gain.disconnect();
          } catch {
            // ignore disconnect errors
          }
        };

        osc.start(now + delay);
        osc.stop(now + delay + 0.22);
      });
    } catch {
      // Audio context policy
    }
  }

  /** Terminal beep */
  public playBeep() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // ignore disconnect errors
        }
      };

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio context policy
    }
  }
}

export const audioTelemetry = new AudioTelemetry();
