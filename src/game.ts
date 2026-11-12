export type ActionId = "forward" | "left" | "right" | "interact" | "help";

export type SignalKind = "sound" | "barrier" | "safe" | "person" | "goal";

export type SceneSignal = {
  label: string;
  angle: number;
  radius: number;
  kind: SignalKind;
};

export type Scene = {
  id: string;
  step: string;
  place: string;
  title: string;
  narration: string;
  objective: string;
  audioHint: string;
  atmosphere: string;
  companionNote: string;
  signals: SceneSignal[];
};

export const SCENES: Scene[] = [
  {
    id: "calcada",
    step: "01 / 04",
    place: "Rua da Aurora",
    title: "A calçada que não avisa",
    narration:
      "Você está na Rua da Aurora. O piso tátil termina sem motivo. À frente, a bengala encontra uma placa de cafeteria no meio do caminho. O som de uma padaria indica que o quarteirão continua à direita.",
    objective: "Contorne a placa e alcance a esquina.",
    audioHint: "Padaria a 14 m · placa a 2 passos · trânsito à direita",
    atmosphere: "Passos, conversas distantes e um forno abrindo.",
    companionNote:
      "Na tela do jogo, nada aparece: a pessoa joga pela bengala sonora. Para quem acompanha, este mapa traduz o áudio em posições. A calçada não tem piso tátil; há uma placa comercial ocupando metade da passagem.",
    signals: [
      { label: "padaria", angle: 0.55, radius: 0.68, kind: "sound" },
      { label: "placa", angle: 0.05, radius: 0.36, kind: "barrier" },
      { label: "trânsito", angle: 1.65, radius: 0.82, kind: "barrier" },
      { label: "piso tátil?", angle: -1.32, radius: 0.5, kind: "safe" },
    ],
  },
  {
    id: "travessia",
    step: "02 / 04",
    place: "Cruzamento da Aurora",
    title: "O silêncio não é sinal verde",
    narration:
      "Você chega à guia. Este cruzamento não tem sinal sonoro. Carros passam da esquerda para a direita. Escute a pausa entre eles antes de qualquer passo. Não existe um som que diga quando é seguro.",
    objective: "Atravesse quando houver uma janela de silêncio.",
    audioHint: "Carros da esquerda · sem sinal sonoro · janela de 6 s",
    atmosphere: "Motores em duas direções, uma buzina ao longe, vento.",
    companionNote:
      "O semáforo é visual. Pessoas cegas precisam inferir o momento da travessia pelo ruído dos carros. No mapa, as linhas vermelhas mostram o fluxo que cruza o caminho.",
    signals: [
      { label: "carro", angle: -1.55, radius: 0.86, kind: "barrier" },
      { label: "carro", angle: -1.05, radius: 0.7, kind: "barrier" },
      { label: "motoboy", angle: 1.25, radius: 0.78, kind: "sound" },
      { label: "outra calçada", angle: 0.02, radius: 0.92, kind: "goal" },
    ],
  },
  {
    id: "andaime",
    step: "03 / 04",
    place: "Rua da Penha",
    title: "A cidade em obra",
    narration:
      "O piso tátil termina em uma obra. Um andaime ocupa a calçada e há poças profundas no centro. A bengala sente concreto quebrado. Um vão estreito existe à direita, mas só o toque revela o caminho seguro.",
    objective: "Encontre o vão seguro e reencontre o piso tátil.",
    audioHint: "Andaime metálico · poça adiante · vão à direita",
    atmosphere: "Ferramentas, água caindo, um rádio dentro de uma loja.",
    companionNote:
      "O espaço seguro existe, mas não está sinalizado. A pessoa precisa mapear o obstáculo com a bengala, no meio do ruído da obra. Um ambiente bem projetado teria um desvio tátil.",
    signals: [
      { label: "andaime", angle: -0.5, radius: 0.56, kind: "barrier" },
      { label: "poça", angle: 0.02, radius: 0.7, kind: "barrier" },
      { label: "vão seguro", angle: 0.85, radius: 0.45, kind: "safe" },
      { label: "rádio", angle: 2.6, radius: 0.8, kind: "sound" },
    ],
  },
  {
    id: "mercado",
    step: "04 / 04",
    place: "Mercado da Encruzilhada",
    title: "Um destino, quatro barreiras",
    narration:
      "À frente, vozes, caixas e cheiro de fruta. É a feira. O piso tátil segue contínuo até a entrada do mercado. Depois de vinte e três minutos, você reconhece o destino antes mesmo de chegar.",
    objective: "Chegue à entrada do mercado.",
    audioHint: "Feira a 20 m · piso tátil contínuo · gente por todos os lados",
    atmosphere: "Vozes, caixas de madeira, faca no ritmo da conversa.",
    companionNote:
      "Um trecho contínuo de piso tátil muda o final da história: sem ele, o destino seria só mais um lugar fora de alcance. O mapa mostra um caminho reto e legível.",
    signals: [
      { label: "feira", angle: 0.02, radius: 0.82, kind: "goal" },
      { label: "piso tátil", angle: 0.02, radius: 0.5, kind: "safe" },
      { label: "vozes", angle: -0.8, radius: 0.66, kind: "sound" },
      { label: "vozes", angle: 0.85, radius: 0.7, kind: "sound" },
    ],
  },
];

export type Tone = "good" | "warn" | "neutral";

export type ActionResult = {
  message: string;
  detail: string;
  tone: Tone;
  autonomy: number;
  seconds: number;
  scanned: boolean;
  helped: boolean;
  advance: boolean;
  finish: boolean;
  cue: "scan" | "step" | "bump" | "car" | "help" | "arrive" | "safe";
};

type Context = { scanned: boolean };

export function resolveAction(sceneIndex: number, action: ActionId, ctx: Context): ActionResult {
  const base: ActionResult = {
    message: "",
    detail: "",
    tone: "neutral",
    autonomy: 0,
    seconds: 0,
    scanned: ctx.scanned,
    helped: false,
    advance: false,
    finish: false,
    cue: "step",
  };

  if (sceneIndex === 0) {
    if (action === "interact") {
      return {
        ...base,
        message:
          "A bengala percorre o chão. A placa de café ocupa metade da calçada; há um vão de 60 cm à esquerda. O piso tátil sumiu há dez passos.",
        detail: "Varredura concluída · caminho estreito identificado",
        tone: "good",
        autonomy: 5,
        seconds: 8,
        scanned: true,
        cue: "scan",
      };
    }
    if (action === "left") {
      return {
        ...base,
        message: ctx.scanned
          ? "O corpo contorna a placa pela esquerda. À frente, a padaria canta o caminho. Um passo longo e você está na esquina."
          : "Você desvia por instinto e sente o piso tátil sob os pés. Ele existe por dois metros, depois some de novo.",
        detail: ctx.scanned ? "Posição segura à esquerda" : "Piso tátil encontrado por acaso",
        tone: "good",
        autonomy: 4,
        seconds: 7,
        scanned: true,
        cue: "safe",
      };
    }
    if (action === "right") {
      return {
        ...base,
        message:
          "O passo à direita encontra a guia da calçada. Você recua. O ruído do trânsito fica mais perto. Melhor escutar antes de decidir.",
        detail: "Você está na borda · sem piso tátil de alerta",
        tone: "warn",
        autonomy: -6,
        seconds: 5,
        scanned: ctx.scanned,
        cue: "bump",
      };
    }
    if (action === "help") {
      return {
        ...base,
        message: ctx.scanned
          ? "Uma pessoa que esperava o ônibus confirma: “O piso recomeça depois da placa, à esquerda.” Você agradece e segue."
          : "“Tem uma placa no meio do caminho”, avisa alguém que esperava o ônibus. “Vem, o piso tátil recomeça ali.” Você agradece.",
        detail: "Ajuda recebida · uma pessoa, não uma placa",
        tone: "good",
        autonomy: 2,
        seconds: 22,
        scanned: true,
        helped: true,
        cue: "help",
      };
    }
    if (ctx.scanned) {
      return {
        ...base,
        message:
          "Com a bengala à frente, você contorna a placa. O som da padaria cresce à direita. A calçada termina na esquina.",
        detail: "Esquina alcançada · obstáculo contornado",
        tone: "good",
        autonomy: 8,
        seconds: 12,
        scanned: true,
        advance: true,
        cue: "safe",
      };
    }
    return {
      ...base,
      message:
        "Você segue o som e esbarra na placa de café. O susto interrompe o passo. Sem ferimentos — mas o caminho pediu informação que a calçada não deu.",
      detail: "Obstáculo não sinalizado · recomece com o toque",
      tone: "warn",
      autonomy: -10,
      seconds: 14,
      scanned: false,
      cue: "bump",
    };
  }

  if (sceneIndex === 1) {
    if (action === "interact") {
      return {
        ...base,
        message:
          "Você para e escuta. Dois carros passam da esquerda para a direita. Então, um intervalo de silêncio. A bengala toca a guia: há dez passos até o outro lado.",
        detail: "Janela de silêncio estimada em 6 segundos",
        tone: "good",
        autonomy: 4,
        seconds: 9,
        scanned: true,
        cue: "scan",
      };
    }
    if (action === "left" || action === "right") {
      return {
        ...base,
        message:
          "Você dá um passo lateral, ainda na guia. O motor de um carro estacionado ronca. O lugar não oferece mais informação. Toque o chão e escute antes de avançar.",
        detail: "Posição ajustada · nenhuma faixa tátil",
        tone: "warn",
        autonomy: -2,
        seconds: 4,
        scanned: ctx.scanned,
        cue: "car",
      };
    }
    if (action === "help") {
      return {
        ...base,
        message:
          "Alguém para ao seu lado. “Vou atravessar junto. Segura no meu braço.” Vocês caminham em silêncio, desviando de um buraco no meio. Dezoito segundos.",
        detail: "Travessia concluída com apoio",
        tone: "good",
        autonomy: 4,
        seconds: 26,
        scanned: true,
        helped: true,
        advance: true,
        cue: "help",
      };
    }
    if (ctx.scanned) {
      return {
        ...base,
        message:
          "No intervalo entre os carros, você atravessa em linha reta. A bengala encontra o meio-fio do outro lado. Você chegou ao outro lado, mas não houve nenhum sinal de que era seguro.",
        detail: "Travessia feita por inferência sonora",
        tone: "good",
        autonomy: 7,
        seconds: 13,
        scanned: true,
        advance: true,
        cue: "safe",
      };
    }
    return {
      ...base,
      message:
        "Você dá um passo e uma buzina corta o ar. Um carro freia perto. Você recua, o coração acelerado. Este cruzamento não foi projetado para ser atravessado sem enxergar.",
      detail: "Quase colisão · a pausa agora está mais clara",
      tone: "warn",
      autonomy: -18,
      seconds: 16,
      scanned: true,
      cue: "car",
    };
  }

  if (sceneIndex === 2) {
    if (action === "interact") {
      return {
        ...base,
        message:
          "A bengala encontra o fim do piso tátil e um andaime a um passo. Poças bloqueiam o centro. À direita, junto à guia, existe um vão estreito de concreto contínuo.",
        detail: "Mapa tátil concluído · vão seguro à direita",
        tone: "good",
        autonomy: 5,
        seconds: 10,
        scanned: true,
        cue: "scan",
      };
    }
    if (action === "left") {
      return {
        ...base,
        message:
          "À esquerda está o andaime. Um trabalhador avisa: “Por aqui não.” O metal responde ao toque. Você ainda não sabe o tamanho do desvio.",
        detail: "Passagem bloqueada · vão à direita",
        tone: "warn",
        autonomy: -3,
        seconds: 7,
        scanned: ctx.scanned,
        cue: "bump",
      };
    }
    if (action === "right") {
      if (ctx.scanned) {
        return {
          ...base,
          message:
            "Você desliza a bengala pelo vão à direita. Concreto firme até o fim da obra. Do outro lado, o piso tátil recomeça como se nada tivesse acontecido.",
          detail: "Percurso seguro à direita · corpo posicionado",
          tone: "good",
          autonomy: 5,
          seconds: 9,
          scanned: true,
          cue: "safe",
        };
      }
      return {
        ...base,
        message:
          "Você desce o meio-fio sem perceber. O som dos carros aumenta de repente. Você para, planta os pés e toca o chão. A informação vem tarde.",
        detail: "Meio-fio não percebido · retorne ao centro",
        tone: "warn",
        autonomy: -8,
        seconds: 12,
        scanned: false,
        cue: "bump",
      };
    }
    if (action === "help") {
      return {
        ...base,
        message:
          "Um comerciante larga a cadeira e oferece o braço. “Vem, eu conheço esse buraco.” Vocês desviam juntos do andaime e das poças. Ele volta para a loja.",
        detail: "Desvio guiado por quem conhece o lugar",
        tone: "good",
        autonomy: 3,
        seconds: 30,
        scanned: true,
        helped: true,
        advance: true,
        cue: "help",
      };
    }
    if (ctx.scanned) {
      return {
        ...base,
        message:
          "Você contorna o andaime pelo vão, tocando cada obstáculo antes de passar. A poça molha a ponta do sapato. Depois de cinco passos, o piso tátil retorna.",
        detail: "Obra atravessada · piso tátil recuperado",
        tone: "good",
        autonomy: 6,
        seconds: 16,
        scanned: true,
        advance: true,
        cue: "safe",
      };
    }
    return {
      ...base,
      message:
        "A bengala prende em um vergalhão do andaime. Você tropeça e para. O desvio existe, mas só o toque lento vai encontrá-lo.",
      detail: "Obstáculo de obra · toque o entorno",
      tone: "warn",
      autonomy: -12,
      seconds: 15,
      scanned: false,
      cue: "bump",
    };
  }

  if (action === "forward") {
    return {
      ...base,
      message:
        "Você avança os últimos passos. O piso tátil termina exatamente na porta do mercado. Vozes, caixas, fruta. Você chegou — e não foi por sorte.",
      detail: "Destino alcançado · quatro barreiras atravessadas",
      tone: "good",
      autonomy: 9,
      seconds: 18,
      scanned: true,
      advance: true,
      finish: true,
      cue: "arrive",
    };
  }
  if (action === "help") {
    return {
      ...base,
        message:
          "“A porta é logo ali”, diz alguém que sai com uma sacola. Você recebe companhia nos últimos passos. O caminho termina no balcão certo.",
      detail: "Destino alcançado com apoio",
      tone: "good",
      autonomy: 2,
      seconds: 24,
      scanned: true,
      helped: true,
      advance: true,
      finish: true,
      cue: "help",
    };
  }
  if (action === "interact") {
    return {
      ...base,
      message:
        "Você para e escuta: vozes, caixas, cheiro de fruta. A bengala encontra seis faixas de piso tátil contínuas até a entrada. Este é o primeiro trecho do caminho que foi projetado para você.",
      detail: "Piso tátil contínuo · entrada a seis passos",
      tone: "good",
      autonomy: 4,
      seconds: 8,
      scanned: true,
      cue: "scan",
    };
  }
  return {
    ...base,
    message:
      "Você ajusta o corpo na direção do som. A feira está logo à frente. O piso tátil não mente: siga em frente.",
    detail: "Destino a poucos passos",
    tone: "neutral",
    autonomy: 0,
    seconds: 5,
    scanned: ctx.scanned,
    cue: "step",
  };
}
