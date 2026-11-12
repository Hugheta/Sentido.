import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  EyeOff,
  Hand,
  Headphones,
  MapPin,
  Menu,
  MoveLeft,
  MoveRight,
  MoveUp,
  Play,
  Quote,
  Scan,
  Sparkles,
  TriangleAlert,
  Users,
  Vibrate,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { LEVELS } from "@/game/levels";

type Props = { onStart: (levelIndex: number) => void };

const NAV = [
  ["O jogo", "#jogo"],
  ["Fases", "#fases"],
  ["Como jogar", "#como-jogar"],
  ["Acesso", "#acesso"],
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ink/70">
        <span className="absolute h-6 w-6 rounded-full border border-ink/25" />
        <span className="h-2 w-2 rounded-full bg-ink" />
        <span className="absolute -right-[3px] -top-[3px] h-2 w-2 rounded-full bg-coral" />
      </span>
      <span className="flex flex-col">
        <span className="font-display text-[27px] leading-[0.78] tracking-[-0.01em]">
          sentido<span className="text-coral">.</span>
        </span>
        <span className="mono-label mt-1 text-[6.5px] leading-none text-muted/80">recife em jogo</span>
      </span>
    </span>
  );
}

export function SiteHeader({ onStart }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 md:h-[72px] md:px-8">
        <a href="#topo" aria-label="Sentido — início">
          <Logo />
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {NAV.map(([label, href], index) => (
            <a key={href} href={href} className="group flex items-baseline gap-1.5 text-[13px] text-ink/70 transition-colors hover:text-ink">
              <span className="font-mono text-[8px] text-coral/80">0{index + 1}</span>
              <span className="relative">
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-coral transition-all duration-300 group-hover:w-full" />
              </span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onStart(0)}
            className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[12.5px] font-medium text-cream transition-colors hover:bg-coral sm:inline-flex"
          >
            <Play className="h-2.5 w-2.5" /> Jogar agora
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div
        className={cn(
          "grid overflow-hidden border-ink/10 transition-[grid-template-rows] duration-300 lg:hidden",
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]",
        )}
        inert={!open}
      >
        <div className="min-h-0">
          <nav className="mx-auto max-w-[1240px] px-5 py-4" aria-label="Navegação móvel">
            {NAV.map(([label, href], index) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-ink/10 py-3 text-sm text-ink/80 last:border-0"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[9px] text-coral">0{index + 1}</span>
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-ink/35" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => onStart(0)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm text-cream"
            >
              <Play className="h-3 w-3" /> Jogar agora
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function PhaseArt({ variant, accent }: { variant: 1 | 2 | 3; accent: string }) {
  const grainId = `grain-${variant}`;
  return (
    <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" className="h-[132px] w-full sm:h-[146px]" role="img" aria-label={
      variant === 1 ? "Ilustração de piso tátil interrompido por uma obra" : variant === 2 ? "Ilustração de uma faixa de pedestres sob um semáforo sem sinal sonoro" : "Ilustração de uma malha tátil contínua conduzindo a um portão"
    }>
      <defs>
        <pattern id={grainId} width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.4" fill="#f3eee2" opacity="0.12" />
        </pattern>
        <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141310" />
          <stop offset="1" stopColor="#0a0908" />
        </linearGradient>
      </defs>
      <rect width="240" height="150" fill={`url(#sky-${variant})`} />
      <rect width="240" height="150" fill={`url(#${grainId})`} />

      {/* horizonte e prédios distantes, quase apagados */}
      <g fill="#1d1b17">
        {variant === 1 && (
          <>
            <rect x="10" y="46" width="30" height="66" />
            <rect x="44" y="34" width="22" height="78" />
            <rect x="170" y="40" width="34" height="72" />
            <rect x="206" y="52" width="22" height="60" />
          </>
        )}
        {variant === 2 && (
          <>
            <rect x="6" y="52" width="26" height="58" />
            <rect x="208" y="44" width="28" height="66" />
            <rect x="232" y="58" width="14" height="52" />
          </>
        )}
        {variant === 3 && (
          <>
            <rect x="12" y="30" width="42" height="58" />
            <rect x="60" y="40" width="26" height="48" />
            <rect x="158" y="24" width="52" height="64" />
            <rect x="214" y="40" width="24" height="48" />
          </>
        )}
      </g>
      <g stroke="#2b2823" strokeWidth="0.5">
        <line x1="0" y1="112" x2="240" y2="112" />
      </g>

      {/* calçada em perspectiva */}
      <path d="M0 150 L 240 150 L 196 108 L 44 108 Z" fill="#171512" />
      <path d="M0 150 L 240 150 L 196 108 L 44 108 Z" fill="none" stroke="#2d2924" strokeWidth="0.6" />

      {variant === 1 && (
        <g>
          {/* piso tátil direcional que termina */}
          {Array.from({ length: 6 }).map((_, index) => {
            const t = index / 5;
            const y = 124 + t * 22;
            const x1 = 104 + t * 34;
            const x2 = 136 - t * 34;
            return (
              <g key={index} opacity={1 - t * 0.35}>
                <rect x={x1} y={y} width={x2 - x1} height={9} rx="1" fill="#3f4429" />
                {[0, 1, 2].map((line) => (
                  <rect key={line} x={x1 + 4 + line * ((x2 - x1 - 9) / 3)} y={y + 2} width="2" height="5" rx="1" fill="#cadb84" opacity="0.75" />
                ))}
              </g>
            );
          })}
          {/* obstáculo de obra */}
          <g>
            <rect x="94" y="78" width="48" height="8" rx="1" fill="#e2553b" opacity="0.9" />
            <rect x="96" y="86" width="5" height="30" fill="#e2553b" opacity="0.75" />
            <rect x="135" y="86" width="5" height="30" fill="#e2553b" opacity="0.75" />
            <rect x="96" y="70" width="44" height="8" rx="1" fill="#e2553b" opacity="0.35" />
            {Array.from({ length: 6 }).map((_, index) => (
              <line key={index} x1={98 + index * 8} y1="70" x2={90 + index * 8} y2="98" stroke="#e2553b" strokeWidth="0.7" opacity="0.4" />
            ))}
          </g>
          {/* destino */}
          <g>
            <rect x="150" y="56" width="34" height="56" rx="1" fill="#232019" />
            <rect x="154" y="60" width="26" height="30" rx="1" fill="#3b3426" />
            <rect x="167" y="90" width="9" height="22" rx="0.5" fill="#141210" />
            <circle cx="174" cy="101" r="1" fill="#cadb84" />
            <path d="M150 64 q 17 -8 34 0" stroke="#cadb84" strokeWidth="0.8" fill="none" opacity="0.5" />
          </g>
          {/* arco sonoro */}
          {[1, 2, 3].map((ring) => (
            <ellipse key={ring} cx="118" cy="132" rx={14 + ring * 12} ry={(14 + ring * 12) * 0.3} fill="none" stroke="#cadb84" strokeWidth="0.6" opacity={0.34 - ring * 0.08} />
          ))}
        </g>
      )}

      {variant === 2 && (
        <g>
          {/* asfalto */}
          <path d="M0 150 L 240 150 L 202 100 L 38 100 Z" fill="#0e0d0b" />
          <line x1="38" y1="100" x2="0" y2="150" stroke="#2a2723" strokeWidth="0.7" />
          <line x1="202" y1="100" x2="240" y2="150" stroke="#2a2723" strokeWidth="0.7" />
          {Array.from({ length: 9 }).map((_, index) => {
            const t = index / 8;
            const y = 108 + t * 38;
            const half = 14 + t * 22;
            return <rect key={index} x={120 - half} y={y} width={half * 2} height={4 + t * 3} fill="#e8e1d1" opacity={0.2 + t * 0.28} />;
          })}
          {[1, 2, 3].map((ring) => (
            <ellipse key={ring} cx="42" cy="132" rx={12 + ring * 11} ry={(12 + ring * 11) * 0.3} fill="none" stroke="#cadb84" strokeWidth="0.6" opacity={0.3 - ring * 0.07} />
          ))}
          {/* semáforo sem sinal sonoro */}
          <g>
            <rect x="214" y="34" width="3" height="80" rx="1" fill="#3a352e" />
            <rect x="204" y="28" width="20" height="34" rx="3" fill="#1e1b17" stroke="#3a352e" strokeWidth="0.8" />
            <circle cx="214" cy="37" r="4.4" fill="#3a2b26" />
            <circle cx="214" cy="48" r="4.4" fill="#3d3827" />
            <circle cx="214" cy="58" r="4.4" fill={accent === "#e2553b" ? "#e2553b" : "#cadb84"} opacity="0.95" />
            <circle cx="214" cy="58" r="8" fill={accent === "#e2553b" ? "#e2553b" : "#cadb84"} opacity="0.14" />
            <path d="M204 28 l -7 -6 M224 28 l 7 -6" stroke="#3a352e" strokeWidth="1" />
            <path d="M226 50 q 8 4 0 9" stroke="#e2553b" strokeWidth="0.9" fill="none" opacity="0.5" />
            <line x1="231" y1="48" x2="236" y2="54" stroke="#e2553b" strokeWidth="0.9" opacity="0.5" />
            <line x1="236" y1="48" x2="231" y2="54" stroke="#e2553b" strokeWidth="0.9" opacity="0.5" />
          </g>
          <circle cx="120" cy="88" r="3" fill="#e2553b" />
          <line x1="120" y1="88" x2="120" y2="104" stroke="#e2553b" strokeWidth="1" />
        </g>
      )}

      {variant === 3 && (
        <g>
          <rect x="26" y="62" width="188" height="66" rx="2" fill="#1a1814" />
          <path d="M26 62 L 214 62 L 214 128 L 26 128 Z" fill="none" stroke="#2c2822" strokeWidth="0.8" />
          {Array.from({ length: 8 }).map((_, index) => (
            <rect key={index} x={32 + index * 23} y="70" width="17" height="52" rx="1" fill="#211e19" />
          ))}
          <path d="M44 128 L 66 96 L 66 78 L 174 78 L 174 96 L 196 128" stroke="#cadb84" strokeWidth="5" strokeLinejoin="round" fill="none" opacity="0.85" />
          <path d="M44 128 L 66 96 L 66 78 L 174 78 L 174 96 L 196 128" stroke="#f3eee2" strokeWidth="0.8" strokeLinejoin="round" fill="none" opacity="0.25" />
          {Array.from({ length: 13 }).map((_, index) => (
            <circle key={index} cx={48 + index * 12} cy={101 + (index > 5 && index < 8 ? -5 : 0) + (index > 2 && index < 10 ? 0 : 6)} r="1.5" fill="#cadb84" opacity="0.5" />
          ))}
          <g>
            <rect x="104" y="82" width="34" height="13" rx="1" fill="#e8e1d1" opacity="0.85" />
            <rect x="104" y="99" width="22" height="4" rx="1" fill="#e8e1d1" opacity="0.4" />
            <rect x="150" y="84" width="22" height="9" rx="1" fill="#e8e1d1" opacity="0.35" />
          </g>
          <g>
            <rect x="120" y="52" width="20" height="12" rx="1" fill="#12110e" stroke="#cadb84" strokeWidth="0.8" />
            <circle cx="130" cy="58" r="2" fill="#cadb84" />
            {[1, 2, 3].map((ring) => (
              <circle key={ring} cx="130" cy="58" r={4 + ring * 6} fill="none" stroke="#cadb84" strokeWidth="0.6" opacity={0.4 - ring * 0.09} />
            ))}
          </g>
          <circle cx="130" cy="140" r="3.4" fill="#e2553b" />
          <path d="M130 140 L 130 120" stroke="#e2553b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
        </g>
      )}

      <rect x="0" y="0" width="240" height="150" fill="none" stroke="#2c2822" strokeWidth="1" />
    </svg>
  );
}

function PhaseCard({
  level,
  index,
  onStart,
}: {
  level: (typeof LEVELS)[number];
  index: number;
  onStart: (index: number) => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-ink/15 bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-ink/35 hover:shadow-[0_26px_50px_-32px_rgba(12,11,9,0.55)]">
      <div className="relative">
        <PhaseArt variant={(index + 1) as 1 | 2 | 3} accent={level.accent} />
        <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full border border-cream/20 bg-ink/80 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.09em] text-cream/65 backdrop-blur">
          0{level.number} · {level.place}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-cream/15 bg-ink/70 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.08em] text-cream/55 backdrop-blur">
          {index === 1 ? <TriangleAlert className="h-2.5 w-2.5 text-coral" /> : index === 2 ? <Sparkles className="h-2.5 w-2.5 text-lime" /> : <Scan className="h-2.5 w-2.5 text-lime" />}
          {index === 0 ? "calçada" : index === 1 ? "travessia" : "chegada"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-coral">{level.subtitle}</p>
        <h3 className="mt-1.5 font-display text-[24px] leading-[1.02] text-ink">{level.name}</h3>
        <p className="mt-2 flex-1 text-[11.5px] leading-relaxed text-muted">{level.brief}</p>
        <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
          <span className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.08em] text-muted/60">
            <MapPin className="h-2.5 w-2.5" /> {level.goal.label}
          </span>
          <button
            type="button"
            onClick={() => onStart(index)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.06em] text-cream transition-colors group-hover:bg-coral"
          >
            jogar <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function MenuScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader onStart={onStart} />
      <main id="conteudo">
        {/* HERO */}
        <section id="topo" className="relative overflow-hidden border-b border-ink/10 bg-cream">
          <div className="pointer-events-none absolute inset-0 hairline-grid opacity-70" />
          <div className="pointer-events-none absolute -right-28 top-24 h-[560px] w-[560px] rounded-full border border-ink/[0.06]" />
          <div className="pointer-events-none absolute -right-10 top-44 h-[360px] w-[360px] rounded-full border border-coral/[0.12]" />

          <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 py-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral/50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
                </span>
                <span className="mono-label text-ink/65">protótipo jogável</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                <span>Recife · PE</span>
                <span className="text-ink/20">/</span>
                <span>3 fases</span>
                <span className="text-ink/20">/</span>
                <span>5 botões</span>
                <span className="rounded-full border border-ink/15 px-2 py-0.5 text-ink/60">2026</span>
              </div>
            </div>

            <div className="grid gap-12 pb-16 pt-10 md:pb-20 md:pt-14 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <div className="mb-7 inline-flex -rotate-1 items-center gap-2 border border-ink/15 bg-paper/70 px-2.5 py-1.5">
                  <Sparkles className="h-2.5 w-2.5 text-coral" />
                  <span className="mono-label text-[8.5px] text-ink/70">jogo 01 · uma cidade inclusiva para imaginar</span>
                </div>
                <h1 className="font-display text-[clamp(3.3rem,8vw,6.8rem)] leading-[0.84] tracking-[-0.025em] text-ink">
                  A cidade
                  <br />
                  se revela
                  <br />
                  <span className="relative inline-block italic">
                    quando você
                    <svg viewBox="0 0 300 12" className="absolute -bottom-1 left-0 w-full text-coral/70" fill="none" preserveAspectRatio="none" aria-hidden>
                      <path d="M2 8.5C64 3 128 3.5 190 6.5c38 1.8 72 2.6 108 0.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <br />
                  fecha os olhos<span className="text-coral">.</span>
                </h1>

                <p className="mt-8 max-w-lg text-[15.5px] leading-relaxed text-muted">
                  <strong className="font-medium text-ink">Sentido</strong> é um jogo em primeira pessoa sobre atravessar
                  o Recife sem enxergar. A tela é completamente preta. O som, o toque da bengala e as pessoas na rua
                  desenham o caminho — quando a cidade permite.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => onStart(0)}
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-5 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-coral"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream/10">
                      <Play className="h-2.5 w-2.5" />
                    </span>
                    Entrar no escuro
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <a href="#fases" className="group inline-flex items-center justify-center gap-2 px-2 py-2 text-sm text-ink/65 transition-colors hover:text-ink">
                    Conhecer as três fases
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink/20 transition-colors group-hover:border-coral">
                      <ArrowDown className="h-3 w-3" />
                    </span>
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 pt-4">
                  {["3 fases", "5 botões", "~10 minutos"].map((item, index) => (
                    <span key={item} className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.09em] text-ink/55">
                      {index > 0 && <span className="h-3 w-px bg-ink/15" />}
                      {item}
                    </span>
                  ))}
                  <span className="ml-auto hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.07em] text-muted/80 sm:flex">
                    <Headphones className="h-3.5 w-3.5" /> fones recomendados
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative mx-auto w-full max-w-[430px] lg:ml-auto">
                  <div className="absolute -right-8 top-10 hidden -rotate-90 font-mono text-[8px] uppercase tracking-[0.25em] text-ink/30 lg:block">
                    o som é o mapa · 01
                  </div>

                  <div className="relative overflow-hidden rounded-[26px] border border-ink bg-ink text-cream shadow-[0_35px_70px_-45px_rgba(12,11,9,0.8)]">
                    <img
                      src="/images/capa-sentido.png"
                      alt="Arte de capa abstrata: um bastão branco com ponta vermelha atravessa o escuro e revela ondas circulares e pisos táteis."
                      className="absolute inset-0 h-full w-full object-cover opacity-90"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/55" />

                    <div className="relative flex items-center justify-between border-b border-cream/10 px-4 py-3">
                      <span className="mono-label text-cream/50">atravessar no escuro</span>
                      <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-cream/50">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" /> ao vivo
                      </span>
                    </div>

                    <div className="relative flex h-[330px] items-center justify-center sm:h-[370px]">
                      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2">
                        {[1, 0.75, 0.5, 0.28].map((scale, index) => (
                          <span
                            key={scale}
                            className="absolute inset-0 rounded-full border border-cream/10"
                            style={{ transform: `scale(${scale})` }}
                          >
                            {index === 0 && <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/80" />}
                          </span>
                        ))}
                        <span className="absolute inset-0 rounded-full border border-lime/25 animate-sonar" />
                        <span className="absolute inset-0 rounded-full border border-lime/20 animate-sonar" style={{ animationDelay: "1.6s" }} />
                      </div>

                      <button
                        type="button"
                        onClick={() => onStart(0)}
                        className="group relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-lime/45 bg-ink/70 backdrop-blur-md transition-all hover:scale-105 hover:border-lime hover:bg-ink"
                        aria-label="Jogar Sentido"
                      >
                        <Play className="h-5 w-5 text-lime transition-transform group-hover:translate-x-0.5" />
                        <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.12em] text-cream/55">jogar</span>
                      </button>

                      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                        <span className="rounded-full border border-cream/15 bg-black/35 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.08em] text-cream/55 backdrop-blur">
                          tela preta
                        </span>
                        <span className="rounded-full border border-coral/30 bg-coral/10 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.08em] text-[#ffab98] backdrop-blur">
                          sem game over
                        </span>
                      </div>

                      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                        <div className="flex items-end gap-[2px]">
                          {[6, 13, 9, 18, 11, 22, 14, 8, 17, 10, 14, 7].map((height, index) => (
                            <span
                              key={index}
                              className="sound-wave w-[2px] rounded-full bg-lime/65"
                              style={{ height, animationDelay: `${index * 0.09}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-right font-mono text-[7px] uppercase leading-relaxed tracking-[0.08em] text-cream/40">
                          piso tátil · som
                          <br />
                          ajuda · toque
                        </span>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between border-t border-cream/10 px-4 py-3">
                      <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-cream/40">aurora → boa vista → encruzilhada</span>
                      <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-cream/60">
                        <Headphones className="h-3 w-3" /> 03 fases
                      </span>
                    </div>
                  </div>

                  <div className="relative z-20 mt-4 w-[210px] -rotate-2 rounded-sm border border-ink/15 bg-cream p-3 shadow-[0_18px_35px_-20px_rgba(12,11,9,0.6)] sm:absolute sm:-bottom-6 sm:-left-7 sm:mt-0">
                    <div className="flex items-start gap-1.5">
                      <Scan className="mt-0.5 h-2.5 w-2.5 shrink-0 text-coral" />
                      <p className="font-display text-[19px] italic leading-[1.05] text-ink">
                        seu bastão só revela o que ele toca.
                      </p>
                    </div>
                    <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">tela 100% preta durante o jogo</p>
                  </div>

                  <div className="absolute -right-2 top-20 z-20 flex h-14 w-14 rotate-6 flex-col items-center justify-center rounded-full bg-coral text-center text-white shadow-lg sm:-right-4">
                    <span className="font-mono text-[7px] uppercase leading-none opacity-70">até</span>
                    <span className="font-display text-xl leading-none">03</span>
                    <span className="font-mono text-[6px] uppercase leading-none opacity-70">fases</span>
                  </div>
                </div>
                <p className="mt-4 text-right font-mono text-[8px] uppercase tracking-[0.08em] text-muted/70 sm:mt-10">
                  cada erro tem consequência · cada ajuda também conta
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="relative overflow-hidden border-y border-ink bg-ink py-3 text-cream">
          <div className="flex w-max animate-marquee items-center" aria-hidden>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {["a tela é preta", "o som é o mapa", "5 botões", "3 fases", "punições reais", "ajuda não é fraqueza", "uma cidade para todos"].map((item) => (
                  <div key={`${copy}-${item}`} className="flex items-center gap-6 px-6">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/75">{item}</span>
                    <Sparkles className="h-2.5 w-2.5 text-coral" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* FASES */}
        <section id="fases" className="relative scroll-mt-20 overflow-hidden bg-cream py-20 md:py-28">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="mono-label text-coral">02 / as três travessias</span>
                  <span className="h-px w-16 bg-ink/20" />
                </div>
                <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.6rem,5.4vw,4.7rem)] leading-[0.9] tracking-[-0.02em]">
                  Três fases.
                  <br />
                  Nenhuma imagem<span className="text-coral">.</span>
                </h2>
              </div>
              <p className="max-w-sm text-[13px] leading-relaxed text-muted">
                Cada fase acrescenta uma nova camada de informação e uma nova barreira urbana. Você pode começar por
                qualquer uma — mas a terceira só faz sentido depois das duas primeiras.
              </p>
            </div>
            <div className="mt-9 grid gap-3 md:grid-cols-3">
              {LEVELS.map((level, index) => (
                <PhaseCard key={level.id} level={level} index={index} onStart={onStart} />
              ))}
            </div>
            <p className="mt-5 flex items-start gap-2 font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-muted/60">
              <EyeOff className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
              durante as fases, o cenário só aparece quando a bengala toca o chão · o mapa de apoio existe apenas na pausa
            </p>
          </div>
        </section>

        {/* COMO JOGAR */}
        <section id="como-jogar" className="relative scroll-mt-20 overflow-hidden bg-ink py-20 text-cream md:py-28">
          <div className="pointer-events-none absolute inset-0 opacity-[0.3] [background-image:radial-gradient(rgba(243,238,226,0.09)_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-lime/[0.04] blur-3xl" />
          <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="mono-label text-coral">03 / como jogar</span>
                  <span className="h-px w-16 bg-cream/20" />
                </div>
                <h2 className="mt-4 font-display text-[clamp(2.7rem,5.6vw,5rem)] leading-[0.88] tracking-[-0.02em]">
                  Cinco botões.
                  <br />
                  <span className="italic text-lime">Nenhuma imagem.</span>
                </h2>
              </div>
              <p className="max-w-md text-[13.5px] leading-relaxed text-cream/50 lg:col-span-5">
                A tela fica completamente preta do começo ao fim. Você só percebe o mundo pelo eco da bengala, pela
                narração e pelas pessoas. O menu é a única tela iluminada.
              </p>
            </div>

            <div className="mt-10 grid gap-3 lg:grid-cols-12">
              <div className="rounded-2xl border border-cream/12 bg-cream/[0.03] p-4 sm:p-6 lg:col-span-7">
                <div className="flex items-center justify-between">
                  <span className="mono-label text-cream/40">o controle</span>
                  <span className="mono-label text-cream/25">teclado ou toque</span>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-5">
                  {[
                    { icon: MoveLeft, label: "Girar à esquerda", key: "A / ←" },
                    { icon: MoveUp, label: "Avançar", key: "W / ↑", highlight: true },
                    { icon: MoveRight, label: "Girar à direita", key: "D / →" },
                    { icon: Scan, label: "Bater a bengala", key: "espaço", cream: true },
                    { icon: Hand, label: "Pedir ajuda", key: "H", outline: true },
                  ].map((control) => {
                    const Icon = control.icon;
                    return (
                      <div
                        key={control.label}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-center",
                          control.highlight
                            ? "border-lime bg-lime text-ink"
                            : control.cream
                              ? "border-cream bg-cream text-ink"
                              : control.outline
                                ? "border-lime/35 bg-lime/[0.06] text-lime"
                                : "border-cream/15 bg-cream/[0.04] text-cream/70",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-[10px] font-medium leading-tight">{control.label}</span>
                        <span className={cn("font-mono text-[7px] uppercase tracking-[0.04em]", control.highlight || control.cream ? "text-ink/45" : "text-cream/30")}>
                          {control.key}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 grid gap-3 border-t border-cream/10 pt-4 sm:grid-cols-3">
                  {[
                    ["01", "Escute a cena", "A narração descreve o entorno e o objetivo."],
                    ["02", "Toque o chão", "A bengala revela piso, obstáculos e pessoas por alguns segundos."],
                    ["03", "Decida", "Avance, gire, insista no toque ou peça ajuda."],
                  ].map(([number, title, text]) => (
                    <div key={number}>
                      <p className="mono-label text-[7px] text-coral">{number}</p>
                      <p className="mt-1 text-[11.5px] font-medium text-cream/80">{title}</p>
                      <p className="mt-1 text-[10.5px] leading-relaxed text-cream/35">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-cream/12 bg-cream/[0.02] p-4 sm:p-6 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <span className="mono-label text-cream/40">quando você erra</span>
                  <TriangleAlert className="h-3.5 w-3.5 text-coral" />
                </div>
                <h3 className="mt-3 font-display text-[26px] leading-none text-cream/90">O erro não é game over. É uma consequência.</h3>
                <div className="mt-4 space-y-2">
                  {[
                    ["Buraco não sinalizado", "−14 confiança · +10s", "Você volta ao último ponto seguro."],
                    ["Entrar na pista", "−22 confiança · +16s", "O carro freia. Você recua ao meio-fio."],
                    ["Atravessar na hora errada", "−18 confiança · +14s", "A buzina ensina o que o farol não disse."],
                    ["Pedir ajuda", "+tempo, nunca punição", "Apoio é uma escolha legítima e registrada."],
                  ].map(([title, cost, detail]) => (
                    <div key={title} className="border-t border-cream/10 pt-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11.5px] font-medium text-cream/80">{title}</p>
                        <span className={cn("shrink-0 font-mono text-[7.5px] uppercase tracking-[0.04em]", title === "Pedir ajuda" ? "text-lime" : "text-coral")}>{cost}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-cream/35">{detail}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 flex items-start gap-2 rounded-lg border border-lime/20 bg-lime/[0.05] px-3 py-2 font-mono text-[8px] uppercase leading-relaxed tracking-[0.05em] text-cream/50">
                  <Hand className="mt-0.5 h-3 w-3 shrink-0 text-lime" /> pedir ajuda nunca é tratado como erro pelo jogo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ACESSO / SOBRE */}
        <section id="acesso" className="relative scroll-mt-20 overflow-hidden bg-paper py-20 md:py-28">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.3] [background-image:radial-gradient(rgba(12,11,9,0.1)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="mono-label text-coral">04 / acesso à experiência</span>
                  <span className="h-px w-16 bg-ink/20" />
                </div>
                <h2 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5.1vw,4.4rem)] leading-[0.9] tracking-[-0.02em]">
                  Se a informação
                  <br />
                  depende de um sentido
                  <br />
                  só, o jogo <span className="italic text-coral">falha</span>.
                </h2>
                <p className="mt-5 max-w-xl text-[13.5px] leading-relaxed text-muted">
                  Acessibilidade não é um modo extra: é a estrutura do jogo. Cada cena pode ser compreendida por áudio,
                  texto e toque, e nenhuma ação essencial depende de cor, luz ou de um lugar só na tela.
                </p>

                <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {[
                    "Narração em voz alta e legendas sensoriais.",
                    "Cinco controles por teclado ou toque.",
                    "Contraste alto, zoom e leitor de tela.",
                    "Mapa de apoio opcional na pausa.",
                    "Vibração como reforço, nunca como única resposta.",
                    "Sem cronômetro punitivo: tempo é informação.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink/25 text-ink/70">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span className="text-[11.5px] leading-relaxed text-ink/70">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    [Headphones, "áudio espacial"],
                    [Scan, "bengala tátil"],
                    [Vibrate, "vibração"],
                    [Users, "ajuda como mecânica"],
                    [Volume2, "controle de som"],
                  ].map(([Icon, label]) => {
                    const TagIcon = Icon as typeof Headphones;
                    return (
                      <span key={label as string} className="flex items-center gap-1.5 rounded-full border border-ink/20 bg-cream/60 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.06em] text-muted">
                        <TagIcon className="h-3 w-3 text-coral" /> {label as string}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-xl border border-ink/15 bg-cream/60 p-4">
                  <div className="flex items-start gap-3">
                    <Quote className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                    <div>
                      <p className="font-display text-[21px] italic leading-[1.15] text-ink/80">
                        “O que queremos que a pessoa perceba? Que a falta de sinalização transforma uma tarefa simples em
                        um desafio de confiança.”
                      </p>
                      <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                        canvas de criação · pergunta do jogo · protótipo make recife em jogo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rotate-[1deg] border border-ink/20 bg-cream p-5 shadow-[0_24px_50px_-30px_rgba(12,11,9,0.5)] sm:p-6">
                  <div className="flex items-center justify-between border-b border-ink/15 pb-3">
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink/50">Recife em Jogo:</span>
                    <span className="rounded-full bg-coral px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.08em] text-white">canvas 01</span>
                  </div>
                  <p className="mt-3 font-display text-[25px] leading-tight">Uma cidade inclusiva começa quando alguém a imagina.</p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                    Protótipo educacional feito por uma equipe de cinco pessoas. O jogo não tenta simular a deficiência:
                    ele simula o que a cidade deixa de informar.
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      ["situação urbana", "Recife · de casa ao mercado, sem sinalização acessível."],
                      ["pessoas e barreiras", "Pessoas cegas ou com baixa visão diante de calçadas e travessias hostis."],
                      ["interação", "5 botões, áudio binaural, bengala tátil, voz e vibração."],
                    ].map(([label, value]) => (
                      <div key={label} className="border-t border-ink/10 pt-2">
                        <p className="font-mono text-[6.5px] uppercase tracking-[0.08em] text-coral">{label}</p>
                        <p className="mt-0.5 text-[10.5px] leading-relaxed text-ink/60">{value}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onStart(0)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-[12px] font-medium text-cream transition-colors hover:bg-coral"
                  >
                    <Play className="h-2.5 w-2.5" /> Jogar o protótipo
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                  </button>
                  <p className="mt-2 text-center font-mono text-[7px] uppercase tracking-[0.05em] text-muted/60">recife · pe · 2026</p>
                </div>
                <div className="mt-4 flex items-center gap-3 px-2">
                  <div className="h-8 w-24 opacity-60 [background-image:radial-gradient(rgba(12,11,9,0.55)_1.7px,transparent_1.7px)] [background-size:10px_10px]" aria-hidden />
                  <p className="font-mono text-[7px] uppercase leading-relaxed tracking-[0.06em] text-muted/60">
                    relevo tátil · o chão
                    <br />
                    também é uma forma de texto
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative overflow-hidden bg-ink pb-8 pt-20 text-cream md:pt-24">
          <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-coral/[0.07] blur-3xl" />
          <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <span className="mono-label flex items-center gap-2 text-coral">
                  <Sparkles className="h-2.5 w-2.5" /> a cidade que queremos
                </span>
                <h2 className="mt-4 font-display text-[clamp(2.8rem,6.2vw,5.8rem)] leading-[0.88] tracking-[-0.02em]">
                  Uma cidade inclusiva
                  <br />
                  começa quando alguém
                  <br />
                  <span className="italic text-lime">a imagina.</span>
                </h2>
              </div>
              <div className="lg:col-span-4 lg:pb-3">
                <p className="max-w-sm text-[13.5px] leading-relaxed text-cream/50">
                  Três travessias, cinco botões e uma tela completamente preta. Jogue com fones. Repare no que falta.
                  Leve a pergunta para a próxima calçada.
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                  <button
                    type="button"
                    onClick={() => onStart(0)}
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-coral px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-deep"
                  >
                    <Play className="h-2.5 w-2.5" /> Jogar o Sentido
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <a href="#topo" className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/20 px-5 py-3 text-sm text-cream/75 transition-colors hover:border-cream/50 hover:text-cream">
                    Voltar ao início
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-14 flex flex-col justify-between gap-4 border-t border-cream/15 pt-5 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="mono-label flex items-center gap-2 text-cream/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" /> protótipo jogável
                </span>
                <span className="mono-label text-cream/25">03 fases</span>
                <span className="mono-label text-cream/25">05 botões</span>
                <span className="mono-label text-cream/25">00 imagens durante o jogo</span>
              </div>
              <span className="font-display text-[18px] italic text-cream/40">“A tela é preta. O caminho, não.”</span>
            </div>

            <div className="mt-10 grid gap-8 border-t border-cream/15 pt-6 sm:grid-cols-3">
              <div>
                <p className="font-display text-2xl leading-none">
                  sentido<span className="text-coral">.</span>
                </p>
                <p className="mt-2 max-w-[230px] text-[10.5px] leading-relaxed text-cream/35">
                  Jogo de navegação sensorial sobre uma cidade que ainda não foi desenhada para todos.
                </p>
              </div>
              <div>
                <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-cream/30">navegue</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-cream/50">
                  {NAV.map(([label, href]) => (
                    <a key={href} href={href} className="transition-colors hover:text-lime">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="sm:text-right">
                <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-cream/30">projeto</p>
                <p className="mt-2 font-display text-[16px] italic leading-tight text-cream/55">
                  Recife em Jogo · protótipo make 2026
                </p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.06em] text-cream/25">
                  equipe de cinco pessoas · cidade inclusiva
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-between gap-2 border-t border-cream/10 pt-4 sm:flex-row sm:items-center">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.05em] text-cream/20">
                sentido © 2026 · feito no recife, para ser sentido
              </p>
              <p className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.05em] text-cream/20">
                <Compass className="h-3 w-3" /> jogue com fones · toque pelo teclado ou tela
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
