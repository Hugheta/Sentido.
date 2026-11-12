import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  EyeOff,
  Hand,
  Headphones,
  Map as MapIcon,
  Pause,
  RotateCcw,
  RotateCw,
  Scan,
  Sparkles,
  TriangleAlert,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { GameAudio } from "@/game/audio";
import { GameEngine, type Action, type GameEvent, type Stats } from "@/game/engine";
import { isWall, type Level, tileAt } from "@/game/levels";

const EMPTY_STATS: Stats = {
  autonomy: 100,
  time: 0,
  steps: 0,
  collisions: 0,
  helps: 0,
  detections: 0,
  nearby: false,
  assisted: false,
  signalSafe: null,
};

type PunishState = {
  title: string;
  detail: string;
  consequence: string;
  loss: number;
  time: number;
  autonomy: number;
} | null;

type Props = {
  level: Level;
  index: number;
  onComplete: (stats: Stats) => void;
  onNext: () => void;
  onRestart: () => void;
  onExit: () => void;
};

function formatTime(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function CompanionMap({ level }: { level: Level }) {
  const cell = 12;
  const width = level.grid[0].length;
  const height = level.grid.length;
  const floors = new Set(["s", "t", "a", "p", "w", "r", "c", "g", "i"]);
  return (
    <div className="overflow-auto rounded-lg border border-cream/10 bg-[#0a0907] p-2">
      <svg
        viewBox={`0 0 ${width * cell} ${height * cell}`}
        className="h-auto w-full min-w-[240px]"
        role="img"
        aria-label={`Mapa de apoio da fase ${level.name}. Piso tátil em verde, riscos em vermelho, destino em branco.`}
      >
        <rect width={width * cell} height={height * cell} fill="#070604" />
        {level.grid.map((row, y) =>
          row.map((tile, x) => {
            if (!floors.has(tile)) return null;
            const fill =
              tile === "t" || tile === "i"
                ? "#73804a"
                : tile === "a"
                  ? "#c3a15e"
                  : tile === "p"
                    ? "#b34a36"
                    : tile === "w"
                      ? "#5e8592"
                      : tile === "r"
                        ? "#232120"
                        : tile === "c"
                          ? "#8d877a"
                          : tile === "g"
                            ? "#e8e1d1"
                            : "#3a352d";
            return (
              <rect
                key={`${x}-${y}`}
                x={x * cell + 0.6}
                y={y * cell + 0.6}
                width={cell - 1.2}
                height={cell - 1.2}
                rx={tile === "g" ? 3 : 1}
                fill={fill}
                opacity={tile === "s" ? 0.65 : 1}
              />
            );
          }),
        )}
        {level.people.map((person) => (
          <circle
            key={person.name}
            cx={person.x * cell + cell / 2}
            cy={person.y * cell + cell / 2}
            r={3}
            fill="#cadb84"
            opacity={0.9}
          />
        ))}
        <circle
          cx={level.goal.x * cell + cell / 2}
          cy={level.goal.y * cell + cell / 2}
          r={5.5}
          fill="none"
          stroke="#0c0b09"
          strokeWidth={2}
        />
        <circle
          cx={level.start.x * cell + cell / 2}
          cy={level.start.y * cell + cell / 2}
          r={4}
          fill="#e2553b"
          stroke="#0c0b09"
          strokeWidth={1.5}
        />
      </svg>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[7px] uppercase tracking-[0.06em] text-cream/40">
        <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-sm bg-[#73804a]" /> piso tátil</span>
        <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-sm bg-[#b34a36]" /> risco</span>
        <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#e2553b]" /> início</span>
        <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#e8e1d1]" /> destino</span>
      </div>
    </div>
  );
}

export function PhaseSketch({ level }: { level: Level }) {
  const path = useMemo(() => {
    const points: Array<[number, number]> = [];
    const stepX = Math.sign(level.goal.x - level.start.x);
    const stepY = Math.sign(level.goal.y - level.start.y);
    let x = level.start.x;
    let y = level.start.y;
    points.push([x, y]);
    let guard = 0;
    while ((x !== level.goal.x || y !== level.goal.y) && guard < 80) {
      guard += 1;
      const canX = x !== level.goal.x && !isWall(tileAt(level, x + stepX, y));
      const canY = y !== level.goal.y && !isWall(tileAt(level, x, y + stepY));
      if (canX) x += stepX;
      else if (canY) y += stepY;
      else break;
      points.push([x, y]);
    }
    return points.map(([px, py], index) => `${index === 0 ? "M" : "L"} ${px} ${py}`).join(" ");
  }, [level]);

  return (
    <svg viewBox={`0 0 ${level.grid[0].length} ${level.grid.length}`} className="h-24 w-full" aria-hidden>
      <rect width="100%" height="100%" fill="var(--color-ink)" />
      {level.grid.map((row, y) =>
        row.map((tile, x) => {
          if (isWall(tile) && tile !== "x") return null;
          const fill =
            tile === "t" || tile === "i"
              ? "#cadb84"
              : tile === "a"
                ? "#d8a15b"
                : tile === "x" || tile === "p" || tile === "w"
                  ? "#e2553b"
                  : tile === "g"
                    ? "#f3eee2"
                    : tile === "r" || tile === "c"
                      ? "#4a453c"
                      : "rgba(243,238,226,0.14)";
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        }),
      )}
      <path d={path} fill="none" stroke="#e2553b" strokeWidth={0.32} strokeDasharray="0.8 0.7" />
      <circle cx={level.goal.x + 0.5} cy={level.goal.y + 0.5} r={0.9} fill="#f3eee2" />
      <circle cx={level.start.x + 0.5} cy={level.start.y + 0.5} r={0.8} fill="#e2553b" stroke="#0c0b09" strokeWidth={0.2} />
    </svg>
  );
}

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-cream/20 bg-cream/[0.06] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.04em] text-cream/60">
      {children}
    </kbd>
  );
}

export default function GameStage({ level, index, onComplete, onNext, onRestart, onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const audioRef = useRef<GameAudio | null>(null);
  const emitRef = useRef<(event: GameEvent) => void>(() => {});

  const [started, setStarted] = useState(false);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [caption, setCaption] = useState<{ text: string; id: number } | null>(null);
  const [punish, setPunish] = useState<PunishState>(null);
  const [complete, setComplete] = useState<Stats | null>(null);
  const [paused, setPaused] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  const handleEvent = useCallback((event: GameEvent) => {
    switch (event.type) {
      case "caption":
        setCaption({ text: event.text, id: Date.now() + Math.random() });
        break;
      case "stats":
        setStats(event.stats);
        break;
      case "punish":
        setPunish({
          title: event.title,
          detail: event.detail,
          consequence: event.consequence,
          loss: event.loss,
          time: event.time,
          autonomy: event.autonomy,
        });
        break;
      case "complete":
        setComplete(event.stats);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    emitRef.current = handleEvent;
  }, [handleEvent]);

  useEffect(() => {
    const audio = new GameAudio();
    audioRef.current = audio;
    const engine = new GameEngine(level, audio, (event) => emitRef.current(event));
    engineRef.current = engine;
    setStats(engine.stats());

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    let raf = 0;
    let last = performance.now();
    let width = 1;
    let height = 1;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (canvas && observer) observer.observe(canvas);

    const loop = (now: number) => {
      const dt = Math.min(0.06, (now - last) / 1000);
      last = now;
      engine.update(dt);
      if (ctx) engine.render(ctx, width, height);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer?.disconnect();
      engine.destroy();
      audio.destroy();
      engineRef.current = null;
      audioRef.current = null;
    };
  }, [level]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleAction = useCallback(
    (action: Action) => {
      const engine = engineRef.current;
      const audio = audioRef.current;
      if (!engine || !audio) return;
      if (!started) return;
      audio.init();
      engine.input(action);
    },
    [started],
  );

  useEffect(() => {
    if (!started) return;
    const keyMap: Record<string, Action> = {
      ArrowUp: "forward",
      w: "forward",
      W: "forward",
      ArrowLeft: "left",
      a: "left",
      A: "left",
      ArrowRight: "right",
      d: "right",
      D: "right",
      " ": "cane",
      e: "cane",
      E: "cane",
      h: "help",
      H: "help",
      Enter: "help",
    };
    const handler = (event: KeyboardEvent) => {
      if (paused || punish || complete || event.metaKey || event.ctrlKey || event.altKey) return;
      const action = keyMap[event.key];
      if (!action) return;
      event.preventDefault();
      handleAction(action);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [complete, handleAction, paused, punish, started]);

  const startLevel = () => {
    const audio = audioRef.current;
    const engine = engineRef.current;
    if (!audio || !engine) return;
    audio.init();
    audio.setSound(soundOn);
    audio.setVoice(voiceOn);
    engine.start();
    setStarted(true);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    audioRef.current?.setSound(next);
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    audioRef.current?.setVoice(next);
  };

  const openPause = () => {
    if (!engineRef.current) return;
    engineRef.current.paused = true;
    audioRef.current?.stopSpeech();
    setPaused(true);
  };

  const resume = () => {
    if (!engineRef.current) return;
    engineRef.current.paused = false;
    setPaused(false);
  };

  const continueAfterPunishment = () => {
    engineRef.current?.resumeAfterPunishment();
    setPunish(null);
  };

  const signal = level.signal;
  const nearby = stats.nearby;

  return (
    <div className="relative h-[100dvh] w-full select-none overflow-hidden bg-black text-cream" style={{ "--stage-accent": level.accent } as React.CSSProperties}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(243,238,226,0.7)_0.5px,transparent_0.5px)] [background-size:4px_4px] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* HUD superior */}
      <header className="absolute inset-x-0 top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="mx-auto flex w-full max-w-[1320px] items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <button
              type="button"
              onClick={onExit}
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 bg-black/40 text-cream/60 backdrop-blur transition-colors hover:border-cream/40 hover:text-cream"
              aria-label="Sair da fase e voltar ao menu"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[8px] uppercase tracking-[0.12em] text-cream/45">
                <span className="text-[var(--stage-accent)]">fase 0{level.number} / 03</span>
                <span className="h-2.5 w-px bg-cream/15" />
                <span className="truncate">{level.place}</span>
                {signal && (
                  <>
                    <span className="h-2.5 w-px bg-cream/15" />
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5",
                        stats.signalSafe
                          ? "border-lime/40 bg-lime/10 text-lime"
                          : "border-coral/40 bg-coral/10 text-coral",
                      )}
                    >
                      <i className={cn("h-1 w-1 rounded-full bg-current", !stats.signalSafe && "animate-pulse")} />
                      {stats.assisted
                        ? "com apoio"
                        : stats.signalSafe
                          ? "janela de silêncio"
                          : "tráfego intenso"}
                    </span>
                  </>
                )}
              </div>
              <h1 className="mt-1 truncate font-display text-[19px] leading-none text-cream/90 sm:text-[24px]">
                {level.name}
              </h1>
              <p className="mt-1 max-w-[62vw] truncate font-mono text-[7.5px] uppercase tracking-[0.06em] text-cream/35 sm:max-w-md sm:text-[8px]">
                obj · {level.objective}
              </p>
              <div className="mt-1.5 flex items-center gap-2 sm:hidden">
                <span className="font-mono text-[7px] uppercase tracking-[0.06em] text-cream/35">{formatTime(stats.time)}</span>
                <span className="h-1 w-12 overflow-hidden rounded-full bg-cream/15">
                  <span
                    className={cn("block h-full rounded-full", stats.autonomy < 55 ? "bg-coral" : "bg-lime")}
                    style={{ width: `${stats.autonomy}%` }}
                  />
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.06em] text-cream/35">{stats.autonomy} conf.</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-2.5 rounded-lg border border-cream/10 bg-black/35 px-3 py-1.5 backdrop-blur sm:flex">
              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-cream/35">tempo</p>
                <p className="font-mono text-[12px] leading-tight text-cream/80">{formatTime(stats.time)}</p>
              </div>
              <span className="h-6 w-px bg-cream/10" />
              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-cream/35">confiança</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="h-1 w-14 overflow-hidden rounded-full bg-cream/15">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", stats.autonomy < 55 ? "bg-coral" : "bg-lime")}
                      style={{ width: `${stats.autonomy}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-cream/60">{stats.autonomy}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Desligar som" : "Ligar som"}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-cream/15 bg-black/40 text-cream/55 backdrop-blur transition-colors hover:text-cream sm:flex"
            >
              {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={openPause}
              aria-label="Abrir pausa"
              className="flex h-9 items-center gap-1.5 rounded-full border border-cream/15 bg-black/40 px-3 text-cream/65 backdrop-blur transition-colors hover:border-cream/40 hover:text-cream"
            >
              <Pause className="h-3.5 w-3.5" />
              <span className="font-mono text-[8px] uppercase tracking-[0.08em]">pausa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Leitura sensorial / legenda */}
      {started && !complete && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[172px] z-20 px-3 sm:bottom-[150px] sm:px-6">
          <div
            key={caption?.id ?? "initial"}
            className="rise-in mx-auto flex w-full max-w-[720px] items-start gap-2.5 rounded-xl border border-cream/12 bg-black/70 px-3.5 py-2.5 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-3"
            aria-live="polite"
            aria-atomic="true"
          >
            <Scan className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--stage-accent)]" />
            <div className="min-w-0">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-cream/35">leitura sensorial</p>
              <p className="mt-1 line-clamp-3 text-[11.5px] leading-relaxed text-cream/85 sm:text-[12.5px]">
                {caption?.text ?? "Toque a bengala para ler o entorno."}
              </p>
            </div>
            {stats.detections === 0 && (
              <span className="ml-auto hidden shrink-0 items-center gap-1 self-center rounded-full border border-cream/15 px-2 py-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-cream/50 sm:flex">
                espaço <span aria-hidden>·</span> bengala
              </span>
            )}
          </div>
        </div>
      )}

      {/* Controles */}
      {started && !complete && (
        <div className="absolute inset-x-0 bottom-0 z-30 px-2 pb-[max(10px,env(safe-area-inset-bottom))] sm:px-5 sm:pb-4">
          <div className="mx-auto w-full max-w-[760px]">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-cream/30">
                cinco botões · nenhuma imagem
              </span>
              <div className="flex items-center gap-2 font-mono text-[7.5px] uppercase tracking-[0.06em] text-cream/30">
                <span className="flex items-center gap-1">
                  <Users className={cn("h-2.5 w-2.5", nearby && "text-lime")} /> {stats.helps} ajuda{stats.helps === 1 ? "" : "s"}
                </span>
                <span className="h-2.5 w-px bg-cream/15" />
                <span>{stats.collisions} colisõe{stats.collisions === 1 ? "" : "s"}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2" role="group" aria-label="Cinco controles do jogo">
              <ControlButton
                label="Girar ←"
                hint="A"
                icon={<RotateCcw className="h-4 w-4" />}
                onClick={() => handleAction("left")}
              />
              <ControlButton
                label="Avançar"
                hint="W"
                icon={<ArrowUp className="h-4 w-4" />}
                onClick={() => handleAction("forward")}
                tone="lime"
                big
              />
              <ControlButton
                label="Girar →"
                hint="D"
                icon={<RotateCw className="h-4 w-4" />}
                onClick={() => handleAction("right")}
              />
              <ControlButton
                label="Bengala"
                hint="espaço"
                icon={<Scan className="h-4 w-4" />}
                onClick={() => handleAction("cane")}
                tone="cream"
              />
              <ControlButton
                label="Pedir ajuda"
                hint="H"
                icon={<Hand className="h-4 w-4" />}
                onClick={() => handleAction("help")}
                tone="outline"
                highlight={nearby}
                wide
              />
            </div>
          </div>
        </div>
      )}

      {/* Briefing inicial */}
      {!started && (
        <div className="absolute inset-0 z-40 overflow-y-auto bg-black">
          <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:radial-gradient(rgba(243,238,226,0.7)_0.6px,transparent_0.6px)] [background-size:5px_5px]" />
          <div className="absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/[0.06]" />
          <div className="absolute left-1/2 top-[42%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/[0.08]" />
          <div className="absolute left-1/2 top-[42%] h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--stage-accent)]/20" />

          <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[980px] flex-col justify-center px-5 py-10 sm:px-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/35">
                fase 0{level.number} <span className="text-cream/15">/</span> 03
              </span>
              <button
                type="button"
                onClick={onExit}
                className="flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-cream/50 transition-colors hover:border-cream/40 hover:text-cream"
              >
                <X className="h-3 w-3" /> menu
              </button>
            </div>

            <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--stage-accent)]">
                  {level.place} · {level.subtitle}
                </p>
                <h2 className="stage-title mt-3 text-[clamp(2.45rem,6.4vw,4.9rem)]">
                  {level.name}
                </h2>
                <p className="mt-5 max-w-lg text-[13.5px] leading-relaxed text-cream/55">{level.brief}</p>
                <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-cream/10 bg-cream/[0.03] px-3 py-2.5">
                  <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--stage-accent)]" />
                  <p className="text-[11.5px] leading-relaxed text-cream/60">
                    <strong className="font-medium text-cream/85">A tela ficará completamente preta.</strong> Nada do
                    cenário aparece antes de a bengala tocar. O que você vê são ecos do toque, não o mundo.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-cream/12 bg-ink-soft/80 p-4 backdrop-blur">
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-cream/35">cinco controles</p>
                <div className="mt-3 space-y-2">
                  {[
                    ["W / ↑", "Avançar um passo"],
                    ["A / ←", "Girar à esquerda"],
                    ["D / →", "Girar à direita"],
                    ["espaço", "Bater a bengala e revelar"],
                    ["H", "Pedir ajuda a alguém"],
                  ].map(([key, description]) => (
                    <div key={key} className="flex items-center justify-between gap-3 border-b border-cream/8 pb-2 last:border-0 last:pb-0">
                      <KeyBadge>{key}</KeyBadge>
                      <span className="text-right text-[11px] text-cream/60">{description}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleSound}
                    aria-pressed={soundOn}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-2 font-mono text-[8px] uppercase tracking-[0.06em]",
                      soundOn ? "border-cream/25 bg-cream/10 text-cream/80" : "border-cream/10 text-cream/35",
                    )}
                  >
                    {soundOn ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />} som
                  </button>
                  <button
                    type="button"
                    onClick={toggleVoice}
                    aria-pressed={voiceOn}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-2 font-mono text-[8px] uppercase tracking-[0.06em]",
                      voiceOn ? "border-cream/25 bg-cream/10 text-cream/80" : "border-cream/10 text-cream/35",
                    )}
                  >
                    {voiceOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />} voz
                  </button>
                </div>
                <button
                  type="button"
                  onClick={startLevel}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--stage-accent)] px-4 py-3.5 text-[13px] font-semibold text-ink transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Headphones className="h-4 w-4" /> Começar a fase
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-2.5 text-center font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.06em] text-cream/30">
                  aproxime o volume · de preferência, use fones
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-cream/30">
              <span className="font-mono text-[8px] uppercase tracking-[0.08em]">fase {index + 1} de 3</span>
              <span className="h-2.5 w-px bg-cream/15" />
              <span className="font-mono text-[8px] uppercase tracking-[0.08em]">sem game over</span>
              <span className="h-2.5 w-px bg-cream/15" />
              <span className="font-mono text-[8px] uppercase tracking-[0.08em]">erros custam confiança e tempo</span>
              <span className="ml-auto hidden font-display text-sm italic text-cream/30 sm:block">{level.objective}</span>
            </div>
          </div>
        </div>
      )}

      {/* Punição */}
      {punish && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 px-3 pb-3 backdrop-blur-sm sm:items-center sm:px-6 sm:pb-0">
          <div className="rise-in w-full max-w-lg overflow-hidden rounded-xl border border-coral/40 bg-[#0d0b09] shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between gap-3 border-b border-coral/25 bg-coral/[0.08] px-4 py-3">
              <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-coral">
                <TriangleAlert className="h-3.5 w-3.5" /> decisão errada
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.06em] text-cream/35">sem game over</span>
            </div>
            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <h3 className="font-display text-[27px] leading-none text-cream sm:text-3xl">{punish.title}</h3>
              <p className="mt-2.5 text-[12px] leading-relaxed text-cream/60">{punish.detail}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-cream/10 bg-cream/[0.03] px-3 py-2">
                  <p className="font-mono text-[7px] uppercase tracking-[0.08em] text-cream/35">confiança</p>
                  <p className="font-display text-2xl leading-none text-coral">−{punish.loss}</p>
                </div>
                <div className="rounded-lg border border-cream/10 bg-cream/[0.03] px-3 py-2">
                  <p className="font-mono text-[7px] uppercase tracking-[0.08em] text-cream/35">tempo perdido</p>
                  <p className="font-display text-2xl leading-none text-cream/85">+{punish.time}s</p>
                </div>
              </div>
              <p className="mt-3 border-l-2 border-coral/50 pl-2.5 text-[11px] leading-relaxed text-cream/45">
                {punish.consequence}
              </p>
              <button
                type="button"
                onClick={continueAfterPunishment}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-cream px-4 py-3 text-[12.5px] font-medium text-ink transition-colors hover:bg-white"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Voltar ao último ponto seguro
              </button>
              <p className="mt-2 text-center font-mono text-[7.5px] uppercase tracking-[0.07em] text-cream/25">
                confiança atual · {punish.autonomy}/100
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pausa */}
      {paused && !punish && !complete && (
        <div className="absolute inset-0 z-50 overflow-y-auto bg-black/85 px-3 py-6 backdrop-blur-sm sm:px-6">
          <div className="mx-auto my-auto w-full max-w-xl pt-10 sm:pt-16">
            <div className="rounded-xl border border-cream/15 bg-[#0b0a08] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-cream/35">pausa</span>
                <button
                  type="button"
                  onClick={resume}
                  aria-label="Continuar jogando"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/15 text-cream/60 hover:text-cream"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <h3 className="mt-3 font-display text-3xl leading-none">Respire. O caminho espera.</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-cream/45">
                A tela continua preta. Use a pausa para ajustar o som, reler o objetivo ou consultar o mapa de apoio.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={resume}
                  className="col-span-2 rounded-full bg-cream px-4 py-3 text-[12.5px] font-medium text-ink hover:bg-white"
                >
                  Continuar a fase
                </button>
                <button
                  type="button"
                  onClick={toggleSound}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-cream/15 px-3 py-2.5 text-[11px] text-cream/70 hover:border-cream/35"
                >
                  {soundOn ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />} {soundOn ? "Som ligado" : "Som desligado"}
                </button>
                <button
                  type="button"
                  onClick={toggleVoice}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-cream/15 px-3 py-2.5 text-[11px] text-cream/70 hover:border-cream/35"
                >
                  {voiceOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />} {voiceOn ? "Voz ligada" : "Voz desligada"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMap((value) => !value)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-[11px]",
                    showMap ? "border-lime/40 bg-lime/10 text-lime" : "border-cream/15 text-cream/70 hover:border-cream/35",
                  )}
                  aria-pressed={showMap}
                >
                  <MapIcon className="h-3 w-3" /> Mapa de apoio
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-cream/15 px-3 py-2.5 text-[11px] text-cream/70 hover:border-cream/35"
                >
                  <RotateCcw className="h-3 w-3" /> Recomeçar fase
                </button>
              </div>

              {showMap && (
                <div className="mt-3">
                  <CompanionMap level={level} />
                  <p className="mt-2 text-[10px] leading-relaxed text-cream/35">
                    Recurso opcional para acompanhantes, professores e transmissões. A pessoa que joga pode mantê-lo
                    fechado: a experiência original é só tato e som.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={onExit}
                className="mt-4 w-full border-t border-cream/10 pt-3 text-center font-mono text-[8px] uppercase tracking-[0.08em] text-cream/35 hover:text-cream/70"
              >
                Sair para o menu principal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fim da fase */}
      {complete && (
        <div className="absolute inset-0 z-50 overflow-y-auto bg-black/90 px-3 py-6 backdrop-blur-sm sm:px-6">
          <div className="mx-auto w-full max-w-2xl pt-4 sm:pt-10">
            <div className="overflow-hidden rounded-xl border border-cream/15 bg-[#0b0a08]">
              <div className="flex items-center justify-between border-b border-cream/10 px-4 py-3 sm:px-5">
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--stage-accent)]">
                  fase 0{level.number} concluída
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-cream/30">
                  <Sparkles className="h-3 w-3 text-[var(--stage-accent)]" /> {level.place}
                </span>
              </div>
              <div className="px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--stage-accent)]/40 bg-[var(--stage-accent)]/10 text-[var(--stage-accent)]">
                    <Check className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[34px] leading-[0.92] sm:text-[42px]">Você chegou.</h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-cream/55">{level.outro}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    ["tempo", formatTime(complete.time)],
                    ["passos", String(complete.steps)],
                    ["colisões", String(complete.collisions)],
                    ["ajudas", String(complete.helps)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-cream/10 bg-cream/[0.03] px-3 py-2.5">
                      <p className="font-mono text-[7px] uppercase tracking-[0.09em] text-cream/35">{label}</p>
                      <p className="mt-1 font-display text-2xl leading-none text-cream/90">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-cream/10 bg-cream/[0.02] px-3.5 py-3">
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-cream/35">o que ficou no caminho</p>
                  <ul className="mt-2 space-y-1.5">
                    {level.lessons.map((lesson) => (
                      <li key={lesson} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-cream/55">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--stage-accent)]" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      onComplete(complete);
                      if (index < 2) onNext();
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cream px-4 py-3 text-[12.5px] font-medium text-ink hover:bg-white"
                  >
                    {index === 2 ? "Ver resultado final" : "Próxima travessia"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onRestart}
                    className="flex items-center justify-center gap-2 rounded-full border border-cream/20 px-4 py-3 text-[12px] text-cream/65 hover:border-cream/45 hover:text-cream"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Repetir fase
                  </button>
                </div>
                <p className="mt-3 text-center font-mono text-[7.5px] uppercase tracking-[0.06em] text-cream/25">
                  a cidade não muda porque você chegou · mas a pergunta fica
                </p>
              </div>
            </div>

            <div className="mt-3">
              <PhaseSketch level={level} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  label,
  hint,
  icon,
  onClick,
  tone = "dark",
  big,
  highlight,
  wide,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClick: () => void;
  tone?: "dark" | "lime" | "cream" | "outline";
  big?: boolean;
  highlight?: boolean;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} (${hint})`}
      className={cn(
        "group relative flex min-h-[58px] touch-manipulation flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2 transition-all active:scale-[0.97] sm:min-h-[68px]",
        wide && "col-span-2 sm:col-span-1",
        tone === "dark" && "border-cream/15 bg-cream/[0.045] text-cream/75 hover:border-cream/35 hover:bg-cream/[0.09]",
        tone === "lime" && "border-[var(--stage-accent)] bg-[var(--stage-accent)] text-ink hover:brightness-105",
        tone === "cream" && "border-cream bg-cream text-ink hover:bg-white",
        tone === "outline" && "border-[var(--stage-accent)]/40 bg-[var(--stage-accent)]/[0.07] text-[var(--stage-accent)] hover:bg-[var(--stage-accent)]/15",
        highlight && "ring-2 ring-[var(--stage-accent)]/50 ring-offset-2 ring-offset-black",
      )}
    >
      <span className={cn("flex items-center gap-1.5", big && "flex-col gap-0.5 sm:flex-row")}>{icon}</span>
      <span className="text-[10px] font-medium leading-none sm:text-[11px]">{label}</span>
      <span
        className={cn(
          "hidden font-mono text-[7px] uppercase tracking-[0.04em] sm:block",
          tone === "lime" || tone === "cream" ? "text-ink/45" : "text-cream/30",
        )}
      >
        {hint}
      </span>
      {highlight && (
        <span className="absolute -top-2 right-1 rounded-full bg-[var(--stage-accent)] px-1.5 py-0.5 font-mono text-[6px] uppercase tracking-[0.04em] text-ink shadow-sm sm:-top-1.5 sm:right-2 sm:text-[6.5px]">
          perto
        </span>
      )}
    </button>
  );
}
