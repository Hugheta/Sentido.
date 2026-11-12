import { useState } from "react";
import { cn } from "@/utils/cn";
import { ArrowRight, ArrowUpRight, Close, Compass, Headphones, LogoMark, Menu, Play, Spark } from "./Icons";

const NAV = [
  { number: "01", label: "O jogo", href: "#jogo" },
  { number: "02", label: "Demo", href: "#demo" },
  { number: "03", label: "Barreiras", href: "#barreiras" },
  { number: "04", label: "Canvas", href: "#canvas" },
  { number: "05", label: "Acesso", href: "#acesso" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const closeAndGo = (href: string) => {
    setOpen(false);
    window.setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <a href="#topo" className="group flex items-center gap-2.5" aria-label="Sentido — início">
          <LogoMark className="h-8 w-8 text-ink transition-colors group-hover:text-coral md:h-9 md:w-9" />
          <span className="flex flex-col">
            <span className="font-display text-[25px] leading-[0.8] tracking-[-0.01em] md:text-[28px]">
              sentido<span className="text-coral">.</span>
            </span>
            <span className="mono-label mt-1 text-[6.5px] leading-none text-muted/80 md:text-[7px]">recife em jogo</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-baseline gap-1.5 text-[13px] text-ink/70 transition-colors hover:text-ink"
            >
              <span className="font-mono text-[8px] text-coral/80">{item.number}</span>
              <span className="relative">
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-coral transition-all duration-300 group-hover:w-full" />
              </span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#demo"
            className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[12.5px] font-medium text-cream transition-colors hover:bg-coral sm:inline-flex"
          >
            <Play className="h-2.5 w-2.5" />
            Jogar a demo
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <Close className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "grid overflow-hidden border-ink/10 transition-[grid-template-rows] duration-300 lg:hidden",
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <nav className="mx-auto max-w-[1240px] px-5 py-4" aria-label="Navegação móvel">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  closeAndGo(item.href);
                }}
                className="flex items-center justify-between border-b border-ink/10 py-3 text-sm text-ink/80 last:border-0"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[9px] text-coral">{item.number}</span>
                  {item.label}
                </span>
                <ArrowRight className="h-4 w-4 text-ink/35" />
              </a>
            ))}
            <a
              href="#demo"
              onClick={(event) => {
                event.preventDefault();
                closeAndGo("#demo");
              }}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm text-cream"
            >
              <Play className="h-3 w-3" /> Jogar a demo
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden border-b border-ink/10 bg-cream">
      <div className="pointer-events-none absolute inset-0 hairline-grid opacity-60" />
      <div className="pointer-events-none absolute -right-40 top-16 h-[560px] w-[560px] rounded-full border border-ink/[0.06]" />
      <div className="pointer-events-none absolute -right-24 top-32 h-[380px] w-[380px] rounded-full border border-coral/[0.12]" />

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
            <span>8°03′S 34°53′W</span>
            <span className="text-ink/20">/</span>
            <span>canvas nº 01</span>
            <span className="rounded-full border border-ink/15 px-2 py-0.5 text-ink/60">2026</span>
          </div>
        </div>

        <div className="grid gap-12 pb-16 pt-10 md:pb-20 md:pt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="mb-7 inline-flex -rotate-1 items-center gap-2 border border-ink/15 bg-paper/70 px-2.5 py-1.5">
              <Spark className="h-2.5 w-2.5 text-coral" />
              <span className="mono-label text-[8.5px] text-ink/70">o primeiro jogo que se joga de olhos fechados</span>
            </div>

            <h1 className="font-display text-[clamp(3.35rem,8.1vw,6.9rem)] leading-[0.84] tracking-[-0.025em] text-ink">
              A cidade
              <br />
              se revela
              <br />
              <span className="relative inline-block italic">
                quando você
                <svg
                  viewBox="0 0 300 12"
                  className="absolute -bottom-1 left-0 w-full text-coral/70"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path d="M2 8.5C64 3 128 3.5 190 6.5c38 1.8 72 2.6 108 0.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              fecha os olhos<span className="text-coral">.</span>
            </h1>

            <div className="mt-8 grid gap-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="max-w-lg text-[15.5px] leading-relaxed text-muted">
                  <strong className="font-medium text-ink">Sentido</strong> é um jogo 3D em primeira pessoa sobre
                  atravessar o Recife sem enxergar. A tela é preta. O som, o toque e as pessoas na rua desenham o
                  caminho — quando a cidade permite.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#demo"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-5 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-coral"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream/10">
                      <Play className="h-2.5 w-2.5" />
                    </span>
                    Começar a travessia
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#jogo"
                    className="group inline-flex items-center justify-center gap-2 px-2 py-2 text-sm text-ink/65 transition-colors hover:text-ink"
                  >
                    Entender o conceito
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink/20 transition-colors group-hover:border-coral">
                      <ArrowRight className="h-3 w-3 rotate-90" />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 pt-4">
              {["5 botões", "4 barreiras", "1 cidade em jogo"].map((item, index) => (
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
              <div className="absolute -right-10 top-10 hidden -rotate-90 font-mono text-[8px] uppercase tracking-[0.25em] text-ink/30 lg:block">
                o som é o mapa · 01
              </div>

              <div className="relative overflow-hidden rounded-[26px] border border-ink bg-ink text-cream shadow-[0_35px_70px_-45px_rgba(12,11,9,0.8)]">
                <div className="flex items-center justify-between border-b border-cream/10 px-4 py-3">
                  <span className="mono-label text-cream/45">mapa de escuta</span>
                  <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-cream/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-coral animate-blink" /> rec · demo
                  </span>
                </div>

                <div className="relative h-[330px] overflow-hidden sm:h-[355px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(202,219,132,0.13),transparent_60%)]" />
                  <div className="absolute inset-0 [background-image:radial-gradient(rgba(243,238,226,0.11)_1px,transparent_1px)] [background-size:18px_18px] opacity-50" />

                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none" aria-hidden>
                    {[8, 16, 24, 32].map((radius, index) => (
                      <circle
                        key={radius}
                        cx="50"
                        cy="48"
                        r={radius}
                        stroke="rgba(243,238,226,0.13)"
                        strokeWidth="0.25"
                        strokeDasharray={index % 2 ? "0.5 1.5" : undefined}
                      />
                    ))}
                    <path
                      d="M50 48C54 35 44 29 49 13"
                      stroke="rgba(202,219,132,0.6)"
                      strokeWidth="0.45"
                      strokeDasharray="1.2 1.6"
                    />
                    <line x1="50" y1="10" x2="50" y2="82" stroke="rgba(243,238,226,0.09)" strokeWidth="0.2" />
                    <line x1="18" y1="48" x2="82" y2="48" stroke="rgba(243,238,226,0.09)" strokeWidth="0.2" />
                  </svg>

                  <div className="absolute left-1/2 top-[48%] z-10 -translate-x-1/2 -translate-y-1/2">
                    <span className="absolute inset-0 -m-8 animate-sonar rounded-full border border-lime/25" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-lime/50 bg-ink">
                      <span className="h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_20px_5px_rgba(202,219,132,0.35)]" />
                    </div>
                    <span className="mono-label absolute left-1/2 top-[52px] -translate-x-1/2 whitespace-nowrap text-[8px] text-cream/40">você</span>
                  </div>

                  <div className="absolute left-[12%] top-[26%] rounded-full border border-lime/35 bg-lime/10 px-2 py-1 font-mono text-[8px] tracking-[0.04em] text-lime backdrop-blur-sm">
                    padaria · 14m
                  </div>
                  <div className="absolute right-[8%] top-[39%] rounded-full border border-coral/45 bg-coral/15 px-2 py-1 font-mono text-[8px] tracking-[0.04em] text-[#ffab98] backdrop-blur-sm">
                    carro · 8m
                  </div>
                  <div className="absolute bottom-[25%] left-[10%] rounded-full border border-cream/20 bg-cream/[0.06] px-2 py-1 font-mono text-[8px] tracking-[0.04em] text-cream/70 backdrop-blur-sm">
                    piso tátil?
                  </div>
                  <div className="absolute bottom-[18%] right-[12%] rounded-full border border-coral/40 bg-coral/10 px-2 py-1 font-mono text-[8px] tracking-[0.04em] text-[#ffab98] backdrop-blur-sm">
                    placa · 2 passos
                  </div>

                  <div className="absolute inset-x-0 top-4 flex justify-center">
                    <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.12em] text-cream/35">
                      <Compass className="h-3 w-3 text-lime/80" /> frente
                    </span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                    <div className="flex items-end gap-[2px]">
                      {[6, 13, 9, 18, 11, 22, 14, 8, 17, 10, 14, 7].map((height, index) => (
                        <span
                          key={index}
                          className="sound-wave w-[2px] rounded-full bg-lime/65"
                          style={{ height, animationDelay: `${index * 0.09}s` }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-cream/30">áudio binaural ativo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-cream/10 px-4 py-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-cream/35">aurora → encruzilhada</span>
                  <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-cream/55">
                    <Headphones className="h-3 w-3" /> 04 cenas
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 z-20 w-[205px] rotate-[-3deg] rounded-sm border border-ink/15 bg-cream p-3 shadow-[0_18px_35px_-20px_rgba(12,11,9,0.6)] sm:-left-7">
                <div className="flex items-start gap-1.5">
                  <Spark className="mt-0.5 h-2.5 w-2.5 shrink-0 text-coral" />
                  <p className="font-display text-[19px] italic leading-[1.05] text-ink">
                    a tela é preta.
                    <br />
                    a experiência, não.
                  </p>
                </div>
                <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">som · toque · ajuda</p>
              </div>

              <div className="absolute -right-2 top-20 z-20 flex h-14 w-14 rotate-6 flex-col items-center justify-center rounded-full bg-coral text-center text-white shadow-lg sm:-right-4">
                <span className="font-mono text-[7px] uppercase leading-none opacity-70">até</span>
                <span className="font-display text-xl leading-none">4</span>
                <span className="font-mono text-[6px] uppercase leading-none opacity-70">barreiras</span>
              </div>
            </div>
            <p className="mt-9 text-right font-mono text-[8px] uppercase tracking-[0.08em] text-muted/70">
              tradução visual do áudio · demo disponível abaixo
            </p>
          </div>
        </div>
      </div>

      <MarqueeStrip />
    </section>
  );
}

function MarqueeStrip() {
  const items = ["a tela é preta", "o som é o mapa", "5 botões", "4 barreiras", "1 travessia", "uma cidade para todos"];
  return (
    <div className="relative overflow-hidden border-y border-ink bg-ink py-3 text-cream">
      <p className="sr-only">A tela é preta, o som é o mapa, cinco botões, quatro barreiras, uma travessia, uma cidade para todos.</p>
      <div className="flex w-max animate-marquee items-center" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {items.map((item) => (
              <div key={`${copy}-${item}`} className="flex items-center gap-6 px-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/75">{item}</span>
                <Spark className="h-2.5 w-2.5 text-coral" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
