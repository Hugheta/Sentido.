import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { SCENES, resolveAction, type ActionId, type SignalKind, type Scene, type Tone } from "@/game";
import { useSensoryAudio } from "@/useSensoryAudio";
import {
  Alert,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Compass,
  EyeOff,
  Headphones,
  Play,
  Scan,
  Spark,
  Users,
  Vibrate,
  Voice,
  Volume,
  VolumeOff,
} from "./Icons";

const WAVE = [8, 16, 11, 22, 15, 28, 12, 19, 9, 24, 14, 20, 7, 17, 11];

const ACTION_META: Record<ActionId, { label: string; key: string; hint: string }> = {
  forward: { label: "Avançar", key: "↑", hint: "Dar um passo à frente" },
  left: { label: "Esquerda", key: "←", hint: "Deslocar-se para a esquerda" },
  right: { label: "Direita", key: "→", hint: "Deslocar-se para a direita" },
  interact: { label: "Interagir", key: "E", hint: "Tocar o entorno e escanear" },
  help: { label: "Pedir ajuda", key: "H", hint: "Chamar alguém na rua" },
};

const KIND_STYLE: Record<SignalKind, string> = {
  sound: "border-lime/45 bg-lime/10 text-lime",
  barrier: "border-coral/55 bg-coral/15 text-[#ffab98]",
  safe: "border-cream/35 bg-cream/10 text-cream",
  person: "border-lime/45 bg-lime/10 text-lime",
  goal: "border-cream bg-cream text-ink",
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

type ToneFeedback = { message: string; detail: string; tone: Tone; title: string };

function SceneMap({ scene, keySeed }: { scene: Scene; keySeed: number }) {
  const target = scene.signals.find((signal) => signal.kind === "goal") ?? scene.signals[0];
  const targetX = 50 + Math.sin(target.angle) * target.radius * 42;
  const targetY = 51 - Math.cos(target.angle) * target.radius * 40;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(202,219,132,0.11),transparent_58%)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[7, 15, 23, 31, 39].map((radius, index) => (
          <circle
            key={radius}
            cx="50"
            cy="52"
            r={radius}
            fill="none"
            stroke="rgba(243,238,226,0.09)"
            strokeWidth="0.25"
            strokeDasharray={index % 2 === 0 ? "0.7 1.4" : undefined}
          />
        ))}
        <line x1="50" y1="6" x2="50" y2="94" stroke="rgba(243,238,226,0.07)" strokeWidth="0.2" />
        <line x1="8" y1="52" x2="92" y2="52" stroke="rgba(243,238,226,0.07)" strokeWidth="0.2" />
        <path
          d={`M50 52 Q ${targetX + 10} ${(52 + targetY) / 2}, ${targetX} ${targetY}`}
          fill="none"
          stroke="rgba(202,219,132,0.55)"
          strokeWidth="0.4"
          strokeDasharray="1.4 1.8"
          style={{ animation: "route 3s linear both" }}
        />
      </svg>

      <div key={`pulse-${keySeed}`} className="pointer-events-none absolute left-1/2 top-[52%] h-24 w-24 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 rounded-full border border-lime/30 animate-sonar" />
        <span className="absolute inset-0 rounded-full border border-lime/20 animate-sonar" style={{ animationDelay: "1.4s" }} />
      </div>

      <div className="absolute left-1/2 top-[52%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-lime/50 bg-ink">
          <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_18px_4px_rgba(202,219,132,0.45)]" />
        </div>
        <span className="mono-label mt-2 block text-[9px] text-cream/55">você</span>
      </div>

      {scene.signals.map((signal, index) => {
        const rawLeft = 50 + Math.sin(signal.angle) * signal.radius * 42;
        const rawTop = 51 - Math.cos(signal.angle) * signal.radius * 40;
        const left = Math.min(83, Math.max(17, rawLeft));
        const top = Math.min(84, Math.max(16, rawTop));
        return (
          <div
            key={`${signal.label}-${index}`}
            className="absolute z-10"
              style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)", animation: `rise 0.5s ease-out ${index * 80}ms both` }}
            >
            <span
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-ink/80 px-2 py-1 font-mono text-[9px] tracking-[0.06em] lowercase",
                KIND_STYLE[signal.kind],
              )}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <span className="h-1 w-1 rounded-full bg-current" />
              {signal.label}
            </span>
          </div>
        );
      })}

      <div className="absolute inset-x-0 top-3 flex justify-center">
        <span className="mono-label flex items-center gap-1.5 text-[9px] text-cream/45">
          <ArrowUp className="h-3 w-3 text-lime" /> frente
        </span>
      </div>

      <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[8px] uppercase tracking-[0.08em] text-cream/35">
        <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-lime" /> som</span>
        <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-coral" /> barreira</span>
        <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-cream" /> caminho</span>
      </div>
      <span className="absolute bottom-3 right-4 hidden font-mono text-[8px] uppercase tracking-[0.08em] text-cream/25 sm:block">
        tradução visual do áudio
      </span>
    </div>
  );
}

type ToggleProps = {
  active: boolean;
  onClick: () => void;
  label: string;
  onIcon: ReactNode;
  offIcon: ReactNode;
};

function MiniToggle({ active, onClick, label, onIcon, offIcon }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] transition-colors",
        active
          ? "border-cream/25 bg-cream/10 text-cream"
          : "border-cream/10 bg-transparent text-cream/40 hover:text-cream/70",
      )}
    >
      {active ? onIcon : offIcon}
      {label}
    </button>
  );
}

type GameProps = {
  phase: "idle" | "playing" | "finished";
  sceneIndex: number;
  autonomy: number;
  seconds: number;
  steps: number;
  helpCount: number;
  showMap: boolean;
  feedback: ToneFeedback | null;
  onAction: (action: ActionId) => void;
  onStart: () => void;
  onRestart: () => void;
  onToggleMap: () => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  soundOn: boolean;
  voiceOn: boolean;
};

export default function Demo() {
  const audio = useSensoryAudio();
  const [phase, setPhase] = useState<"idle" | "playing" | "finished">("idle");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [autonomy, setAutonomy] = useState(100);
  const [seconds, setSeconds] = useState(0);
  const [steps, setSteps] = useState(0);
  const [helpCount, setHelpCount] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [feedback, setFeedback] = useState<ToneFeedback | null>(null);
  const [mapSeed, setMapSeed] = useState(0);
  const spokenScene = useRef(-1);
  const voiceWasOn = useRef(audio.voiceOn);

  const scene = SCENES[sceneIndex];

  const start = useCallback(() => {
    audio.begin();
    setPhase("playing");
    setSceneIndex(0);
    setAutonomy(100);
    setSeconds(0);
    setSteps(0);
    setHelpCount(0);
    setScanned(false);
    setFeedback(null);
    setMapSeed((seed) => seed + 1);
    spokenScene.current = 0;
    audio.cue("safe");
    audio.vibrate([14, 50, 14]);
    audio.speak(`Sentido. ${SCENES[0].narration}`);
  }, [audio]);

  const restart = useCallback(() => {
    audio.begin();
    setPhase("playing");
    setSceneIndex(0);
    setAutonomy(100);
    setSeconds(0);
    setSteps(0);
    setHelpCount(0);
    setScanned(false);
    setFeedback(null);
    setMapSeed((seed) => seed + 1);
    spokenScene.current = 0;
    audio.cue("safe");
    audio.vibrate([14, 50, 14]);
    audio.speak(SCENES[0].narration);
  }, [audio]);

  const handleAction = useCallback(
    (action: ActionId) => {
      if (phase !== "playing") return;
      const result = resolveAction(sceneIndex, action, { scanned });

      if (action === "forward") setSteps((value) => value + 1);
      setAutonomy((value) => Math.max(0, Math.min(100, value + result.autonomy)));
      setSeconds((value) => value + result.seconds);
      setScanned(result.scanned);
      if (result.helped) setHelpCount((value) => value + 1);

      setFeedback({
        message: result.message,
        detail: result.detail,
        tone: result.tone,
        title: ACTION_META[action].label,
      });

      audio.cue(result.cue);
      if (result.tone === "warn") {
        audio.vibrate([45, 50, 45]);
      } else if (result.helped) {
        audio.vibrate([12, 45, 12, 45, 12]);
      } else {
        audio.vibrate(18);
      }

      if (result.finish) {
        setPhase("finished");
        window.setTimeout(() => audio.cue("arrive"), 420);
        window.setTimeout(() => {
          audio.speak(
            "Você chegou ao mercado. Quatro barreiras atravessadas. Em uma cidade inclusiva, o caminho não dependeria de sorte, de memória ou de um estranho gentil.",
          );
        }, 1600);
      } else if (result.advance) {
        const nextIndex = Math.min(SCENES.length - 1, sceneIndex + 1);
        setSceneIndex(nextIndex);
        setScanned(false);
        setMapSeed((seed) => seed + 1);
        spokenScene.current = nextIndex;
        audio.speak(`${result.message} ${SCENES[nextIndex].narration}`);
      } else {
        audio.speak(result.message);
      }
    },
    [audio, phase, sceneIndex, scanned],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    if (spokenScene.current === sceneIndex) return;
    spokenScene.current = sceneIndex;
    audio.speak(scene.narration);
  }, [audio, phase, scene.narration, sceneIndex]);

  useEffect(() => {
    if (audio.voiceOn && !voiceWasOn.current && phase === "playing") {
      audio.speak(scene.narration);
    }
    voiceWasOn.current = audio.voiceOn;
  }, [audio, audio.voiceOn, phase, scene.narration]);

  useEffect(() => {
    if (phase !== "playing") return;
    const keys: Record<string, ActionId> = {
      ArrowUp: "forward",
      w: "forward",
      W: "forward",
      ArrowLeft: "left",
      a: "left",
      A: "left",
      ArrowRight: "right",
      d: "right",
      D: "right",
      e: "interact",
      E: "interact",
      h: "help",
      H: "help",
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const action = keys[event.key];
      if (!action || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      handleAction(action);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleAction, phase]);

  const autonomyLabel = autonomy >= 82 ? "alta" : autonomy >= 60 ? "equilíbrio" : "apoio";
  const toneStyle: Record<Tone, string> = {
    good: "border-lime/40 bg-lime/[0.06]",
    warn: "border-coral/45 bg-coral/[0.07]",
    neutral: "border-cream/15 bg-cream/[0.03]",
  };

  const summary = useMemo(() => {
    if (helpCount === 0) {
      return "Você chegou sem pedir ajuda. Isso não deveria ser uma prova de resistência.";
    }
    return "Você chegou com ajuda. Numa cidade inclusiva, o apoio não seria a única forma de chegar.";
  }, [helpCount]);

  const game: GameProps = {
    phase,
    sceneIndex,
    autonomy,
    seconds,
    steps,
    helpCount,
    showMap,
    feedback,
    onAction: handleAction,
    onStart: start,
    onRestart: restart,
    onToggleMap: () => setShowMap((value) => !value),
    onToggleSound: audio.toggleSound,
    onToggleVoice: audio.toggleVoice,
    soundOn: audio.soundOn,
    voiceOn: audio.voiceOn,
  };

  return (
    <section id="demo" className="relative scroll-mt-16 overflow-hidden bg-ink py-20 text-cream md:scroll-mt-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(243,238,226,0.09)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-lime/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-coral/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {phase === "idle"
            ? "Protótipo sensorial pronto. Ative o áudio e inicie a travessia."
            : phase === "finished"
              ? "Demonstração concluída. Você chegou ao mercado depois de quatro barreiras."
              : `Cena ${scene.step}, ${scene.title}. Objetivo: ${scene.objective}`}
        </p>
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="mono-label text-coral">02 / protótipo jogável</span>
              <span className="h-px w-12 bg-coral/60" />
              <span className="mono-label text-cream/40">demo sensorial</span>
            </div>
            <h2 className="font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.9] tracking-[-0.02em]">
              Feche os olhos.
              <br />
              <span className="italic text-lime">O Recife continua.</span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pb-2">
            <p className="max-w-md text-[15px] leading-relaxed text-cream/60">
              Atravesse quatro barreiras reais do caminho até o mercado usando som, toque e pessoas na rua.
              A tela escurece de propósito: o mapa é para quem acompanha.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="mono-label flex items-center gap-1.5 rounded-full border border-cream/15 px-2.5 py-1.5 text-cream/60">
                <Headphones className="h-3 w-3" /> use fones
              </span>
              <span className="mono-label flex items-center gap-1.5 rounded-full border border-cream/15 px-2.5 py-1.5 text-cream/60">
                <Vibrate className="h-3 w-3" /> 5 botões
              </span>
              <span className="mono-label flex items-center gap-1.5 rounded-full border border-cream/15 px-2.5 py-1.5 text-cream/60">
                ~4 min
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-ink-line bg-[#080705]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-line px-3 py-2.5 sm:px-4">
                <div className="flex items-center gap-3">
                  <span className="mono-label flex items-center gap-1.5 text-cream/60">
                    <span className={cn("h-1.5 w-1.5 rounded-full bg-coral", phase === "playing" && "animate-blink")} />
                    {phase === "playing" ? "ao vivo" : phase === "finished" ? "chegada" : "pronto"}
                  </span>
                  <span className="mono-label hidden text-cream/30 sm:inline">rota 01 · aurora → encruzilhada</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={game.onToggleMap}
                    aria-pressed={showMap}
                    className="flex items-center gap-1.5 rounded-full border border-cream/12 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-cream/55 transition-colors hover:border-cream/30 hover:text-cream"
                  >
                    {showMap ? <Scan className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    mapa
                  </button>
                  <span className="mono-label rounded-full border border-cream/12 px-2.5 py-1 text-cream/40">tela preta</span>
                </div>
              </div>

              <div className="relative min-h-[420px] sm:min-h-[450px]">
                {phase === "playing" && (
                  <>
                    {showMap ? (
                      <SceneMap scene={scene} keySeed={mapSeed} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                        <span className="mb-4 h-2.5 w-2.5 rounded-full bg-cream/80 shadow-[0_0_30px_8px_rgba(243,238,226,0.18)]" />
                        <p className="font-display text-2xl italic text-cream/50">A tela é intencionalmente preta.</p>
                        <p className="mt-2 max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.04em] text-cream/30">
                          Escute a narração e use os cinco controles. Ative o mapa se quiser acompanhar visualmente.
                        </p>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 z-20 max-w-[72%]">
                      <span className="mono-label text-coral">{scene.step}</span>
                      <p className="mono-label mt-1 text-cream/45">{scene.place}</p>
                    </div>
                  </>
                )}

                {phase === "idle" && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[46%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2">
                      {[1, 0.78, 0.56, 0.34].map((scale, index) => (
                        <span
                          key={scale}
                          className="absolute inset-0 rounded-full border border-cream/[0.07]"
                          style={{ transform: `scale(${scale})` }}
                        >
                          {index === 0 && (
                            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/70" />
                          )}
                        </span>
                      ))}
                      <span className="absolute inset-0 rounded-full border border-lime/15 animate-sonar" />
                    </div>
                    <div className="relative z-10 flex h-full min-h-[420px] flex-col items-center justify-center px-5 py-6 text-center sm:min-h-[450px] sm:py-10">
                      <span className="mono-label mb-5 rounded-full border border-cream/15 px-3 py-1.5 text-cream/45">
                        demo 01 · áudio + toque
                      </span>
                      <h3 className="max-w-md font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.98] tracking-[-0.01em]">
                        A tela é preta.
                        <br />
                        <span className="italic text-cream/55">O caminho, não.</span>
                      </h3>
                      <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-cream/45">
                        Você acorda em casa e precisa chegar ao mercado. A cidade não foi projetada para você.
                        Quatro barreiras. Cinco botões. Nenhuma imagem.
                      </p>
                      <button
                        type="button"
                        onClick={game.onStart}
                        className="group mt-7 inline-flex items-center gap-3 rounded-full bg-coral px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-deep"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/20">
                          <Play className="h-3 w-3" />
                        </span>
                        Iniciar a travessia
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                      <p className="mono-label mt-4 text-[9px] text-cream/25">
                        som e voz ajustáveis no painel
                      </p>
                    </div>
                  </div>
                )}

                {phase === "finished" && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto px-4 py-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(202,219,132,0.15),transparent_65%)]" />
                    <div className="rise-in relative w-full max-w-md rounded-xl border border-cream/15 bg-ink-soft/95 p-5 text-center shadow-2xl backdrop-blur sm:p-7">
                      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-lime/40 bg-lime/10 text-lime">
                        <Spark className="h-5 w-5" />
                      </span>
                      <p className="mono-label mt-4 text-lime">destino alcançado</p>
                      <h3 className="mt-2 font-display text-4xl leading-none sm:text-5xl">Você chegou.</h3>
                      <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-cream/55">{summary}</p>
                      <dl className="mt-5 grid grid-cols-3 divide-x divide-cream/10 rounded-lg border border-cream/10 bg-cream/[0.03] py-3">
                        <div>
                          <dt className="mono-label text-[8px] text-cream/35">autonomia</dt>
                          <dd className="mt-1 font-display text-2xl">{autonomy}%</dd>
                        </div>
                        <div>
                          <dt className="mono-label text-[8px] text-cream/35">tempo</dt>
                          <dd className="mt-1 font-display text-2xl">{formatTime(seconds)}</dd>
                        </div>
                        <div>
                          <dt className="mono-label text-[8px] text-cream/35">ajudas</dt>
                          <dd className="mt-1 font-display text-2xl">{helpCount}</dd>
                        </div>
                      </dl>
                      <p className="mx-auto mt-4 max-w-sm font-display text-lg italic leading-snug text-cream/70">
                        “A cidade estava lá o tempo todo. O que faltava era projeto.”
                      </p>
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <button
                          type="button"
                          onClick={game.onRestart}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white"
                        >
                          <Play className="h-3 w-3" /> Jogar novamente
                        </button>
                        <a
                          href="#canvas"
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/20 px-4 py-2.5 text-sm text-cream/75 transition-colors hover:border-cream/50 hover:text-cream"
                        >
                          Ver o canvas <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {phase === "playing" && (
                  <div className="absolute inset-x-0 bottom-0 z-20">
                    {feedback && (
                      <div
                        className={cn(
                          "mx-3 mb-2 rounded-lg border px-3 py-2 backdrop-blur-sm sm:absolute sm:bottom-[70px] sm:right-3 sm:mx-0 sm:w-[270px]",
                          toneStyle[feedback.tone],
                          "bg-ink/85",
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          {feedback.tone === "warn" ? (
                            <Alert className="h-3 w-3 text-coral" />
                          ) : feedback.tone === "good" ? (
                            <Check className="h-3 w-3 text-lime" />
                          ) : (
                            <InfoDot />
                          )}
                          <span className="mono-label text-[8px] text-cream/55">{feedback.title}</span>
                        </div>
                        <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-cream/80">{feedback.message}</p>
                      </div>
                    )}
                    <div className="border-t border-cream/10 bg-ink/80 px-3 py-3 backdrop-blur sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 items-end gap-[2px]">
                          {WAVE.slice(0, 9).map((height, index) => (
                            <span
                              key={index}
                              className={cn("w-[2px] rounded-full bg-lime/70", game.soundOn && "sound-wave")}
                              style={{ height: `${Math.max(4, height / 1.6)}px`, animationDelay: `${index * 0.11}s` }}
                            />
                          ))}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mono-label text-[8px] text-cream/30">ouvindo agora</p>
                          <p className="truncate font-mono text-[10px] text-cream/65">{scene.audioHint}</p>
                        </div>
                        <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-cream/30 sm:block">
                          {scene.atmosphere}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-ink-line bg-ink-soft p-3 lg:hidden">
              <div className="mb-2 flex items-center justify-between">
                <span className="mono-label text-cream/40">cinco controles</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-cream/25">↑ ← → E H</span>
              </div>
              <ControlPad onAction={handleAction} disabled={phase !== "playing"} />
              <p className="mt-2.5 flex items-start gap-2 font-mono text-[9px] leading-relaxed tracking-[0.02em] text-cream/30">
                <Users className="mt-0.5 h-3 w-3 shrink-0 text-lime/70" />
                Ajuda é uma escolha legítima. Ninguém deveria precisar dela para atravessar a rua.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5">
                <p className="mono-label text-[8px] text-cream/35">autonomia</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className={cn("font-display text-2xl", autonomy < 60 ? "text-coral" : "text-lime")}>{autonomy}</span>
                  <span className="font-mono text-[9px] text-cream/40">/100</span>
                </div>
                <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-cream/10">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", autonomy < 60 ? "bg-coral" : "bg-lime")}
                    style={{ width: `${autonomy}%` }}
                  />
                </div>
              </div>
              <MiniStat label="situação" value={phase === "idle" ? "—" : autonomyLabel} />
              <MiniStat label="tempo em cena" value={formatTime(seconds)} />
              <MiniStat label="passos / ajudas" value={`${steps} / ${helpCount}`} />
            </div>
          </div>

          <aside className="flex flex-col rounded-2xl border border-ink-line bg-ink-soft p-4 sm:p-5 lg:col-span-5">
            <div className="flex items-center justify-between gap-2">
              <span className="mono-label text-cream/40">painel de bordo</span>
              <div className="flex gap-1.5">
                <MiniToggle
                  active={game.soundOn}
                  onClick={game.onToggleSound}
                  label="som"
                  onIcon={<Volume className="h-3 w-3" />}
                  offIcon={<VolumeOff className="h-3 w-3" />}
                />
                <MiniToggle
                  active={game.voiceOn}
                  onClick={game.onToggleVoice}
                  label="voz"
                  onIcon={<Voice className="h-3 w-3" />}
                  offIcon={<Voice className="h-3 w-3" />}
                />
              </div>
            </div>

            <div className="mt-4 flex-1">
              {phase === "idle" && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono-label text-coral">antes de começar</span>
                    <span className="h-px flex-1 bg-ink-line" />
                  </div>
                  <h3 className="mt-2 font-display text-[26px] leading-tight text-cream">Um jogo para jogar com os ouvidos.</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-cream/50">
                    A cada cena, escute as pistas e escolha um dos cinco controles. Não existe “game over”:
                    existe tempo, autonomia e a decisão de pedir ajuda.
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      ["01", "Escute a cena e a pista de áudio."],
                      ["02", "Toque o entorno antes de avançar."],
                      ["03", "Peça ajuda quando o caminho depender de outra pessoa."],
                    ].map(([number, text]) => (
                      <div key={number} className="flex items-start gap-3 border-t border-ink-line pt-2">
                        <span className="mono-label pt-0.5 text-coral">{number}</span>
                        <p className="text-[12px] leading-snug text-cream/65">{text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg border border-lime/20 bg-lime/[0.05] p-3">
                    <div className="flex items-start gap-2">
                      <Headphones className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
                      <p className="text-[11px] leading-relaxed text-cream/60">
                        O navegador só reproduz áudio após um toque. Inicie a demo para liberar som, narração e vibração.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {phase === "playing" && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono-label text-coral">{scene.step}</span>
                    <span className="h-px flex-1 bg-ink-line" />
                    <span className="mono-label text-cream/30">{scene.place}</span>
                  </div>
                  <h3 className="mt-2 font-display text-[27px] leading-tight text-cream">{scene.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-cream/55">{scene.narration}</p>
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-cream/10 bg-cream/[0.03] px-3 py-2.5">
                    <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
                    <div>
                      <p className="mono-label text-[8px] text-cream/35">objetivo</p>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-cream/75">{scene.objective}</p>
                    </div>
                  </div>
                  <div
                    className={cn("mt-2 rounded-lg border px-3 py-2.5", feedback ? toneStyle[feedback.tone] : "border-cream/10 bg-cream/[0.02]")}
                    aria-live="polite"
                  >
                    <p className="mono-label text-[8px] text-cream/35">
                      {feedback ? `resultado · ${feedback.title}` : "aguardando sua decisão"}
                    </p>
                    <p className="mt-1 text-[11.5px] leading-snug text-cream/75">
                      {feedback ? feedback.message : "Use o toque, o som e as pessoas. Não existe um único caminho certo."}
                    </p>
                    {feedback && <p className="mono-label mt-1.5 text-[8px] text-cream/30">{feedback.detail}</p>}
                    {feedback?.tone === "warn" && (
                      <button
                        type="button"
                        onClick={() => handleAction("interact")}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cream/20 bg-ink/40 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.06em] text-cream/70 transition-colors hover:border-lime/50 hover:text-lime"
                      >
                        <Scan className="h-3 w-3" /> escutar e tocar o entorno
                      </button>
                    )}
                  </div>
                </div>
              )}

              {phase === "finished" && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono-label text-lime">sessão concluída</span>
                    <span className="h-px flex-1 bg-ink-line" />
                  </div>
                  <h3 className="mt-2 font-display text-[27px] leading-tight text-cream">O que ficou no caminho?</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-cream/55">{summary}</p>
                  <div className="mt-3 space-y-2">
                    {SCENES.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-2.5 border-t border-ink-line pt-2">
                        <Check className="h-3 w-3 shrink-0 text-lime" />
                        <span className="mono-label min-w-0 flex-1 truncate text-[9px] text-cream/50">
                          {index + 1}. {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 rounded-lg border border-coral/25 bg-coral/[0.06] px-3 py-2.5 text-[11px] leading-relaxed text-cream/65">
                    O jogo termina. Na vida real, o trajeto se repete amanhã — com ou sem piso tátil.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 hidden lg:block">
              <div className="mb-2 flex items-center justify-between">
                <span className="mono-label text-cream/35">cinco controles</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-cream/25">
                  teclado ↑ ← → E H
                </span>
              </div>
              <ControlPad onAction={handleAction} disabled={phase !== "playing"} />
              <p className="mt-3 flex items-start gap-2 font-mono text-[9px] leading-relaxed tracking-[0.02em] text-cream/30">
                <Users className="mt-0.5 h-3 w-3 shrink-0 text-lime/70" />
                Pedir ajuda é uma escolha legítima. Numa cidade inclusiva, ninguém deveria precisar dela para atravessar a rua.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-ink-line pt-4 sm:flex-row sm:items-center">
          <p className="max-w-2xl font-mono text-[9px] leading-relaxed tracking-[0.03em] text-cream/30">
            Demonstração narrativa. O áudio é sintetizado no seu navegador e a vibração depende do dispositivo.
            A experiência não substitui relatos de pessoas cegas; é um convite para imaginá-los.
          </p>
          <a href="#barreiras" className="group flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.08em] text-cream/50 hover:text-cream">
            Entenda as barreiras
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5">
      <p className="mono-label text-[8px] text-cream/35">{label}</p>
      <p className="mt-1 truncate font-display text-2xl leading-none text-cream/85">{value}</p>
    </div>
  );
}

function ControlPad({ onAction, disabled }: { onAction: (action: ActionId) => void; disabled: boolean }) {
  return (
    <div role="group" aria-label="Controles do jogo" className="grid grid-cols-3 gap-1.5">
      <div />
      <ControlButton action="forward" onClick={onAction} disabled={disabled} primary />
      <div />
      <ControlButton action="left" onClick={onAction} disabled={disabled} />
      <ControlButton action="interact" onClick={onAction} disabled={disabled} light />
      <ControlButton action="right" onClick={onAction} disabled={disabled} />
      <div className="col-span-3">
        <ControlButton action="help" onClick={onAction} disabled={disabled} help />
      </div>
    </div>
  );
}

function ControlButton({
  action,
  onClick,
  disabled,
  primary,
  light,
  help,
}: {
  action: ActionId;
  onClick: (action: ActionId) => void;
  disabled: boolean;
  primary?: boolean;
  light?: boolean;
  help?: boolean;
}) {
  const meta = ACTION_META[action];
  const Icon = action === "forward" ? ArrowUp : action === "left" ? ArrowLeft : action === "right" ? ArrowRight : action === "interact" ? Scan : Users;

  return (
    <button
      type="button"
      onClick={() => onClick(action)}
      disabled={disabled}
      title={meta.hint}
      aria-label={`${meta.label} — ${meta.hint} (tecla ${meta.key})`}
      className={cn(
        "group relative flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-lg border px-1.5 py-2 transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35",
        primary && "border-coral bg-coral text-white hover:bg-coral-deep",
        light && "border-cream bg-cream text-ink hover:bg-white",
        help && "min-h-[44px] flex-row gap-2 border-lime/25 bg-lime/[0.06] text-lime hover:border-lime/50 hover:bg-lime hover:text-ink",
        !primary && !light && !help && "border-cream/15 bg-cream/[0.03] text-cream/80 hover:border-cream/35 hover:bg-cream/[0.07]",
      )}
    >
      <span className="flex items-center gap-1.5">
        <Icon className={cn(help ? "h-3.5 w-3.5" : "h-3 w-3", "opacity-80")} />
        <span className={cn("font-medium leading-none", help ? "text-[11px]" : "text-[10px] sm:text-[11px]")}>{meta.label}</span>
      </span>
      {!help && <span className="mono-label text-[7px] opacity-50">tecla {meta.key}</span>}
      {help && <span className="mono-label text-[7px] opacity-40">tecla {meta.key}</span>}
    </button>
  );
}

function InfoDot() {
  return <span className="flex h-3 w-3 items-center justify-center rounded-full border border-cream/40 font-mono text-[7px] text-cream/70">i</span>;
}
