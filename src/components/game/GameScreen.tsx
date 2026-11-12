import { useState } from "react";
import { ArrowRight, Check, Footprints, Hand, Headphones, Play, RotateCcw, Scan, Sparkles, TriangleAlert, X } from "lucide-react";
import { LEVELS } from "@/game/levels";
import type { Stats } from "@/game/engine";
import GameStage, { PhaseSketch } from "./GameStage";
import { cn } from "@/utils/cn";

type Props = {
  initialLevel: number;
  onExit: () => void;
};

type Result = { levelIndex: number; stats: Stats };

function formatTime(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export default function GameScreen({ initialLevel, onExit }: Props) {
  const [levelIndex, setLevelIndex] = useState(Math.max(0, Math.min(2, initialLevel)));
  const [results, setResults] = useState<Result[]>([]);
  const [runKey, setRunKey] = useState(0);
  const [finished, setFinished] = useState(false);

  const level = LEVELS[levelIndex];

  const handleComplete = (stats: Stats) => {
    const nextResults = [...results, { levelIndex, stats }];
    setResults(nextResults);
    if (levelIndex >= LEVELS.length - 1) {
      setFinished(true);
      window.scrollTo({ top: 0 });
    } else {
      setLevelIndex((value) => value + 1);
    }
  };

  const restart = () => {
    setRunKey((value) => value + 1);
  };

  const replay = () => {
    setResults([]);
    setFinished(false);
    setLevelIndex(0);
    setRunKey((value) => value + 1);
  };

  if (finished) {
    const totals = results.reduce(
      (acc, result) => ({
        time: acc.time + result.stats.time,
        steps: acc.steps + result.stats.steps,
        collisions: acc.collisions + result.stats.collisions,
        helps: acc.helps + result.stats.helps,
        detections: acc.detections + result.stats.detections,
        autonomy: acc.autonomy + result.stats.autonomy,
      }),
      { time: 0, steps: 0, collisions: 0, helps: 0, detections: 0, autonomy: 0 },
    );
    const averageAutonomy = results.length ? Math.round(totals.autonomy / results.length) : 100;
    const completedCount = results.length;

    return (
      <div className="relative min-h-[100dvh] overflow-hidden bg-black text-cream">
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(243,238,226,0.7)_0.6px,transparent_0.6px)] [background-size:5px_5px]" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[560px] w-[560px] rounded-full bg-lime/[0.05] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-20 h-[480px] w-[480px] rounded-full bg-coral/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-40 h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-cream/[0.06]" />
        <div className="pointer-events-none absolute left-1/2 top-40 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-lime/[0.09]" />

        <div className="relative mx-auto max-w-[1040px] px-5 py-8 sm:px-8 sm:py-12">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-lime/35">
                <span className="h-2.5 w-2.5 rounded-full bg-lime" />
              </span>
              <span className="font-display text-2xl leading-none">
                sentido<span className="text-coral">.</span>
              </span>
            </span>
            <button
              type="button"
              onClick={onExit}
              className="flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-cream/50 transition-colors hover:border-cream/40 hover:text-cream"
            >
              <X className="h-3 w-3" /> menu
            </button>
          </div>

          <div className="mt-14">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-lime">três travessias concluídas</p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(3rem,7.4vw,6.6rem)] leading-[0.86] tracking-[-0.025em]">
              Você atravessou o Recife
              <span className="block italic text-cream/55">no escuro.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[13.5px] leading-relaxed text-cream/55">
              Nenhuma das três chegadas aconteceu porque a cidade estava pronta. Aconteceram porque você lembrou do
              chão, escutou o trânsito e, em algum momento, aceitou uma mão.
            </p>
          </div>

          <div className="mt-10 grid gap-2 sm:grid-cols-3">
            {results.map((result) => {
              const phase = LEVELS[result.levelIndex];
              return (
                <div key={`${result.levelIndex}-${result.stats.time}`} className="overflow-hidden rounded-xl border border-cream/12 bg-cream/[0.025]">
                  <PhaseSketch level={phase} />
                  <div className="p-3.5">
                    <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-cream/35">fase 0{phase.number}</p>
                    <h2 className="mt-1 font-display text-[19px] leading-tight text-cream/85">{phase.name}</h2>
                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-cream/10 pt-2.5">
                      <div>
                        <p className="font-mono text-[6.5px] uppercase tracking-[0.06em] text-cream/30">tempo</p>
                        <p className="font-display text-lg leading-none text-cream/75">{formatTime(result.stats.time)}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[6.5px] uppercase tracking-[0.06em] text-cream/30">colisões</p>
                        <p className="font-display text-lg leading-none text-coral">{result.stats.collisions}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[6.5px] uppercase tracking-[0.06em] text-cream/30">ajudas</p>
                        <p className="font-display text-lg leading-none text-lime">{result.stats.helps}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["tempo total", formatTime(totals.time)],
              ["passos", String(totals.steps)],
              ["leitura tátil", String(totals.detections)],
              ["confiança média", `${averageAutonomy}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-cream/10 bg-cream/[0.025] px-3 py-2.5">
                <p className="font-mono text-[7px] uppercase tracking-[0.08em] text-cream/35">{label}</p>
                <p className="mt-1 font-display text-2xl leading-none text-cream/85">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border border-lime/20 bg-lime/[0.045] p-4 sm:p-5">
              <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-lime">
                <Sparkles className="h-3 w-3" /> a pergunta que fica
              </p>
              <p className="mt-2 font-display text-[25px] italic leading-[1.1] text-cream/80">
                “A cidade estava lá o tempo todo. O que faltava era projeto.”
              </p>
              <p className="mt-3 max-w-md text-[11.5px] leading-relaxed text-cream/45">
                {completedCount} fase{completedCount === 1 ? "" : "s"} concluída{completedCount === 1 ? "" : "s"}.
                Você colidiu {totals.collisions} vez{totals.collisions === 1 ? "" : "es"} e pediu ajuda{" "}
                {totals.helps} vez{totals.helps === 1 ? "" : "es"} — cada pedido também foi uma escolha.
              </p>
            </div>
            <div className="rounded-xl border border-cream/12 bg-cream/[0.025] p-4 sm:p-5">
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-cream/35">acesso à experiência</p>
              <ul className="mt-2 space-y-2">
                {[
                  "Narração e legendas em português em todas as fases.",
                  "Controles por teclado ou toque, com apenas 5 ações.",
                  "Mapa de apoio opcional, desligado por padrão.",
                  "Nenhuma informação depende só de cor, luz ou som.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-cream/55">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-lime" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={replay}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cream px-5 py-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-white"
            >
              <RotateCcw className="h-4 w-4" /> Recomeçar as três fases
            </button>
            <button
              type="button"
              onClick={onExit}
              className="flex items-center justify-center gap-2 rounded-full border border-cream/20 px-5 py-3.5 text-[12.5px] text-cream/70 transition-colors hover:border-cream/45 hover:text-cream"
            >
              Voltar ao menu <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-cream/10 pt-4 sm:flex-row sm:items-center">
            <p className="font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.06em] text-cream/25">
              sentido · recife em jogo 2026 · uma cidade para ser sentida
            </p>
            <div className="flex items-center gap-3 text-cream/25">
              <Footprints className="h-3 w-3" />
              <Scan className="h-3 w-3" />
              <Hand className="h-3 w-3" />
              <Headphones className="h-3 w-3" />
              <TriangleAlert className="h-3 w-3" />
              <Headphones className="h-3 w-3" />
              <Play className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-black")}>
      <GameStage
        key={`${level.id}-${runKey}`}
        level={level}
        index={levelIndex}
        onComplete={handleComplete}
        onNext={() => {
          const next = Math.min(LEVELS.length - 1, levelIndex + 1);
          setLevelIndex(next);
          setRunKey((value) => value + 1);
        }}
        onRestart={restart}
        onExit={onExit}
      />
    </div>
  );
}
