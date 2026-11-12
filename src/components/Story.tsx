import { ArrowUpRight, Check, Headphones, Quote, Route, Spark, Users, Vibrate } from "./Icons";

const SENSES = [
  {
    number: "01",
    title: "Som binaural",
    description: "A direção nasce da diferença entre os dois fones. Um carro à esquerda não é a mesma coisa que uma padaria à direita.",
    tag: "áudio espacial",
    icon: Headphones,
    dark: true,
  },
  {
    number: "02",
    title: "Toque e vibração",
    description: "O celular responde ao que está perto. O corpo confirma o obstáculo sem precisar adivinhar onde a calçada termina.",
    tag: "resposta háptica",
    icon: Vibrate,
    dark: false,
  },
  {
    number: "03",
    title: "Vozes da rua",
    description: "A narração descreve a cena. As pessoas na rua ajudam a atravessar. Nenhuma das duas decide por você.",
    tag: "narração + ajuda",
    icon: Users,
    dark: false,
  },
];

const BARRIERS = [
  {
    title: "Calçada sem piso tátil",
    short: "O chão existe, mas não informa nada. A direção vem de uma padaria, duas quadras adiante.",
    inGame: "A bengala encontra uma placa de cafeteria no meio do caminho.",
    imagined: "Piso tátil contínuo, contraste visual e paradas seguras para decidir.",
    consequence: "Atenção constante — e um susto.",
  },
  {
    title: "Travessia sem sinal sonoro",
    short: "O semáforo é só para quem enxerga. O sinal verde vira uma dedução pelo ruído dos carros.",
    inGame: "Você espera uma janela de silêncio entre dois carros.",
    imagined: "Sinal sonoro no semáforo e tempo de travessia suficiente.",
    consequence: "Risco de colisão e medo.",
  },
  {
    title: "Calçada quebrada & obras",
    short: "Andaimes, poças e buracos ocupam a passagem sem nenhum desvio tátil.",
    inGame: "O vão seguro está à direita, mas só o toque lento revela.",
    imagined: "Desvio sinalizado antes do obstáculo, não depois.",
    consequence: "Caminho mais longo e tropeços.",
  },
  {
    title: "Multidão sem referência",
    short: "A feira informa o destino, mas não a entrada. Muitas vozes em todas as direções.",
    inGame: "O piso tátil contínuo conduz os últimos seis passos.",
    imagined: "Pontos de referência sonoros e mapas de chegada.",
    consequence: "Dependência de um estranho gentil.",
  },
];

export function Concept() {
  return (
    <section id="jogo" className="relative scroll-mt-24 overflow-hidden bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="mono-label text-coral">01 / o jogo</span>
            <span className="h-px w-16 bg-ink/20" />
            <span className="mono-label text-muted">um protótipo sensorial</span>
          </div>
          <span className="mono-label flex items-center gap-1.5 text-muted">
            <Spark className="h-2.5 w-2.5 text-coral" /> recife em jogo · canvas 01
          </span>
        </div>

        <div className="mt-9 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-5">
            <div className="relative">
              <div className="absolute -bottom-3 -left-3 h-full w-full border border-ink/20" aria-hidden />
              <figure className="relative overflow-hidden bg-ink">
                <img
                  src="https://images.pexels.com/photos/8327773/pexels-photo-8327773.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=900"
                  alt="Pessoa com bengala branca caminhando em uma calçada de pedra, ao ar livre."
                  className="aspect-[4/4.7] h-full w-full object-cover opacity-90 grayscale-[0.15]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mono-label text-lime">representação</span>
                  <p className="mt-2 max-w-[260px] font-display text-[23px] italic leading-[1.05] text-cream">
                    O trajeto começa antes do primeiro passo.
                  </p>
                </div>
              </figure>
              <a
                href="https://www.pexels.com/photo/a-person-holding-a-walking-stick-8327773/"
                target="_blank"
                rel="noreferrer"
                className="absolute right-2 top-2 rounded-full bg-ink/55 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.08em] text-cream/60 backdrop-blur hover:text-cream"
              >
                foto · pexels ↗
              </a>
            </div>

            <div className="relative z-10 mt-5 ml-auto mr-3 w-[228px] rotate-[1.5deg] border border-ink/15 bg-paper p-3 shadow-[0_16px_30px_-22px_rgba(12,11,9,0.6)] sm:mr-8">
              <p className="mono-label text-[7px] text-coral">pergunta do jogo</p>
              <p className="mt-1.5 font-display text-[17px] italic leading-[1.15] text-ink/80">
                “A cidade estava lá o tempo todo. O que faltava era projeto.”
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-4">
            <p className="mono-label text-muted">o ponto de partida</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.9] tracking-[-0.02em]">
              Sem imagens,
              <br />
              o mundo aprende
              <br />
              a ser <span className="italic text-coral">ouvido</span>.
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <p className="text-[14px] leading-relaxed text-muted">
                Em <em className="not-italic font-medium text-ink">Sentido</em>, você acorda em casa e precisa chegar ao
                Mercado da Encruzilhada. O chão some sob os pés, o cruzamento não avisa e a calçada decide por você.
                A tela permanece preta o tempo inteiro.
              </p>
              <p className="text-[14px] leading-relaxed text-muted">
                O jogo não tenta simular a deficiência. Ele simula uma cidade que ainda não foi projetada para todos —
                e transforma o som, o tato e a solidariedade em sistema de navegação.
              </p>
            </div>

            <div className="mt-7 grid gap-3 border-y border-ink/15 py-5 sm:grid-cols-3">
              <div>
                <p className="font-display text-4xl leading-none">05</p>
                <p className="mono-label mt-1 text-[8px] leading-relaxed text-muted">botões para toda a jornada</p>
              </div>
              <div className="sm:border-l sm:border-ink/15 sm:pl-5">
                <p className="font-display text-4xl leading-none">04</p>
                <p className="mono-label mt-1 text-[8px] leading-relaxed text-muted">barreiras urbanas jogáveis</p>
              </div>
              <div className="sm:border-l sm:border-ink/15 sm:pl-5">
                <p className="font-display text-4xl leading-none">00</p>
                <p className="mono-label mt-1 text-[8px] leading-relaxed text-muted">cores necessárias para jogar</p>
              </div>
            </div>

            <blockquote className="mt-6 flex gap-3">
              <Quote className="mt-1 h-4 w-4 shrink-0 text-coral" />
              <div>
                <p className="text-[13.5px] leading-relaxed text-ink/75">
                  “O que queremos que a pessoa perceba? Que a falta de sinalização transforma uma tarefa simples em um
                  desafio de confiança.”
                </p>
                <cite className="mono-label mt-2 block not-italic text-[8px] text-muted">canvas de criação · campo 03</cite>
              </div>
            </blockquote>
          </div>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {SENSES.map((sense) => {
            const Icon = sense.icon;
            return (
              <article
                key={sense.title}
                className={
                  sense.dark
                    ? "group relative overflow-hidden rounded-xl border border-ink bg-ink p-5 text-cream"
                    : "group relative overflow-hidden rounded-xl border border-ink/15 bg-paper/35 p-5 transition-colors hover:bg-paper/70"
                }
              >
                <div className="flex items-start justify-between">
                  <span
                    className={
                      sense.dark
                        ? "flex h-9 w-9 items-center justify-center rounded-full border border-lime/30 bg-lime/10 text-lime"
                        : "flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-cream text-ink/70"
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={
                      sense.dark
                        ? "font-mono text-[8px] uppercase tracking-[0.1em] text-cream/35"
                        : "font-mono text-[8px] uppercase tracking-[0.1em] text-muted/60"
                    }
                  >
                    {sense.tag}
                  </span>
                </div>
                <h3 className={sense.dark ? "mt-5 font-display text-2xl" : "mt-5 font-display text-2xl text-ink"}>
                  {sense.title}
                </h3>
                <p className={sense.dark ? "mt-2 text-[12.5px] leading-relaxed text-cream/55" : "mt-2 text-[12.5px] leading-relaxed text-muted"}>
                  {sense.description}
                </p>
                <span
                  className={
                    sense.dark
                      ? "absolute -bottom-3 right-3 font-display text-6xl italic text-cream/[0.06]"
                      : "absolute -bottom-3 right-3 font-display text-6xl italic text-ink/[0.06]"
                  }
                >
                  {sense.number}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Barriers() {
  return (
    <section id="barreiras" className="relative scroll-mt-24 overflow-hidden border-y border-ink/10 bg-paper py-20 md:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.35] [background-image:radial-gradient(rgba(12,11,9,0.1)_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="mono-label text-coral">03 / as barreiras</span>
              <span className="h-px w-16 bg-ink/20" />
            </div>
            <h2 className="mt-4 font-display text-[clamp(2.6rem,5.4vw,4.7rem)] leading-[0.9] tracking-[-0.02em]">
              Quatro coisas que
              <br />
              a maioria nunca
              <br />
              precisa <span className="italic text-coral">pensar</span>.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-lg border border-ink/20">
              <img
                src="https://images.pexels.com/photos/7188725/pexels-photo-7188725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800"
                alt="Close de pessoa caminhando sobre piso tátil amarelo com bengala."
                className="h-[150px] w-full object-cover sm:h-[170px]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-ink/20" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/80 to-transparent p-3">
                <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-cream/80">
                  piso tátil: informação
                  <br />
                  que se lê com o pé
                </p>
                <a
                  href="https://www.pexels.com/photo/photo-of-person-wearing-brown-shoes-7188725/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[7px] uppercase tracking-[0.08em] text-cream/50 hover:text-cream"
                >
                  pexels ↗
                </a>
              </div>
            </div>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted">
              Cada cena do protótipo nasceu de uma pergunta do canvas: qual é a barreira, qual é a decisão e o que
              acontece depois. Não é sobre dificultar o jogo. É sobre mostrar o que já dificulta a rua.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="hidden grid-cols-[36px_1.25fr_1fr_1fr] gap-6 border-b border-ink/25 pb-3 md:grid">
            <span className="mono-label text-[8px] text-muted/60">nº</span>
            <span className="mono-label text-[8px] text-muted/60">obstáculo urbano</span>
            <span className="mono-label text-[8px] text-muted/60">no jogo</span>
            <span className="mono-label text-[8px] text-coral">na cidade que imaginamos</span>
          </div>

          {BARRIERS.map((barrier, index) => (
            <article
              key={barrier.title}
              className="group grid gap-3 border-b border-ink/15 py-5 transition-colors hover:bg-cream/45 md:grid-cols-[36px_1.25fr_1fr_1fr] md:gap-6 md:px-2 md:hover:px-3"
            >
              <span className="mono-label text-[10px] text-coral">0{index + 1}</span>

              <div>
                <h3 className="font-display text-[23px] leading-tight text-ink transition-colors group-hover:text-coral">
                  {barrier.title}
                </h3>
                <p className="mt-1.5 max-w-xs text-[11.5px] leading-relaxed text-muted">{barrier.short}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-coral/25 bg-coral/[0.07] px-2 py-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-coral-deep">
                  consequência · {barrier.consequence}
                </span>
              </div>

              <div className="md:pt-1">
                <p className="mono-label mb-1 text-[7.5px] text-muted/60 md:hidden">no jogo</p>
                <p className="text-[12px] leading-relaxed text-ink/70">{barrier.inGame}</p>
              </div>

              <div className="border-l-2 border-lime/70 pl-3 md:pt-1">
                <p className="mono-label mb-1 text-[7.5px] text-muted/60 md:hidden">na cidade imaginada</p>
                <p className="font-display text-[16.5px] italic leading-snug text-ink/80">{barrier.imagined}</p>
                <span className="mt-1.5 flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-muted/60">
                  <Check className="h-2.5 w-2.5 text-[#6b7a2a]" /> projeto, não sorte
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-end gap-3">
            <div
              className="h-9 w-40 opacity-70 [background-image:radial-gradient(rgba(12,11,9,0.55)_1.7px,transparent_1.7px)] [background-size:11px_11px]"
              aria-hidden
            />
            <span className="mono-label text-[7px] leading-relaxed text-muted/60">
              informação tátil
              <br />
              no chão da calçada
            </span>
          </div>
          <a
            href="#demo"
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-coral"
          >
            <Route className="h-4 w-4" />
            Atravessar essas barreiras
            <ArrowUpRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-8 flex items-start gap-2 rounded-lg border border-ink/15 bg-cream/50 px-4 py-3">
          <Spark className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
          <p className="text-[11.5px] leading-relaxed text-muted">
            <strong className="font-medium text-ink">Referência de projeto:</strong> o jogo não substitui consultoria de
            pessoas cegas. Ele é um convite para perceber o que o desenho urbano comunica — e para quem ele comunica.
          </p>
        </div>
      </div>
    </section>
  );
}


