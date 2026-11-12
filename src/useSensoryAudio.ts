import { useCallback, useEffect, useRef, useState } from "react";

export type Cue =
  | "scan"
  | "step"
  | "bump"
  | "car"
  | "help"
  | "arrive"
  | "safe"
  | "click"
  | "blocked";

type Ambience = {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
};

export function useSensoryAudio() {
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const soundRef = useRef(true);
  const voiceRef = useRef(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const ambienceRef = useRef<Ambience | null>(null);
  const startedRef = useRef(false);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined" || !window.AudioContext) return null;
    if (!ctxRef.current) {
      const ctx = new window.AudioContext();
      const master = ctx.createGain();
      master.gain.value = soundRef.current ? 0.9 : 0;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const startAmbience = useCallback(() => {
    const ctx = ensureCtx();
    const master = masterRef.current;
    if (!ctx || !master || ambienceRef.current) return;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(master);

    const hum = ctx.createOscillator();
    hum.type = "sine";
    hum.frequency.value = 54;
    const humHigh = ctx.createOscillator();
    humHigh.type = "sine";
    humHigh.frequency.value = 81;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.028;
    hum.connect(humGain);
    humHigh.connect(humGain);
    humGain.connect(gain);

    const seconds = 2.4;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.32;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 340;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(gain);

    hum.start();
    humHigh.start();
    noise.start();
    gain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2.2);

    ambienceRef.current = { gain, sources: [hum, humHigh, noise] };
  }, [ensureCtx]);

  const stopAmbience = useCallback(() => {
    const ctx = ctxRef.current;
    const ambience = ambienceRef.current;
    if (!ctx || !ambience) return;
    ambienceRef.current = null;
    ambience.gain.gain.cancelScheduledValues(ctx.currentTime);
    ambience.gain.gain.setValueAtTime(ambience.gain.gain.value, ctx.currentTime);
    ambience.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    window.setTimeout(() => {
      ambience.sources.forEach((source) => {
        try {
          source.stop();
        } catch {
          /* already stopped */
        }
      });
    }, 800);
  }, []);

  const begin = useCallback(() => {
    startedRef.current = true;
    const ctx = ensureCtx();
    if (ctx && masterRef.current) {
      masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterRef.current.gain.linearRampToValueAtTime(soundRef.current ? 0.9 : 0, ctx.currentTime + 0.3);
    }
    startAmbience();
  }, [ensureCtx, startAmbience]);

  const cue = useCallback(
    (name: Cue) => {
      if (!soundRef.current) return;
      const ctx = ensureCtx();
      const master = masterRef.current;
      if (!ctx || !master) return;
      const now = ctx.currentTime;

      const tone = (
        frequency: number,
        duration: number,
        type: OscillatorType,
        volume: number,
        delay = 0,
        endFrequency?: number,
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now + delay);
        if (endFrequency) {
          osc.frequency.exponentialRampToValueAtTime(endFrequency, now + delay + duration);
        }
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(volume, now + delay + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.02);
      };

      const noise = (
        duration: number,
        volume: number,
        filterType: BiquadFilterType,
        frequency: number,
        delay = 0,
      ) => {
        const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i += 1) {
          data[i] = Math.random() * 2 - 1;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = frequency;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(volume, now + delay + 0.02);
        gain.gain.linearRampToValueAtTime(0.0001, now + delay + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        source.start(now + delay);
      };

      switch (name) {
        case "scan":
          tone(660, 0.2, "sine", 0.09);
          tone(990, 0.26, "sine", 0.055, 0.18);
          break;
        case "step":
          noise(0.1, 0.05, "lowpass", 640);
          tone(92, 0.08, "sine", 0.06);
          break;
        case "bump":
          tone(74, 0.24, "sine", 0.16, 0, 48);
          noise(0.09, 0.06, "lowpass", 280);
          break;
        case "car":
          noise(0.5, 0.055, "bandpass", 860);
          tone(128, 0.42, "sawtooth", 0.035, 0, 68);
          tone(190, 0.18, "sawtooth", 0.02, 0.16, 120);
          break;
        case "help":
          tone(523, 0.16, "sine", 0.075);
          tone(659, 0.22, "sine", 0.065, 0.13);
          break;
        case "safe":
          tone(587, 0.12, "sine", 0.06);
          tone(880, 0.2, "sine", 0.055, 0.1);
          break;
        case "blocked":
          tone(150, 0.16, "square", 0.04);
          tone(150, 0.16, "square", 0.04, 0.22);
          break;
        case "click":
          tone(980, 0.05, "sine", 0.03);
          break;
        case "arrive":
          [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
            tone(frequency, 0.7, "sine", 0.07, index * 0.13);
            tone(frequency / 2, 0.8, "triangle", 0.025, index * 0.13);
          });
          break;
        default:
          break;
      }
    },
    [ensureCtx],
  );

  const speak = useCallback((text: string) => {
    if (!voiceRef.current || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 0.95;
      const voice = window.speechSynthesis
        .getVoices()
        .find((item) => item.lang.toLowerCase().startsWith("pt-br"));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* speech synthesis is a progressive enhancement */
    }
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!soundRef.current) return;
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSoundOn(next);
    const ctx = ensureCtx();
    if (!ctx || !masterRef.current) return;
    masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
    masterRef.current.gain.linearRampToValueAtTime(next ? 0.9 : 0, ctx.currentTime + 0.18);
    if (next && startedRef.current) startAmbience();
  }, [ensureCtx, startAmbience]);

  const toggleVoice = useCallback(() => {
    const next = !voiceRef.current;
    voiceRef.current = next;
    setVoiceOn(next);
    if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stopVoice = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (ambienceRef.current) {
        ambienceRef.current.sources.forEach((source) => {
          try {
            source.stop();
          } catch {
            /* already stopped */
          }
        });
        ambienceRef.current = null;
      }
      if (ctxRef.current) {
        void ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, []);

  return {
    soundOn,
    voiceOn,
    begin,
    cue,
    speak,
    vibrate,
    toggleSound,
    toggleVoice,
    stopAmbience,
    stopVoice,
  };
}
