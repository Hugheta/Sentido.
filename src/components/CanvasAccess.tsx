import { ArrowRight, ArrowUpRight, Check, Headphones, LogoMark, Play, Scan, Spark, Users, Vibrate, Voice } from "./Icons";

const CANVAS_FIELDS = [
  {
    number: "01",
    label: "situação urbana",
    text: "Recife, no trajeto de casa até o mercado. A cidade oferece sons, mas pouca informação acessível.",
  },
  {
    number: "02",
    label: "pessoas e barreiras",
    text: "Pessoas cegas ou com baixa visão. Calçadas sem piso tátil, travessias silenciosas e obstáculos sem aviso.",
  },
  {
    number: "03",
    label: "pergunta do jogo",
    text: "O que queremos que a pessoa perceba? Que a falta de sinalização transforma uma tarefa simples em um desafio de confiança.",
  },
  {
    number: "04",
    label: "escolha 1",
    text: "Continuar pelo som e tocar o chão antes de cada passo.",
    decision: "decisão",
    consequence: "O avanço exige atenção constante. O cansaço aumenta.",
  },
  {
    number: "05",
    label: "escolha 2",
    text: "Atravessar seguindo o silêncio entre os carros.",
    decision: "decisão",
    consequence: "Pode se perder ou ser surpreendida por um carro.",
  },
  {
    number: "06",
    label: "regras e objetivo",
    text: "Sair de casa e chegar ao mercado. Cada decisão gasta autonomia e tempo. Pedir ajuda é uma escolha, não uma derrota.",
  },
  {
    number: "07",
    label: "interação tecnológica",
    text: "Cinco botões: avançar, esquerda, direita, interagir e pedir ajuda. Áudio binaural, voz e vibração.",
  },
  {
    number: "08",
    label: "acesso à experiência",
    text: "Narração em pt-BR, legendas sensoriais, alto contraste e nenhuma informação essencial depende só da cor, da luz ou do som.",
  },
];

const ACCESS_ITEMS = [
  "Narração em voz alta e legendas sensoriais em todas as cenas.",
  "Nenhuma ação essencial depende só de cor ou posição na tela.",
  "Cinco botões com rótulo textual, teclado e área de toque.",
  "Vibração como reforço, nunca como única resposta.",
  "Compatível com zoom, leitor de tela e movimento reduzido.",
  "Sem cronômetro punitivo: tempo é informação, não game over.",
];

const ROADMAP = [
  ["01", "Ouvir quem joga", "Sessões de teste com pessoas cegas e com baixa visão antes de qualquer nova fase."],
  ["02", "Áudio de verdade", "Gravações de rua em ambientes reais e áudio espacial em vez de sons sintetizados."],
  ["03", "Háptica no bolso", "Padrões de vibração que indiquem meio-fio, obstáculo e direção segura."],
  ["04", "Mapa colaborativo", "Um mapa sonoro da cidade construído por quem atravessa a cidade todos os dias."],
];

export function CanvasSection() {
  return (
    <section id="canvas" className="relative scroll-mt-24 overflow-hidden bg-cream py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-paper/70 to-transparent" />
      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="mono-label text-coral">04 / o canvas</span>
            <span className="h-px w-16 bg-ink/20" />
            <span className="mono-label text-muted">recife em jogo</span>
          </div>
          <span className="mono-label flex items-center gap-1.5 text-muted">
            <Spark className="h-2.5 w-2.5 text-coral" /> protótipo make · cidade inclusiva
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.9] tracking-[-0.02em]">
              O papel virou jogo.
              <br />
              O jogo virou <span className="italic text-coral">pergunta</span>.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[14px] leading-relaxed text-muted">
              Estes são os oito campos que tiraram o <em className="not-italic font-medium text-ink">Sentido</em> do
              papel e o colocaram na rua — mais a nona pergunta, que ainda está em branco. O canvas original foi
              preenchido à mão pela equipe; aqui, a versão digitada mantém as escolhas e o que cada uma provoca.
            </p>
          </div>
        </div>

        <div className="relative mt-10">
          <span className="absolute -top-2 left-6 z-20 h-5 w-24 rotate-[-2deg] bg-[#d9c9a1]/80 shadow-sm sm:left-12" aria-hidden />
          <span className="absolute -top-2 right-6 z-20 h-5 w-24 rotate-[2deg] bg-[#d9c9a1]/80 shadow-sm sm:right-12" aria-hidden />

          <div className="paper-edge relative overflow-hidden rounded-sm border border-ink/25 bg-[#f5f0e4]">
            <div className="relative overflow-hidden border-b border-ink/20 bg-[#2b2a27] px-4 py-4 text-cream sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-cream/35">ficha de criação</span>
                  <span className="hidden h-3 w-px bg-cream/20 sm:block" />
                  <h3 className="font-display text-xl tracking-[0.01em] sm:text-2xl">RECIFE EM JOGO:</h3>
                </div>
                <span className="rounded-full bg-coral px-3 py-1.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-white">
                  canvas de criação
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.1em] text-cream/35">
                protótipo make para imaginar uma cidade mais inclusiva
              </p>
              <div className="pointer-events-none absolute -bottom-8 -right-4 font-display text-8xl italic text-cream/[0.03]">
                cidade
              </div>
            </div>

            <div className="grid gap-px bg-ink/15 border-b border-ink/20 sm:grid-cols-3">
              {[
                ["equipe", "Sentido · 5 pessoas"],
                ["nome do jogo", "Sentido"],
                ["suporte", "browser · áudio + toque"],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#f5f0e4] px-4 py-3">
                  <p className="mono-label text-[7px] text-muted/70">{label}</p>
                  <p className="mt-1 font-display text-[16px] italic leading-tight text-ink/80">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
              {CANVAS_FIELDS.map((field) => (
                <div key={field.number} className="group relative bg-[#f5f0e4] px-4 py-4 transition-colors hover:bg-[#f8f4ea] sm:px-5 sm:py-5">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-[3px] rounded-full bg-coral" />
                    <span className="mono-label text-[7.5px] text-coral">0{field.number.slice(-1)}</span>
                    <span className="mono-label text-[7.5px] text-muted/65">{field.label}</span>
                  </div>
                  {field.decision && <p className="mono-label mt-3 text-[6.5px] text-muted/50">{field.decision}</p>}
                  <p className="mt-1.5 font-display text-[17px] italic leading-[1.3] text-ink/85">{field.text}</p>
                  {field.consequence && (
                    <>
                      <p className="mono-label mt-3 text-[6.5px] text-muted/50">consequência</p>
                      <p className="mt-0.5 border-l border-coral/40 pl-2 text-[11.5px] leading-relaxed text-ink/60">
                        {field.consequence}
                      </p>
                    </>
                  )}
                  <span className="pointer-events-none absolute bottom-2 right-3 font-mono text-[7px] tracking-[0.1em] text-ink/15">
                    {field.number} / 08
                  </span>
                </div>
              ))}
              <div className="relative flex min-h-[160px] flex-col justify-between overflow-hidden bg-ink px-5 py-5 text-cream">
                <div className="flex items-center justify-between">
                  <span className="mono-label text-[7px] text-lime">o nono campo</span>
                  <Spark className="h-3 w-3 text-coral" />
                </div>
                <p className="mt-5 font-display text-[24px] leading-[0.98]">
                  Projetar
                  <br />
                  <span className="italic text-lime">com quem</span>
                  <br />
                  atravessa.
                </p>
                <p className="mt-4 font-mono text-[7px] uppercase leading-relaxed tracking-[0.07em] text-cream/35">
                  próxima pergunta · ainda em branco
                </p>
                <span className="pointer-events-none absolute -bottom-4 -right-2 font-display text-7xl italic text-cream/[0.05]">
                  09
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 bg-[#eee7d8] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                <span className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-muted">
                  feito no recife · uma pergunta de cada vez
                </span>
              </div>
              <span className="font-display text-base italic text-ink/40">Sentido, 2026.</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="max-w-lg text-[11.5px] leading-relaxed text-muted">
              O protótipo acima é uma adaptação digital do canvas. As respostas foram organizadas para o site e não
              substituem o material original da equipe.
            </p>
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.08em] text-ink/70 hover:text-coral"
            >
              ver o canvas em movimento
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AccessSection() {
  return (
    <section id="acesso" className="scroll-mt-24 border-t border-ink/10 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="flex items-center gap-3">
          <span className="mono-label text-coral">05 / acesso à experiência</span>
          <span className="h-px w-16 bg-ink/20" />
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,5.1vw,4.4rem)] leading-[0.9] tracking-[-0.02em]">
              Se a informação
              <br />
              depende de um sentido
              <br />
              só, o jogo <span className="italic text-coral">falha</span>.
            </h2>
            <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-muted">
              Acessibilidade não é um modo extra. É a estrutura do jogo. Cada cena pode ser compreendida por áudio,
              texto e toque — e o mapa visual é uma camada de apoio, nunca a única fonte de resposta.
            </p>

            <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {ACCESS_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink/25 text-ink/70">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  <span className="text-[12px] leading-relaxed text-ink/70">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                [Scan, "teclado + toque"],
                [Voice, "narração pt-BR"],
                [Vibrate, "háptica opcional"],
                [Users, "ajuda como mecânica"],
              ].map(([Icon, label]) => {
                const TagIcon = Icon as typeof Scan;
                return (
                  <span key={label as string} className="flex items-center gap-1.5 rounded-full border border-ink/20 bg-cream/60 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.06em] text-muted">
                    <TagIcon className="h-3 w-3 text-coral" /> {label as string}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl border border-ink bg-ink p-5 text-cream sm:p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-lime/15" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-lime/10" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="mono-label text-lime">manual de bolso</span>
                  <Headphones className="h-4 w-4 text-cream/30" />
                </div>
                <h3 className="mt-3 font-display text-[30px] leading-[0.95]">
                  Jogue com
                  <br />
                  os ouvidos<span className="text-coral">.</span>
                </h3>
                <p className="mt-3 max-w-sm text-[12px] leading-relaxed text-cream/50">
                  A tela pode ficar preta. O som continua sendo o mapa. Três coisas ajudam antes do primeiro passo:
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    ["01", "Use fones", "A esquerda e a direita carregam direções diferentes."],
                    ["02", "Escute antes", "Cada cena narra o ambiente. Não há pressa."],
                    ["03", "Decida", "Avançar, deslocar, tocar o entorno ou pedir ajuda."],
                  ].map(([number, title, text]) => (
                    <div key={number} className="flex gap-3 border-t border-cream/10 pt-3">
                      <span className="mono-label text-[8px] text-coral">{number}</span>
                      <div>
                        <p className="text-[12.5px] font-medium text-cream/85">{title}</p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-cream/40">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#demo"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-4 py-3 text-[13px] font-medium text-ink transition-colors hover:bg-white"
                >
                  <Play className="h-2.5 w-2.5" /> Abrir o protótipo
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </a>
                <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-[0.07em] text-cream/25">
                  você pode desligar o mapa visual a qualquer momento
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-ink/20 pt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="mono-label text-muted">próximos passos</span>
            <span className="font-display text-sm italic text-ink/35">um protótipo nunca está pronto</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map(([number, title, text]) => (
              <div key={number} className="border-l border-ink/20 pl-3">
                <span className="mono-label text-[8px] text-coral">{number}</span>
                <h4 className="mt-1.5 font-display text-lg leading-tight text-ink/85">{title}</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FooterCta() {
  return (
    <footer className="relative overflow-hidden bg-ink pb-8 pt-20 text-cream md:pt-28">
      <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-coral/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[320px] w-[320px] rounded-full border border-lime/10" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="mono-label flex items-center gap-2 text-coral">
              <Spark className="h-2.5 w-2.5" /> a cidade que queremos
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
            <p className="max-w-sm text-[14px] leading-relaxed text-cream/50">
              Sentido é um protótipo sobre chegar ao destino sem enxergar o caminho. Jogue com fones. Repare no que
              falta. Leve a pergunta para a próxima calçada.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href="#demo"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-coral px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-deep"
              >
                <Play className="h-2.5 w-2.5" /> Jogar a demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#canvas"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/20 px-5 py-3 text-sm text-cream/75 transition-colors hover:border-cream/50 hover:text-cream"
              >
                Rever o canvas
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-cream/15 pt-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="mono-label flex items-center gap-2 text-cream/50">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" /> protótipo jogável
            </span>
            <span className="mono-label text-cream/25">05 botões</span>
            <span className="mono-label text-cream/25">04 barreiras</span>
            <span className="mono-label text-cream/25">01 cidade possível</span>
          </div>
          <span className="font-display text-[18px] italic text-cream/40">“A tela é preta. O caminho, não.”</span>
        </div>

        <div className="mt-14 grid gap-10 border-t border-cream/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#topo" className="group inline-flex items-center gap-2.5">
              <LogoMark className="h-8 w-8 text-cream transition-colors group-hover:text-lime" />
              <span className="flex flex-col">
                <span className="font-display text-2xl leading-none">
                  sentido<span className="text-coral">.</span>
                </span>
                <span className="mono-label mt-1 text-[6px] text-cream/35">recife em jogo</span>
              </span>
            </a>
            <p className="mt-4 max-w-[210px] text-[11.5px] leading-relaxed text-cream/40">
              Um jogo de navegação sensorial sobre uma cidade que ainda não foi desenhada para todos.
            </p>
          </div>

          <div>
            <p className="mono-label text-[8px] text-cream/30">navegue</p>
            <nav className="mt-3 flex flex-col gap-2 text-[12px] text-cream/55" aria-label="Navegação do rodapé">
              {[
                ["O jogo", "#jogo"],
                ["Protótipo", "#demo"],
                ["Barreiras", "#barreiras"],
                ["O canvas", "#canvas"],
                ["Acesso", "#acesso"],
              ].map(([label, href]) => (
                <a key={label} href={href} className="w-fit transition-colors hover:text-lime">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="mono-label text-[8px] text-cream/30">o projeto</p>
            <nav className="mt-3 flex flex-col gap-2 text-[12px] text-cream/55" aria-label="Sobre o projeto">
              <a href="#canvas" className="w-fit transition-colors hover:text-lime">Recife em Jogo · Make</a>
              <a href="#acesso" className="w-fit transition-colors hover:text-lime">Acessibilidade</a>
              <a href="#demo" className="w-fit transition-colors hover:text-lime">Como jogar</a>
              <a href="#barreiras" className="w-fit transition-colors hover:text-lime">Referências urbanas</a>
            </nav>
          </div>

          <div>
            <p className="mono-label text-[8px] text-cream/30">contato da equipe</p>
            <p className="mt-3 max-w-[220px] font-display text-[21px] italic leading-tight text-cream/70">
              Uma equipe de cinco pessoas e uma pergunta em comum.
            </p>
            <a
              href="mailto:equipe.sentido@recife.br"
              className="mt-4 inline-flex items-center gap-1.5 border-b border-cream/25 pb-1 text-[11.5px] text-cream/60 transition-colors hover:border-lime hover:text-lime"
            >
              equipe.sentido@recife.br <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-cream/10 pt-4 sm:flex-row sm:items-center">
          <p className="font-mono text-[8px] uppercase tracking-[0.06em] text-cream/25">
            sentido © 2026 · feito no recife, para ser sentido
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="#acesso" className="font-mono text-[8px] uppercase tracking-[0.06em] text-cream/30 transition-colors hover:text-cream/70">
              declaração de acessibilidade
            </a>
            <a href="#topo" className="font-mono text-[8px] uppercase tracking-[0.06em] text-cream/30 transition-colors hover:text-cream/70">
              voltar ao topo ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
