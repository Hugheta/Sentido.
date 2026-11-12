export type Tile = "#" | "s" | "t" | "a" | "p" | "w" | "x" | "r" | "c" | "g" | "m" | "l" | "f" | "i";

export type Person = { x: number; y: number; name: string; line: string };

export type Level = {
  id: string;
  number: number;
  name: string;
  place: string;
  subtitle: string;
  brief: string;
  objective: string;
  intro: string;
  startNarration: string;
  outro: string;
  lessons: string[];
  ambience: "street" | "avenue" | "market";
  start: { x: number; y: number; angle: number };
  goal: { x: number; y: number; label: string };
  grid: Tile[][];
  people: Person[];
  signal?: { safeMs: number; unsafeMs: number; startUnsafe: boolean };
  accent: string;
};

export const WALL_TILES: Tile[] = ["#", "x", "m", "l", "f"];
export const isWall = (tile: Tile) => WALL_TILES.includes(tile);
export const isHazard = (tile: Tile) => tile === "p" || tile === "w" || tile === "r";
export const isHazardTile = isHazard;

export const TILE_LABEL: Record<Tile, string> = {
  "#": "fachada",
  s: "calçada de concreto",
  t: "piso tátil direcional",
  a: "piso tátil de alerta",
  p: "buraco na calçada",
  w: "poça d'água",
  x: "estrutura de obra",
  r: "pista de carros",
  c: "faixa de pedestres",
  g: "destino",
  m: "banca de rua",
  l: "poste",
  f: "gradil",
  i: "sinal sonoro",
};

export const TILE_SURFACE: Record<Tile, "tactile" | "alert" | "concrete" | "broken" | "puddle" | "asphalt" | "crosswalk" | "beacon"> = {
  "#": "concrete",
  s: "concrete",
  t: "tactile",
  a: "alert",
  p: "broken",
  w: "puddle",
  x: "concrete",
  r: "asphalt",
  c: "crosswalk",
  g: "tactile",
  m: "concrete",
  l: "concrete",
  f: "concrete",
  i: "beacon",
};

class Builder {
  grid: Tile[][];

  constructor(public width: number, public height: number) {
    this.grid = Array.from({ length: height }, () => Array.from({ length: width }, () => "#" as Tile));
  }

  rect(x: number, y: number, w: number, h: number, tile: Tile) {
    for (let iy = y; iy < y + h; iy += 1) {
      for (let ix = x; ix < x + w; ix += 1) {
        if (this.grid[iy] && this.grid[iy][ix] !== undefined) this.grid[iy][ix] = tile;
      }
    }
    return this;
  }

  row(y: number, x0: number, x1: number, tile: Tile) {
    return this.rect(x0, y, x1 - x0 + 1, 1, tile);
  }

  col(x: number, y0: number, y1: number, tile: Tile) {
    return this.rect(x, y0, 1, y1 - y0 + 1, tile);
  }

  set(x: number, y: number, tile: Tile) {
    if (this.grid[y] && this.grid[y][x] !== undefined) this.grid[y][x] = tile;
    return this;
  }

  points(list: Array<[number, number]>, tile: Tile) {
    list.forEach(([x, y]) => this.set(x, y, tile));
    return this;
  }

  build() {
    return this.grid;
  }
}

const aurora = (() => {
  const b = new Builder(25, 30);
  b.rect(7, 24, 12, 4, "s");
  b.rect(9, 6, 8, 19, "s");
  b.rect(5, 15, 15, 4, "s");
  b.rect(8, 3, 10, 4, "s");

  // piso tátil direcional: a espinha dorsal que a prefeitura interrompeu
  b.rect(12, 4, 1, 22, "t");
  b.row(23, 10, 14, "a");
  b.row(5, 10, 14, "a");

  // buraco no meio do piso tátil
  b.set(12, 20, "p");

  // obra sem desvio tátil
  b.rect(11, 17, 4, 1, "x");
  b.set(12, 18, "a");
  b.set(14, 16, "w");
  b.set(10, 16, "w");

  // bancas e postes que estreitam a passagem
  b.set(16, 19, "m");
  b.set(16, 20, "m");
  b.set(9, 15, "m");
  b.set(18, 15, "l");
  b.set(9, 12, "l");
  b.set(16, 12, "f");
  b.set(8, 22, "f");

  b.set(12, 3, "g");

  const grid = b.build();
  return {
    grid,
    people: [
      { x: 15, y: 25, name: "Ana", line: "A padaria fica no fim da rua. Vou até a esquina, posso ir com você." },
      { x: 9, y: 10, name: "Seu José", line: "Tem uma obra depois da praça. Pelo lado direito o chão está inteiro." },
      { x: 15, y: 5, name: "Dona Carmem", line: "A porta da padaria é logo à frente. Está aberta." },
    ],
  };
})();

const boaVista = (() => {
  const b = new Builder(28, 22);
  b.rect(2, 2, 5, 18, "s");
  b.rect(7, 2, 10, 18, "r");
  b.rect(17, 2, 9, 18, "s");

  // faixa de pedestres, única travessia da avenida, com início e fim sinalizados
  b.rect(7, 9, 10, 3, "c");
  b.rect(6, 9, 1, 3, "a");
  b.rect(17, 9, 1, 3, "a");
  b.set(18, 10, "c");
  b.set(19, 10, "c");

  b.col(4, 3, 18, "t");
  b.col(20, 3, 18, "t");

  // banca e placa depois da travessia
  b.rect(19, 6, 1, 2, "m");
  b.set(21, 8, "m");
  b.set(20, 5, "p");
  b.set(20, 6, "a");

  b.set(20, 3, "g");
  b.set(2, 5, "f");
  b.set(2, 15, "f");
  b.set(25, 12, "f");

  return {
    grid: b.build(),
    people: [
      { x: 4, y: 7, name: "Dona Carmem", line: "Estou esperando alguém. Se quiser, atravessamos juntos quando os carros pararem." },
      { x: 4, y: 13, name: "Rafael", line: "Esse farol é só visual. Eu não atravessaria agora." },
      { x: 18, y: 10, name: "Dona Iolanda", line: "Depois da faixa, siga em frente. A banca fica na próxima esquina." },
    ],
  };
})();

const inclusiva = (() => {
  const b = new Builder(27, 26);
  b.rect(8, 3, 11, 20, "s");
  b.rect(3, 17, 21, 5, "s");
  b.rect(4, 4, 19, 8, "s");

  // malha tátil contínua e sinalização sonora
  b.col(13, 4, 21, "t");
  b.row(18, 6, 20, "t");
  b.row(8, 6, 20, "t");
  b.points([[13, 19], [13, 12], [13, 8]], "i");

  // uma única falha, sinalizada antes
  b.set(13, 15, "p");
  b.set(13, 16, "a");
  b.set(11, 18, "x");

  // bancas do mercado
  b.rect(5, 5, 2, 2, "m");
  b.rect(9, 4, 1, 2, "m");
  b.rect(17, 5, 2, 2, "m");
  b.rect(21, 5, 1, 3, "m");
  b.set(13, 3, "g");

  return {
    grid: b.build(),
    people: [
      { x: 10, y: 19, name: "Dona Ivone", line: "A praça toda tem piso tátil. É só seguir o som dos sinos." },
      { x: 16, y: 12, name: "Seu Agenor", line: "A entrada do mercado tem sinal sonoro. Você está quase lá." },
      { x: 11, y: 7, name: "Jade", line: "Vou entrar no mercado também. O portão é à frente." },
    ],
  };
})();

export const LEVELS: Level[] = [
  {
    id: "aurora",
    number: 1,
    name: "A calçada que não avisa",
    place: "Rua da Aurora",
    subtitle: "piso tátil interrompido · obra sem desvio",
    brief:
      "Você saiu de casa e precisa chegar à padaria São Bento. O piso tátil guia os primeiros metros — até acabar sem aviso, no meio de uma obra.",
    objective: "Chegue à porta da padaria São Bento.",
    intro:
      "Fase 1, Rua da Aurora. Sua bengala existe. Os seus olhos, não. A tela é preta: só o que a bengala toca aparece. Siga o piso tátil até a padaria.",
    startNarration:
      "Rua da Aurora. Você está de frente para o norte. O piso tátil começa a dois passos. A bengala revela o chão logo à frente; escute e toque antes de andar.",
    outro:
      "Você chegou à padaria. Trinta passos, três barreiras e nenhuma informação que a calçada tenha oferecido por conta própria.",
    lessons: [
      "O piso tátil acaba antes da obra.",
      "O buraco não tem alerta nem proteção.",
      "Sem o toque, o caminho não existe.",
    ],
    ambience: "street",
    start: { x: 12, y: 27, angle: -Math.PI / 2 },
    goal: { x: 12, y: 3, label: "padaria São Bento" },
    grid: aurora.grid,
    people: aurora.people,
    accent: "#cadb84",
  },
  {
    id: "boavista",
    number: 2,
    name: "O silêncio não é sinal verde",
    place: "Av. Conde da Boa Vista",
    subtitle: "travessia sem sinal sonoro · trânsito contínuo",
    brief:
      "Nove faixas até a outra calçada. O farol não fala. O único sinal possível é a pausa entre os carros — ou a mão de alguém disposto a atravessar junto.",
    objective: "Atravesse a avenida e chegue à banca do Seu Nilo.",
    intro:
      "Fase 2, Avenida Conde da Boa Vista. Você está de frente para o leste, no meio-fio. Não há farol sonoro. Escute o tráfego: quando o ruído abrir, existe uma janela. Também é possível pedir ajuda.",
    startNarration:
      "Avenida Conde da Boa Vista. De frente para o leste. O farol é visual. O ruído dos carros está intenso agora. Espere uma janela de silêncio ou peça ajuda.",
    outro:
      "Você atravessou. Nenhuma placa confirmou que o caminho estava seguro. A única confirmação veio do seu corpo — ou de outra pessoa.",
    lessons: [
      "O verde do farol não chega a quem não vê.",
      "Atravessar exige inferir o trânsito pelo som.",
      "Pedir ajuda é uma alternativa segura, não uma fraqueza.",
    ],
    ambience: "avenue",
    start: { x: 4, y: 10, angle: 0 },
    goal: { x: 20, y: 3, label: "banca do Seu Nilo" },
    grid: boaVista.grid,
    people: boaVista.people,
    signal: { safeMs: 8400, unsafeMs: 5600, startUnsafe: true },
    accent: "#e2553b",
  },
  {
    id: "inclusiva",
    number: 3,
    name: "A cidade dos nossos sonhos",
    place: "Mercado da Encruzilhada",
    subtitle: "malha tátil contínua · sinal sonoro · pessoas",
    brief:
      "O Recife que queremos: piso tátil contínuo, sinos nas entradas e pessoas que não precisam ser heroínas. Atravesse o mercado e chegue ao portão.",
    objective: "Chegue ao portão do Mercado da Encruzilhada.",
    intro:
      "Fase 3, Mercado da Encruzilhada. A tela continua preta. A diferença é o chão: aqui alguém projetou o caminho para ser lido com os pés. Siga os sinos.",
    startNarration:
      "Mercado da Encruzilhada. De frente para o norte. O piso tátil é contínuo e os sinos marcam a entrada. Avance com calma; a bengala confirma o resto.",
    outro:
      "Você chegou ao portão. Desta vez, o único obstáculo foi um buraco: a cidade já sabia que ele estava lá, por isso avisou antes.",
    lessons: [
      "Piso tátil contínuo transforma distância em orientação.",
      "Um aviso sonoro antes do obstáculo muda a decisão.",
      "Informação acessível reduz a dependência de sorte.",
    ],
    ambience: "market",
    start: { x: 13, y: 22, angle: -Math.PI / 2 },
    goal: { x: 13, y: 3, label: "portão do mercado" },
    grid: inclusiva.grid,
    people: inclusiva.people,
    accent: "#cadb84",
  },
];

export function tileAt(level: Level, x: number, y: number): Tile {
  const row = level.grid[y];
  if (!row) return "#";
  return row[x] ?? "#";
}

export function tileCenter(level: Level, x: number, y: number) {
  return { x: x + 0.5, y: y + 0.5, level };
}

export function isValidCell(level: Level, x: number, y: number) {
  return y >= 0 && y < level.grid.length && x >= 0 && x < (level.grid[y]?.length ?? 0);
}

export function floorHeight(level: Level) {
  return level.grid.length;
}
