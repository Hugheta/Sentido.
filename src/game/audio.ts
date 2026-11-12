export type Surface = "tactile" | "alert" | "concrete" | "broken" | "puddle" | "asphalt" | "crosswalk" | "beacon";
export type Ambience = "street" | "avenue" | "market";

type AmbientRig = {
  gain: GainNode;
  nodes: AudioScheduledSourceNode[];
};

/**
 * Sintetizador acústico do jogo. Nenhum arquivo de áudio é necessário:
 * batidas, sonar, tráfego e ambiências são gerados no navegador.
 */
export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambience: AmbientRig | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private lastTraffic = 0;
  soundOn = true;
  voiceOn = true;

  init() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.soundOn ? 0.85 : 0;
      this.master.connect(this.ctx.destination);
      this.noiseBuffer = this.makeNoise(this.ctx, 2);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private makeNoise(ctx: AudioContext, seconds: number) {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private tone(freq: number, duration: number, type: OscillatorType, volume: number, when = 0, endFreq?: number, pan = 0) {
    const ctx = this.init();
    if (!ctx || !this.master || !this.soundOn) return;
    const start = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  private noise(duration: number, volume: number, filter: BiquadFilterType, freq: number, when = 0, pan = 0, q = 1) {
    const ctx = this.init();
    if (!ctx || !this.master || !this.noiseBuffer || !this.soundOn) return;
    const start = ctx.currentTime + when;
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    const biquad = ctx.createBiquadFilter();
    biquad.type = filter;
    biquad.frequency.value = freq;
    biquad.Q.value = q;
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(biquad);
    biquad.connect(gain);
    gain.connect(panner);
    panner.connect(this.master);
    source.start(start);
    source.stop(start + duration + 0.04);
  }

  private chord(notes: number[], volume = 0.05) {
    notes.forEach((note, index) => {
      this.tone(note, 0.8, "sine", volume, index * 0.1);
      this.tone(note / 2, 0.9, "triangle", volume * 0.4, index * 0.1);
    });
  }

  tap(surface: Surface) {
    switch (surface) {
      case "tactile":
        this.noise(0.045, 0.16, "highpass", 2100);
        this.tone(1850, 0.075, "square", 0.035);
        this.tone(920, 0.06, "sine", 0.04);
        break;
      case "alert":
        this.noise(0.07, 0.14, "bandpass", 1500, 0, 0, 4);
        this.tone(740, 0.11, "sine", 0.06);
        break;
      case "concrete":
        this.noise(0.06, 0.11, "lowpass", 780);
        this.tone(180, 0.07, "sine", 0.05);
        break;
      case "broken":
        this.noise(0.1, 0.15, "lowpass", 520);
        this.tone(120, 0.12, "triangle", 0.06);
        break;
      case "puddle":
        this.noise(0.16, 0.13, "lowpass", 900);
        this.tone(300, 0.16, "sine", 0.03, 0, 120);
        break;
      case "asphalt":
        this.noise(0.055, 0.12, "lowpass", 380);
        this.tone(95, 0.08, "sine", 0.055);
        break;
      case "crosswalk":
        this.noise(0.06, 0.12, "bandpass", 1100);
        this.tone(620, 0.08, "sine", 0.04);
        break;
      case "beacon":
        this.tone(880, 0.2, "sine", 0.06);
        this.tone(1320, 0.3, "sine", 0.035, 0.11);
        break;
      default:
        break;
    }
  }

  step(surface: Surface) {
    const freq = surface === "tactile" || surface === "alert" ? 2300 : surface === "puddle" ? 900 : 420;
    this.noise(0.055, 0.07, "lowpass", freq);
    this.tone(surface === "tactile" ? 240 : 120, 0.05, "sine", 0.03);
  }

  sonar() {
    this.tone(760, 0.5, "sine", 0.06, 0, 330);
    this.tone(760, 0.42, "sine", 0.022, 0.22, 360);
    this.noise(0.3, 0.025, "bandpass", 1400, 0, 0, 2);
  }

  bump() {
    this.tone(86, 0.24, "sine", 0.16, 0, 42);
    this.noise(0.12, 0.1, "lowpass", 300);
  }

  hazard() {
    this.tone(240, 0.3, "sawtooth", 0.07, 0, 150);
    this.tone(180, 0.4, "square", 0.045, 0.08, 110);
    this.noise(0.45, 0.11, "bandpass", 900, 0, 0, 1.5);
  }

  traffic(heavy: boolean, pan = (Math.random() * 2 - 1) * 0.85) {
    const ctx = this.init();
    if (!ctx || !this.soundOn) return;
    const now = ctx.currentTime;
    if (now - this.lastTraffic < (heavy ? 0.9 : 2.2)) return;
    this.lastTraffic = now;
    this.noise(heavy ? 1.1 : 1.5, heavy ? 0.06 : 0.028, "bandpass", heavy ? 620 : 420, 0, pan, 0.8);
    if (heavy) {
      this.tone(88 + Math.random() * 30, 0.9, "sawtooth", 0.018, 0, 55, pan);
    }
  }

  help() {
    this.tone(523, 0.22, "sine", 0.06);
    this.tone(659, 0.28, "sine", 0.05, 0.12);
    this.tone(784, 0.3, "sine", 0.035, 0.24);
  }

  success() {
    this.chord([523.25, 659.25, 783.99, 1046.5], 0.055);
  }

  signal(safe: boolean) {
    if (safe) {
      this.tone(880, 0.16, "sine", 0.055);
      this.tone(1174, 0.2, "sine", 0.045, 0.14);
    } else {
      this.tone(392, 0.12, "sine", 0.04);
      this.tone(330, 0.16, "sine", 0.035, 0.16);
    }
  }

  startAmbience(kind: Ambience) {
    const ctx = this.init();
    if (!ctx || !this.master) return;
    this.stopAmbience();

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.master);
    const nodes: AudioScheduledSourceNode[] = [];

    const hum = ctx.createOscillator();
    hum.type = "sine";
    hum.frequency.value = kind === "market" ? 62 : kind === "avenue" ? 52 : 46;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.028;
    hum.connect(humGain);
    humGain.connect(gain);
    hum.start();
    nodes.push(hum);

    if (this.noiseBuffer) {
      const bed = ctx.createBufferSource();
      bed.buffer = this.noiseBuffer;
      bed.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = kind === "avenue" ? 700 : kind === "market" ? 1100 : 460;
      const bedGain = ctx.createGain();
      bedGain.gain.value = kind === "avenue" ? 0.055 : kind === "market" ? 0.04 : 0.03;
      bed.connect(filter);
      filter.connect(bedGain);
      bedGain.connect(gain);
      bed.start();
      nodes.push(bed);
    }

    if (kind === "market") {
      const chatter = ctx.createOscillator();
      chatter.type = "triangle";
      chatter.frequency.value = 2.2;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.012;
      chatter.connect(lfoGain);
      lfoGain.connect(gain.gain);
      chatter.start();
      nodes.push(chatter);
    }

    gain.gain.linearRampToValueAtTime(kind === "avenue" ? 0.65 : 0.55, ctx.currentTime + 1.6);
    this.ambience = { gain, nodes };
  }

  stopAmbience() {
    if (!this.ctx || !this.ambience) return;
    const current = this.ambience;
    const now = this.ctx.currentTime;
    current.gain.gain.cancelScheduledValues(now);
    current.gain.gain.setValueAtTime(current.gain.gain.value, now);
    current.gain.gain.linearRampToValueAtTime(0, now + 0.4);
    window.setTimeout(() => {
      current.nodes.forEach((node) => {
        try {
          node.stop();
        } catch {
          /* já parou */
        }
      });
    }, 500);
    this.ambience = null;
  }

  speak(text: string) {
    if (!this.voiceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.98;
      utterance.pitch = 0.98;
      utterance.volume = 1;
      const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("pt-br"));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* narração é um complemento */
    }
  }

  stopSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  setSound(on: boolean) {
    this.soundOn = on;
    const ctx = this.init();
    if (ctx && this.master) {
      this.master.gain.cancelScheduledValues(ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(on ? 0.85 : 0, ctx.currentTime + 0.15);
    }
  }

  setVoice(on: boolean) {
    this.voiceOn = on;
    if (!on) this.stopSpeech();
  }

  vibrate(pattern: number | number[]) {
    if (!this.soundOn) return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  }

  destroy() {
    this.stopSpeech();
    this.stopAmbience();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.master = null;
    }
  }
}
