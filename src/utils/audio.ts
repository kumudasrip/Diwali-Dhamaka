/**
 * Web Audio API Chiptune & Sound FX Synthesizer
 * 100% self-contained, no external files required.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private bgmStep: number = 0;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.bgmPlaying) {
      this.stopBGM();
      this.bgmPlaying = true; // remember preference
    } else if (!this.isMuted && this.bgmPlaying) {
      this.startBGM();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
    }
  }

  // Helper: Create White/Pink Noise Buffer
  private createNoiseBuffer(duration: number = 1.0): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Coin Ding (Chiptune two-tone arpeggio)
  public playCoinSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 2. Burning Fuse Sizzle
  public playFuseSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const noise = this.createNoiseBuffer(0.2);
    if (!noise) return;

    const src = this.ctx.createBufferSource();
    src.buffer = noise;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800 + Math.random() * 800, now);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start(now);
    src.stop(now + 0.18);
  }

  // 3. Snappy Pop (Bijli Bomb)
  public playPopSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);

    // Short noise click
    const noise = this.createNoiseBuffer(0.05);
    if (noise) {
      const src = this.ctx.createBufferSource();
      src.buffer = noise;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.2, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      src.connect(nGain);
      nGain.connect(this.ctx.destination);
      src.start(now);
      src.stop(now + 0.05);
    }
  }

  // 4. Heavy Explosion (Atom Bomb / Lakshmi Bomb)
  public playExplosionSound(power: 'small' | 'medium' | 'heavy' = 'medium') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dur = power === 'heavy' ? 1.4 : power === 'medium' ? 0.9 : 0.5;

    // Sub Bass Thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'square';
    const startFreq = power === 'heavy' ? 180 : power === 'medium' ? 240 : 300;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + dur * 0.4);

    const oscVol = power === 'heavy' ? 0.45 : power === 'medium' ? 0.3 : 0.2;
    oscGain.gain.setValueAtTime(oscVol, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.5);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + dur * 0.5);

    // Lowpass Filtered Noise Blast
    const noise = this.createNoiseBuffer(dur);
    if (noise) {
      const nSrc = this.ctx.createBufferSource();
      nSrc.buffer = noise;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(power === 'heavy' ? 1200 : 1800, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + dur);

      const nGain = this.ctx.createGain();
      const nVol = power === 'heavy' ? 0.5 : power === 'medium' ? 0.35 : 0.2;
      nGain.gain.setValueAtTime(nVol, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      nSrc.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);

      nSrc.start(now);
      nSrc.stop(now + dur);
    }
  }

  // 5. Whirring Chakra Sound
  public playChakraSound(intensity: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Frequency oscillation for spinning effect
    const freq = 180 + Math.sin(now * 30) * 80 + intensity * 60;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq + 100, now + 0.1);

    gain.gain.setValueAtTime(0.08 * intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 6. Rocket Launch Whoosh
  public playRocketLaunchSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dur = 1.1;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + dur);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.22, now + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + dur);
  }

  // 7. Sparkler Crackle
  public playSparklerSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const noise = this.createNoiseBuffer(0.06);
    if (!noise) return;

    const src = this.ctx.createBufferSource();
    src.buffer = noise;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3500 + Math.random() * 2000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start(now);
    src.stop(now + 0.05);
  }

  // 8. Snake Pill Sizzle / Grow
  public playSnakeSizzle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const noise = this.createNoiseBuffer(0.12);
    if (!noise) return;

    const src = this.ctx.createBufferSource();
    src.buffer = noise;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100 + Math.sin(now * 10) * 300, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start(now);
    src.stop(now + 0.1);
  }

  // 9. Joyous Celebration Fanfare / Cheer
  public playCheerSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime + idx * 0.1;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  // 10. Broom Sweeping Sound (Swoosh & bristly brush rustle)
  public playSweepSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const noise = this.createNoiseBuffer(0.25);
    if (!noise) return;

    const src = this.ctx.createBufferSource();
    src.buffer = noise;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.25);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start(now);
    src.stop(now + 0.25);
  }

  // 11. 8-Bit Retro Chiptune Festive Music Generator
  // Upbeat Indian pentatonic Raag Bhupali melody (Sa Re Ga Pa Dha / C D E G A)
  public startBGM() {
    this.bgmPlaying = true;
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
    }

    // Raag Bhupali scale notes (Hz)
    // C4=261.63, D4=293.66, E4=329.63, G4=392.00, A4=440.00
    // C5=523.25, D5=587.33, E5=659.25, G5=783.99, A5=880.00
    const melody = [
      523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 0,
      659.25, 783.99, 880.00, 783.99, 659.25, 783.99, 659.25, 587.33,
      523.25, 659.25, 783.99, 880.00, 1046.5, 880.00, 783.99, 659.25,
      587.33, 659.25, 587.33, 523.25, 440.00, 523.25, 523.25, 0,
    ];

    const bass = [
      130.81, 0, 130.81, 164.81, 196.00, 0, 196.00, 0,
      164.81, 0, 196.00, 220.00, 196.00, 0, 164.81, 0,
      130.81, 164.81, 196.00, 0, 261.63, 0, 196.00, 0,
      146.83, 0, 164.81, 0, 130.81, 0, 130.81, 0,
    ];

    const stepDurationMs = 150; // tempo ~ 100 BPM 16th notes

    this.bgmIntervalId = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const noteIdx = this.bgmStep % melody.length;
      const mFreq = melody[noteIdx];
      const bFreq = bass[noteIdx];

      // Play melody note
      if (mFreq > 0) {
        const mOsc = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();
        mOsc.type = 'square';
        mOsc.frequency.setValueAtTime(mFreq, now);

        mGain.gain.setValueAtTime(0.04, now);
        mGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        mOsc.connect(mGain);
        mGain.connect(this.ctx.destination);
        mOsc.start(now);
        mOsc.stop(now + 0.13);
      }

      // Play bass note
      if (bFreq > 0) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bFreq, now);

        bGain.gain.setValueAtTime(0.06, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.14);
      }

      // Rhythmic 8-bit hi-hat tap on every alternate beat
      if (noteIdx % 2 === 0) {
        const noise = this.createNoiseBuffer(0.03);
        if (noise) {
          const nSrc = this.ctx.createBufferSource();
          nSrc.buffer = noise;
          const hFilter = this.ctx.createBiquadFilter();
          hFilter.type = 'highpass';
          hFilter.frequency.setValueAtTime(7000, now);
          const nGain = this.ctx.createGain();
          nGain.gain.setValueAtTime(0.015, now);
          nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

          nSrc.connect(hFilter);
          hFilter.connect(nGain);
          nGain.connect(this.ctx.destination);
          nSrc.start(now);
          nSrc.stop(now + 0.025);
        }
      }

      this.bgmStep++;
    }, stepDurationMs);
  }

  public stopBGM() {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public isMusicPlaying(): boolean {
    return this.bgmPlaying && !this.isMuted;
  }
}

export const sound = new SoundEngine();
