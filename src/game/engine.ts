import { GameAudio, type Surface } from "./audio";
import { isWall, tileAt, TILE_LABEL, TILE_SURFACE, type Level, type Tile } from "./levels";

export type Action = "forward" | "left" | "right" | "cane" | "help";

export type Stats = {
  autonomy: number;
  time: number;
  steps: number;
  collisions: number;
  helps: number;
  detections: number;
  nearby: boolean;
  assisted: boolean;
  signalSafe: boolean | null;
};

export type GameEvent =
  | { type: "caption"; text: string }
  | { type: "stats"; stats: Stats }
  | {
      type: "punish";
      title: string;
      detail: string;
      consequence: string;
      loss: number;
      time: number;
      autonomy: number;
    }
  | { type: "complete"; stats: Stats }
  | { type: "signal"; safe: boolean }
  | { type: "nearby"; nearby: boolean };

const TAU = Math.PI * 2;
const FOV = (66 * Math.PI) / 180;

const CARDINALS: Array<{ dir: string; angle: number }> = [
  { dir: "leste", angle: 0 },
  { dir: "sul", angle: Math.PI / 2 },
  { dir: "oeste", angle: Math.PI },
  { dir: "norte", angle: -Math.PI / 2 },
];

function normalizeAngle(value: number) {
  return ((value % TAU) + TAU) % TAU;
}

function snapDir(angle: number) {
  const norm = normalizeAngle(angle);
  const snapped = Math.round(norm / (Math.PI / 2)) % 4;
  switch (snapped) {
    case 0:
      return { dx: 1, dy: 0 };
    case 1:
      return { dx: 0, dy: 1 };
    case 2:
      return { dx: -1, dy: 0 };
    default:
      return { dx: 0, dy: -1 };
  }
}

export class GameEngine {
  level: Level;
  private audio: GameAudio;
  private emit: (event: GameEvent) => void;

  gx: number;
  gy: number;
  px: number;
  py: number;
  angle: number;
  private targetAngle: number;
  private moving: { fromX: number; fromY: number; toX: number; toY: number; t: number; duration: number; tile: Tile } | null = null;

  autonomy = 100;
  time = 0;
  steps = 0;
  collisions = 0;
  helps = 0;
  detections = 0;
  assisted = 0;
  signalClock = 0;
  signalSafe = true;
  crossingGrace = 0;
  laneProgress = 0;

  private checkpoint: { x: number; y: number; angle: number };
  private trail: Array<{ x: number; y: number }> = [];
  private started = false;
  paused = false;
  finished = false;
  private scanAge = -1;
  private scanDuration = 1;
  private scanRadius = 4;
  private canePhase = 0;
  private caneKick = 0;
  private shake = 0;
  private lastStatsEmit = 0;
  private lastNearby = false;
  private lastCaption = "";
  private lastTraffic = 0;
  private lastSignalCue = 0;

  constructor(level: Level, audio: GameAudio, emit: (event: GameEvent) => void) {
    this.level = level;
    this.audio = audio;
    this.emit = emit;
    this.gx = level.start.x;
    this.gy = level.start.y;
    this.px = level.start.x + 0.5;
    this.py = level.start.y + 0.5;
    this.angle = level.start.angle;
    this.targetAngle = level.start.angle;
    this.checkpoint = { x: this.gx, y: this.gy, angle: this.angle };
    if (level.signal) {
      this.signalSafe = level.signal.startUnsafe ? false : true;
    }
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.audio.startAmbience(this.level.ambience);
    this.triggerScan(6.2, 2.4);
    this.caption(this.level.startNarration, true);
    this.emitStats(true);
    if (this.level.signal) {
      this.signalSafe = !this.level.signal.startUnsafe;
      this.emit({ type: "signal", safe: this.signalSafe });
    }
  }

  destroy() {
    this.audio.stopAmbience();
    this.audio.stopSpeech();
  }

  stats(): Stats {
    return {
      autonomy: this.autonomy,
      time: this.time,
      steps: this.steps,
      collisions: this.collisions,
      helps: this.helps,
      detections: this.detections,
      nearby: this.nearbyPerson() !== null,
      assisted: this.assisted > 0,
      signalSafe: this.level.signal ? this.signalSafe : null,
    };
  }

  private emitStats(force = false) {
    if (!force && this.time - this.lastStatsEmit < 0.4) return;
    this.lastStatsEmit = this.time;
    this.emit({ type: "stats", stats: this.stats() });
    const nearby = this.nearbyPerson() !== null;
    if (nearby !== this.lastNearby) {
      this.lastNearby = nearby;
      this.emit({ type: "nearby", nearby });
    }
  }

  private caption(text: string, speak = false) {
    if (text === this.lastCaption) return;
    this.lastCaption = text;
    this.emit({ type: "caption", text });
    if (speak) this.audio.speak(text);
  }

  private triggerScan(radius: number, duration: number) {
    this.scanAge = 0;
    this.scanRadius = radius;
    this.scanDuration = duration;
    this.caneKick = 1;
  }

  private currentTile(): Tile {
    return tileAt(this.level, this.gx, this.gy);
  }

  private tileAhead(distance = 1): Tile {
    const { dx, dy } = snapDir(this.angle);
    return tileAt(this.level, this.gx + dx * distance, this.gy + dy * distance);
  }

  input(action: Action) {
    if (!this.started || this.finished || this.paused) return;
    switch (action) {
      case "forward":
        this.forward();
        break;
      case "left":
        this.turn(-1);
        break;
      case "right":
        this.turn(1);
        break;
      case "cane":
        this.useCane();
        break;
      case "help":
        this.askHelp();
        break;
      default:
        break;
    }
    this.emitStats();
  }

  private turn(direction: -1 | 1) {
    if (this.moving) return;
    this.targetAngle = normalizeAngle(this.targetAngle + (direction * Math.PI) / 2);
    this.audio.step(TILE_SURFACE[this.currentTile()] ?? "concrete");
    this.audio.vibrate(8);
    const next = CARDINALS.reduce((best, item) => {
      const target = normalizeAngle(this.targetAngle);
      const current = Math.abs(normalizeAngle(item.angle) - target);
      const bestCurrent = Math.abs(normalizeAngle(best.angle) - target);
      return Math.min(current, TAU - current) < Math.min(bestCurrent, TAU - bestCurrent) ? item : best;
    }, CARDINALS[0]);
    this.caption(`Você gira para a ${direction === -1 ? "esquerda" : "direita"}. Agora está de frente para o ${next.dir}.`);
    if (this.nearbyPerson()) this.emitStats(true);
  }

  private forward() {
    if (this.moving) return;
    const { dx, dy } = snapDir(this.angle);
    const nx = this.gx + dx;
    const ny = this.gy + dy;
    const tile = tileAt(this.level, nx, ny);

    if (isWall(tile)) {
      this.bump(tile);
      return;
    }

    const hazardReason = this.hazardFor(tile);
    if (hazardReason) {
      this.punish(hazardReason);
      return;
    }

    this.moving = {
      fromX: this.px,
      fromY: this.py,
      toX: nx + 0.5,
      toY: ny + 0.5,
      t: 0,
      duration: 0.24,
      tile,
    };
    this.gx = nx;
    this.gy = ny;
    this.steps += 1;
    this.detections += 1;
    this.trail.push({ x: nx, y: ny });
    if (this.trail.length > 400) this.trail.shift();
    this.audio.step(TILE_SURFACE[tile] ?? "concrete");
    this.audio.vibrate(10);
    this.triggerScan(3.4, 1.35);

    if (tile === "c" && this.level.signal) {
      this.laneProgress = this.currentTile() === "c" ? this.laneProgress + 1 : 1;
      if (this.signalSafe || this.assisted > 0) {
        this.crossingGrace = 8;
        this.caption(
          "Você começa a atravessar. A faixa está livre pelos próximos passos; siga em frente sem parar no meio.",
          true,
        );
      }
    }
    if ((this.currentTile() === "a" || this.currentTile() === "c") && this.signalSafe) {
      this.crossingGrace = Math.max(this.crossingGrace, 12);
    }

    if (tile === "t" || tile === "s" || tile === "a" || tile === "i") {
      this.checkpoint = { x: nx, y: ny, angle: this.angle };
    }
    if (tile !== "c") this.laneProgress = 0;
    this.emitStats();
  }

  private hazardFor(tile: Tile): string | null {
    if (tile === "p") return "buraco";
    if (tile === "w") return "poça";
    if (tile === "r") return "pista";
    if (
      tile === "c" &&
      this.level.signal &&
      !this.signalSafe &&
      this.assisted <= 0 &&
      this.crossingGrace <= 0 &&
      this.currentTile() !== "c" &&
      this.laneProgress < 3
    ) {
      return "travessia";
    }
    return null;
  }

  private bump(tile: Tile) {
    this.audio.bump();
    this.audio.vibrate([35, 40, 35]);
    this.autonomy = Math.max(0, this.autonomy - 2);
    this.time += 3;
    this.collisions += 1;
    this.shake = 1;
    const label = TILE_LABEL[tile];
    const variations = [
      `A bengala encontra ${label}. Não há passagem por aqui.`,
      `O bastão bate em ${label} e para. Você precisa contornar.`,
      `${label} ocupa o caminho à frente. A bengala confirma: bloqueado.`,
    ];
    this.caption(variations[Math.floor(Math.random() * variations.length)], false);
    if (this.autonomy <= 0) {
      this.exhausted();
    }
    this.emitStats(true);
  }

  private exhausted() {
    this.paused = true;
    this.audio.hazard();
    this.emit({
      type: "punish",
      title: "Você parou",
      detail:
        "O cansaço e a incerteza se acumularam. Sem confiança para continuar, a alternativa segura é pedir ajuda e retomar de um ponto conhecido.",
      consequence: "Você recebe companhia até o último ponto seguro. A confiança volta ao mínimo para seguir.",
      loss: 0,
      time: 20,
      autonomy: 55,
    });
    this.autonomy = 55;
    this.helps += 1;
    this.time += 20;
  }

  private punish(reason: string) {
    this.collisions += 1;
    this.paused = true;
    this.audio.hazard();
    this.audio.vibrate([70, 50, 70, 50, 110]);
    const config: Record<string, { loss: number; penalty: number; title: string; detail: string; consequence: string }> = {
      buraco: {
        loss: 14,
        penalty: 10,
        title: "O chão cedeu",
        detail:
          "A bengala passou pela borda do buraco e o seu pé entrou. A calçada não tinha piso de alerta nem proteção ao redor.",
        consequence: "Você volta ao último ponto seguro e perde tempo refazendo o caminho. O buraco continua lá.",
      },
      poça: {
        loss: 7,
        penalty: 6,
        title: "Água no caminho",
        detail:
          "O sapato molha e o piso fica escorregadio. A poça também esconde a textura do chão — uma informação essencial que a bengala perde.",
        consequence: "Você retorna ao ponto seguro e tenta um desvio.",
      },
      pista: {
        loss: 22,
        penalty: 16,
        title: "Você entrou na pista",
        detail:
          "Sem piso tátil de alerta, você desceu o meio-fio sem perceber. Um carro freia ao seu lado e buzinam. O susto é a cidade cobrando uma informação que não deu.",
        consequence: "Você é levado de volta à calçada. Peru-se no calendário: o risco não era abstrato.",
      },
      travessia: {
        loss: 18,
        penalty: 14,
        title: "Os carros não pararam",
        detail:
          "Você começou a travessia em uma janela de silêncio, mas ela estava curta. Um carro corta o seu caminho; a buzina chega antes do corpo. O farol estava verde — só que isso nunca foi dito em voz alta.",
        consequence: "Alguém o conduz de volta ao meio-fio. Espere a próxima janela ou peça ajuda.",
      },
    };
    const item = config[reason] ?? config.buraco;
    this.autonomy = Math.max(0, this.autonomy - item.loss);
    this.time += item.penalty;
    this.emit({
      type: "punish",
      ...item,
      time: item.penalty,
      autonomy: this.autonomy,
    });
    this.emitStats(true);
  }

  resumeAfterPunishment() {
    this.moveTo(this.checkpoint.x, this.checkpoint.y, this.checkpoint.angle);
    this.assisted = 0;
    this.crossingGrace = 0;
    this.moving = null;
    this.paused = false;
    if (this.autonomy <= 0) {
      this.autonomy = 42;
    }
    this.triggerScan(2.6, 1);
    this.caption(
      "Você está de volta ao último ponto seguro. Respire. A bengala toca o chão novamente: o caminho continua a partir daqui.",
    );
    this.emitStats(true);
  }

  private moveTo(x: number, y: number, angle: number) {
    this.gx = x;
    this.gy = y;
    this.px = x + 0.5;
    this.py = y + 0.5;
    this.angle = angle;
    this.targetAngle = angle;
  }

  private useCane() {
    this.triggerScan(6.8, 2.6);
    const surface = this.surfaceAhead();
    this.audio.sonar();
    this.audio.tap(surface);
    this.audio.vibrate([12, 30, 12]);
    const description = this.describeAhead();
    this.caption(description.text, description.focus);
    this.emitStats(true);
  }

  private surfaceAhead(): Surface {
    const one = this.tileAhead(1);
    if (isWall(one)) return "concrete";
    return TILE_SURFACE[one] ?? "concrete";
  }

  private describeAhead(): { text: string; focus: boolean } {
    const { dx, dy } = snapDir(this.angle);
    const parts: string[] = [];
    let focus = false;
    let firstHazard: string | null = null;
    let firstWall: string | null = null;
    let goalDistance: number | null = null;

    for (let d = 1; d <= 5; d += 1) {
      const tile = tileAt(this.level, this.gx + dx * d, this.gy + dy * d);
      if (tile === "g" && goalDistance === null) goalDistance = d;
      if (!firstWall && isWall(tile)) firstWall = `${d === 1 ? "logo à frente" : `a ${d} passos`} há ${TILE_LABEL[tile]}`;
      if (!firstHazard && (tile === "p" || tile === "w" || tile === "r") && d > 1) {
        firstHazard = `a ${d} passos há ${TILE_LABEL[tile]}`;
      }
    }

    const one = this.tileAhead(1);
    if (one === "t") parts.push("A bengala confirma piso tátil direcional sob a ponta.");
    else if (one === "a") parts.push("Piso tátil de alerta: atenção, mudança à frente.");
    else if (one === "g") parts.push("A bengala encontra a soleira do destino.");
    else if (one === "c") parts.push("A bengala desce o meio-fio: faixa de pedestres à frente.");
    else if (isWall(one)) parts.push(`A ponta do bastão bate em ${TILE_LABEL[one]}. Passagem bloqueada.`);
    else if (TILE_SURFACE[one] === "puddle") parts.push("O bastão encontra água parada.");
    else if (one === "p") parts.push("O bastão encontra o vazio de um buraco.");
    else parts.push(`O bastão toca ${TILE_LABEL[one]}. O caminho segue livre por perto.`);

    if (firstHazard) {
      parts.push(`${firstHazard}.`);
      focus = true;
    }
    if (firstWall) parts.push(`Mais à frente, ${firstWall}.`);
    if (goalDistance !== null) {
      parts.push(`Um contorno de porta indica o destino a ${goalDistance} passos.`);
      focus = true;
    }

    const person = this.nearbyPerson();
    if (person) {
      parts.push(`Há alguém por perto, ${person.direction}. O botão de ajuda está disponível.`);
      focus = true;
    }

    if (this.level.signal && Math.abs(this.gx - 6) < 3 && Math.abs(this.gy - 10) < 4) {
      parts.push(
        this.signalSafe
          ? "O ruído dos carros diminuiu agora. Há uma janela de travessia."
          : "Os carros passam nos dois sentidos agora. Não é uma boa janela.",
      );
      focus = true;
    }

    return { text: parts.join(" "), focus };
  }

  private nearbyPerson() {
    type Nearby = { name: string; line: string; distance: number; direction: string };
    let best: Nearby | null = null;
    for (const person of this.level.people) {
      const dx = person.x + 0.5 - this.px;
      const dy = person.y + 0.5 - this.py;
      const distance = Math.hypot(dx, dy);
      if (distance > 4.2) continue;
      if (!best || distance < best.distance) {
        const forward = dx * Math.cos(this.angle) + dy * Math.sin(this.angle);
        const lateral = -dx * Math.sin(this.angle) + dy * Math.cos(this.angle);
        const direction = forward > 0.6 ? "à frente" : forward < -0.6 ? "atrás" : lateral > 0 ? "à direita" : "à esquerda";
        const candidate: Nearby = { name: person.name, line: person.line, distance, direction };
        best = candidate;
      }
    }
    return best as Nearby | null;
  }

  private askHelp() {
    const person = this.nearbyPerson();
    this.helps += 1;
    const extraTime = person ? 7 : 5;
    this.time += extraTime;
    this.autonomy = Math.min(100, this.autonomy + 5);
    this.audio.help();
    this.audio.vibrate([14, 40, 14]);
    this.triggerScan(7, 2.6);

    const dx = this.level.goal.x + 0.5 - this.px;
    const dy = this.level.goal.y + 0.5 - this.py;
    const forward = dx * Math.cos(this.angle) + dy * Math.sin(this.angle);
    const lateral = -dx * Math.sin(this.angle) + dy * Math.cos(this.angle);
    const where = Math.abs(forward) > Math.abs(lateral) ? (forward > 0 ? "à frente" : "atrás") : lateral > 0 ? "à direita" : "à esquerda";
    const distance = Math.round(Math.hypot(dx, dy));

    if (person) {
      if (this.level.signal) {
        this.assisted = 18;
        this.caption(
          `${person.name}: “${person.line}” Vocês atravessam juntos. Durante os próximos segundos, você caminha com apoio: a travessia não dependerá da sua leitura do tráfego.`,
          true,
        );
      } else {
        this.caption(
          `${person.name}: “${person.line}” Você agradece. O destino, ${this.level.goal.label}, está ${where}, a cerca de ${distance} passos. O apoio custou ${extraTime} segundos — e valeu.`,
          true,
        );
      }
    } else {
      this.caption(
        `Você chama e espera. Ninguém por perto responde de imediato; passos distantes seguem sem parar. Você respira e escuta o ambiente: o ${this.level.goal.label} deveria estar ${where}, a aproximadamente ${distance} passos. A tentativa custou ${extraTime} segundos.`,
        true,
      );
    }
    this.emitStats(true);
  }

  update(dt: number) {
    if (!this.started) return;
    const delta = Math.min(0.05, dt);
    if (!this.paused && !this.finished) {
      this.time += delta;
      this.canePhase += delta * 3.4;
      if (this.assisted > 0) {
        this.assisted = Math.max(0, this.assisted - delta);
        if (this.assisted === 0) this.caption("O apoio de travessia terminou. Confirme o trânsito antes de seguir.", true);
      }
      if (this.crossingGrace > 0) {
        this.crossingGrace = Math.max(0, this.crossingGrace - delta);
        if (this.crossingGrace === 0 && this.currentTile() === "c" && !this.signalSafe) {
          this.caption("A janela de silêncio fechou. Termine a travessia sem parar.", false);
        }
      }
      if (this.level.signal) this.updateSignal(delta);
    }

    if (this.scanAge >= 0) {
      this.scanAge += delta;
      if (this.scanAge > this.scanDuration) this.scanAge = -1;
    }
    this.caneKick = Math.max(0, this.caneKick - delta * 4);
    this.shake = Math.max(0, this.shake - delta * 3.4);

    if (this.moving) {
      this.moving.t += delta;
      const p = Math.min(1, this.moving.t / this.moving.duration);
      const ease = p * p * (3 - 2 * p);
      this.px = this.moving.fromX + (this.moving.toX - this.moving.fromX) * ease;
      this.py = this.moving.fromY + (this.moving.toY - this.moving.fromY) * ease;
      if (p >= 1) {
        const arrived = this.moving.tile;
        this.moving = null;
        if (arrived === "g") this.complete();
        else if (arrived === "i") {
          this.audio.tap("beacon");
          const toGoal = Math.round(Math.hypot(this.level.goal.x - this.gx, this.level.goal.y - this.gy));
          this.caption(`Um sino de orientação toca aqui. ${this.level.goal.label} a ${toGoal} passos.`, true);
        }
      }
    }

    let angleDiff = normalizeAngle(this.targetAngle - this.angle);
    if (angleDiff > Math.PI) angleDiff -= TAU;
    if (Math.abs(angleDiff) > 0.002) this.angle = normalizeAngle(this.angle + angleDiff * Math.min(1, delta * 9));
    else this.angle = this.targetAngle;

    this.emitStats();
  }

  private updateSignal(delta: number) {
    const signal = this.level.signal;
    if (!signal) return;
    this.signalClock += delta;
    const cycle = signal.safeMs + signal.unsafeMs;
    const inCycle = (this.signalClock * 1000) % cycle;
    const safe = signal.startUnsafe ? inCycle >= signal.unsafeMs : inCycle < signal.safeMs;
    if (safe !== this.signalSafe) {
      this.signalSafe = safe;
      this.audio.signal(safe);
      this.emit({ type: "signal", safe });
      this.caption(
        safe
          ? "O ruído dos carros diminui. É uma janela de travessia — se você já estiver pronto."
          : "Um carro passa, depois outro. O tráfego voltou a fechar a janela.",
        true,
      );
    }
    if (this.time - this.lastTraffic > (this.signalSafe ? 2.8 : 0.8)) {
      this.lastTraffic = this.time;
      this.audio.traffic(!this.signalSafe);
    }
    if (this.time - this.lastSignalCue > 3.2) {
      this.lastSignalCue = this.time;
      if (this.nearbyPerson() || Math.abs(this.gy - 10) < 6) this.audio.signal(this.signalSafe);
    }
  }

  private complete() {
    if (this.finished) return;
    this.finished = true;
    this.paused = true;
    this.audio.success();
    this.audio.vibrate([20, 60, 20, 60, 30]);
    this.caption(this.level.outro, true);
    this.emit({ type: "complete", stats: this.stats() });
  }

  getTrail() {
    return this.trail;
  }

  getCheckpoint() {
    return this.checkpoint;
  }

  getSignalSafe() {
    return this.signalSafe;
  }

  /* ------------------------------- RENDER ------------------------------- */

  render(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    if (!this.started) return;

    const t = this.scanAge >= 0 ? Math.min(1, this.scanAge / this.scanDuration) : 1;
    const strength = this.scanAge >= 0 ? Math.pow(Math.max(0, 1 - t), 0.62) : 0;
    const eased = 1 - Math.pow(1 - t, 2.4);
    const radius = this.scanAge >= 0 ? 0.35 + (this.scanRadius - 0.35) * eased : 0;

    const shakeX = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 9 : 0;
    const shakeY = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 7 : 0;
    ctx.save();
    ctx.translate(shakeX, shakeY);

    const focal = w / 2 / Math.tan(FOV / 2);
    const horizon = h * 0.55;
    const eye = 0.52;

    if (strength > 0.01 && radius > 0.2) {
      this.drawWalls(ctx, w, h, focal, horizon, radius, strength);
      this.drawFloor(ctx, w, h, focal, horizon, eye, radius, strength);
      this.drawScanWave(ctx, w, h, t, strength);
    }

    this.drawTipGlow(ctx, w, h, strength);
    this.drawCane(ctx, w, h);
    this.drawVignette(ctx, w, h);
    ctx.restore();
  }

  private drawWalls(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    focal: number,
    horizon: number,
    radius: number,
    strength: number,
  ) {
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);
    const planeScale = Math.tan(FOV / 2);
    const planeX = -sin * planeScale;
    const planeY = cos * planeScale;
    const step = 2;

    for (let sx = 0; sx <= w; sx += step) {
      const cameraX = (2 * sx) / w - 1;
      const rayX = cos + planeX * cameraX;
      const rayY = sin + planeY * cameraX;
      let mapX = Math.floor(this.px);
      let mapY = Math.floor(this.py);
      const deltaX = rayX === 0 ? 1e30 : Math.abs(1 / rayX);
      const deltaY = rayY === 0 ? 1e30 : Math.abs(1 / rayY);
      let stepX: number;
      let stepY: number;
      let sideDistX: number;
      let sideDistY: number;
      if (rayX < 0) {
        stepX = -1;
        sideDistX = (this.px - mapX) * deltaX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1 - this.px) * deltaX;
      }
      if (rayY < 0) {
        stepY = -1;
        sideDistY = (this.py - mapY) * deltaY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1 - this.py) * deltaY;
      }

      let tile: Tile = "#";
      let side = 0;
      let hit = false;
      let guards = 0;
      while (!hit && guards < 64) {
        guards += 1;
        if (sideDistX < sideDistY) {
          sideDistX += deltaX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaY;
          mapY += stepY;
          side = 1;
        }
        tile = tileAt(this.level, mapX, mapY);
        if (isWall(tile)) hit = true;
      }
      if (!hit) continue;
      const perp = side === 0 ? sideDistX - deltaX : sideDistY - deltaY;
      if (perp > radius || perp <= 0.05) continue;

      const lineHeight = Math.min(h * 2.4, (focal * 1.02) / perp);
      const top = horizon - lineHeight * 0.52;
      const bottom = top + lineHeight;
      const reveal = strength * Math.max(0.2, 1 - perp / (radius + 0.1));
      const alpha = Math.min(0.98, 0.22 + reveal * 0.95) * (side === 1 ? 0.85 : 1);
      const palette: Record<string, [number, number, number]> = {
        "#": [204, 191, 166],
        x: [226, 85, 59],
        m: [181, 138, 92],
        l: [214, 202, 178],
        f: [152, 139, 118],
      };
      const [r, g, b] = palette[tile] ?? [190, 180, 160];
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillRect(sx, top, step + 1, bottom - top);

      // aresta superior luminosa, como contorno de ecolocalização
      ctx.fillStyle = `rgba(${Math.min(255, r + 26)},${Math.min(255, g + 26)},${Math.min(255, b + 22)},${Math.min(0.9, alpha + 0.14)})`;
      ctx.fillRect(sx, top, step + 1, Math.max(1, lineHeight * 0.018));

      // reflexo vertical para dar matéria à parede
      if (alpha > 0.32) {
        ctx.fillStyle = `rgba(0,0,0,${0.24 + (side === 1 ? 0.12 : 0)})`;
        ctx.fillRect(sx + step * 0.55, top, 1, bottom - top);
      }
      if (tile === "x") {
        ctx.fillStyle = `rgba(12,11,9,${alpha * 0.35})`;
        ctx.fillRect(sx, top + lineHeight * 0.35, step + 1, Math.max(1, lineHeight * 0.025));
        ctx.fillRect(sx, top + lineHeight * 0.68, step + 1, Math.max(1, lineHeight * 0.025));
      }
    }
  }

  private project(wx: number, wy: number, w: number, _h: number, focal: number, horizon: number, eye: number) {
    const dx = wx - this.px;
    const dy = wy - this.py;
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);
    const depth = dx * cos + dy * sin;
    if (depth <= 0.12) return null;
    const lateral = -dx * sin + dy * cos;
    return {
      x: w / 2 + (lateral / depth) * focal,
      y: horizon + (eye / depth) * focal,
      depth,
    };
  }

  private drawFloor(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    focal: number,
    horizon: number,
    eye: number,
    radius: number,
    strength: number,
  ) {
    const minX = Math.floor(this.px - radius - 1);
    const maxX = Math.ceil(this.px + radius + 1);
    const minY = Math.floor(this.py - radius - 1);
    const maxY = Math.ceil(this.py + radius + 1);
    const time = this.time;
    const elements: Array<{ depth: number; draw: () => void }> = [];

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const tile = tileAt(this.level, x, y);
        if (isWall(tile)) continue;
        const dx = x + 0.5 - this.px;
        const dy = y + 0.5 - this.py;
        const dist = Math.hypot(dx, dy);
        if (dist > radius + 0.75) continue;
        const projected = this.project(x + 0.5, y + 0.5, w, h, focal, horizon, eye);
        if (!projected) continue;
        if (projected.x < -60 || projected.x > w + 60) continue;
        if (projected.y > h + 70) continue;
        const fade = Math.max(0, 1 - dist / (radius + 0.7)) * strength;
        if (fade < 0.03) continue;
        const alpha = Math.min(0.95, fade * 1.3);
        const size = Math.max(1, Math.min(9, (focal * 0.055) / projected.depth));

        const corners = [
          this.project(x, y, w, h, focal, horizon, eye),
          this.project(x + 1, y, w, h, focal, horizon, eye),
          this.project(x + 1, y + 1, w, h, focal, horizon, eye),
          this.project(x, y + 1, w, h, focal, horizon, eye),
        ];
        const quad = corners.every((corner) => corner !== null) ? (corners as Array<{ x: number; y: number }>) : null;

        const draw = () => {
          if (quad) {
            const path = new Path2D();
            path.moveTo(quad[0].x, quad[0].y);
            for (let i = 1; i < 4; i += 1) path.lineTo(quad[i].x, quad[i].y);
            path.closePath();
            const fill =
              tile === "p"
                ? `rgba(92,34,25,${alpha * 0.75})`
                : tile === "w"
                  ? `rgba(52,84,94,${alpha * 0.65})`
                  : tile === "r"
                    ? `rgba(52,48,43,${alpha * 0.6})`
                    : tile === "c"
                      ? `rgba(174,167,152,${alpha * 0.4})`
                      : tile === "g"
                        ? `rgba(202,219,132,${alpha * 0.3})`
                        : tile === "t"
                          ? `rgba(126,141,80,${alpha * 0.32})`
                          : tile === "a"
                            ? `rgba(158,116,59,${alpha * 0.34})`
                            : `rgba(150,140,122,${alpha * 0.16})`;
            ctx.fillStyle = fill;
            ctx.fill(path);
            ctx.strokeStyle =
              tile === "p"
                ? `rgba(226,85,59,${alpha * 0.85})`
                : tile === "t" || tile === "i"
                  ? `rgba(202,219,132,${alpha * 0.5})`
                  : tile === "a"
                    ? `rgba(240,177,90,${alpha * 0.6})`
                    : `rgba(226,217,200,${alpha * 0.24})`;
            ctx.lineWidth = Math.max(0.6, Math.min(2, size * 0.14));
            ctx.stroke(path);
          }

          if (tile === "t") {
            const vertical = tileAt(this.level, x, y - 1) === "t" || tileAt(this.level, x, y + 1) === "t";
            const fx = vertical ? 0 : 1;
            const fy = vertical ? 1 : 0;
            const pxAxis = vertical ? 1 : 0;
            const pyAxis = vertical ? 0 : 1;
            for (let i = -1; i <= 1; i += 1) {
              const offset = i * 0.22;
              const a = this.project(
                x + 0.5 + pxAxis * offset - fx * 0.16,
                y + 0.5 + pyAxis * offset - fy * 0.16,
                w,
                h,
                focal,
                horizon,
                eye,
              );
              const b = this.project(
                x + 0.5 + pxAxis * offset + fx * 0.16,
                y + 0.5 + pyAxis * offset + fy * 0.16,
                w,
                h,
                focal,
                horizon,
                eye,
              );
              if (!a || !b) continue;
              ctx.strokeStyle = `rgba(202,219,132,${alpha})`;
              ctx.lineWidth = Math.max(0.7, Math.min(3.4, size * 0.32));
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          } else if (tile === "a") {
            for (let i = -1; i <= 1; i += 1) {
              const point = this.project(x + 0.5 + i * 0.24, y + 0.5, w, h, focal, horizon, eye);
              if (!point) continue;
              ctx.beginPath();
              ctx.arc(point.x, point.y, Math.max(0.8, size * 0.16), 0, TAU);
              ctx.fillStyle = `rgba(240,177,90,${alpha * 0.95})`;
              ctx.fill();
            }
          } else if (tile === "c") {
            ctx.strokeStyle = `rgba(232,225,209,${alpha * 0.8})`;
            ctx.lineWidth = Math.max(0.8, size * 0.28);
            for (let i = -1; i <= 1; i += 1) {
              const point = this.project(x + 0.5, y + 0.5 + i * 0.28, w, h, focal, horizon, eye);
              if (!point) continue;
              ctx.beginPath();
              ctx.moveTo(point.x - size * 1.5, point.y);
              ctx.lineTo(point.x + size * 1.5, point.y);
              ctx.stroke();
            }
          } else if (tile === "p") {
            ctx.strokeStyle = `rgba(226,85,59,${alpha})`;
            ctx.lineWidth = Math.max(1, size * 0.22);
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, Math.max(2, size * 0.55), 0, TAU);
            ctx.stroke();
            ctx.fillStyle = `rgba(226,85,59,${alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, Math.max(1, size * 0.18), 0, TAU);
            ctx.fill();
          } else if (tile === "w") {
            ctx.strokeStyle = `rgba(139,177,190,${alpha * 0.9})`;
            ctx.lineWidth = Math.max(1, size * 0.16);
            ctx.beginPath();
            ctx.ellipse(projected.x, projected.y, Math.max(2, size), Math.max(0.8, size * 0.35), 0, 0, TAU);
            ctx.stroke();
          } else if (tile === "i") {
            const pulse = (Math.sin(time * 3.4 + x) + 1) / 2;
            ctx.strokeStyle = `rgba(202,219,132,${alpha * (0.45 + pulse * 0.45)})`;
            ctx.lineWidth = Math.max(1, size * 0.18);
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, Math.max(2, size * (0.4 + pulse * 0.5)), 0, TAU);
            ctx.stroke();
            ctx.fillStyle = `rgba(202,219,132,${alpha * 0.9})`;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, Math.max(1, size * 0.14), 0, TAU);
            ctx.fill();
          } else if (tile === "g") {
            const pulse = (Math.sin(time * 3) + 1) / 2;
            ctx.strokeStyle = `rgba(202,219,132,${alpha})`;
            ctx.lineWidth = Math.max(1, size * 0.2);
            ctx.beginPath();
            ctx.ellipse(projected.x, projected.y, Math.max(3, size * 1.4), Math.max(1, size * 0.5), 0, 0, TAU);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(projected.x, projected.y, Math.max(2, size * (0.8 + pulse * 0.4)), Math.max(1, size * 0.28), 0, 0, TAU);
            ctx.stroke();
          } else if (tile === "s" && dist < 2.7) {
            ctx.fillStyle = `rgba(199,188,167,${alpha * 0.28})`;
            for (let i = 0; i < 2; i += 1) {
              const point = this.project(x + 0.25 + i * 0.45, y + 0.3 + i * 0.38, w, h, focal, horizon, eye);
              if (!point) continue;
              ctx.beginPath();
              ctx.arc(point.x, point.y, Math.max(0.5, size * 0.06), 0, TAU);
              ctx.fill();
            }
          }
        };
        elements.push({ depth: projected.depth, draw });
      }
    }

    elements.sort((a, b) => b.depth - a.depth).forEach((element) => element.draw());

    // Corpos e destinos: só aparecem quando tocados pelo campo da bengala.
    this.level.people.forEach((person) => {
      const dx = person.x + 0.5 - this.px;
      const dy = person.y + 0.5 - this.py;
      const dist = Math.hypot(dx, dy);
      if (dist > radius + 0.6) return;
      const feet = this.project(person.x + 0.5, person.y + 0.5, w, h, focal, horizon, eye);
      if (!feet) return;
      const follow = strength * Math.max(0.15, 1 - dist / (radius + 0.5));
      const alpha = Math.min(0.92, 0.2 + follow);
      const height = Math.max(10, (focal * 1.15) / feet.depth);
      ctx.strokeStyle = `rgba(202,219,132,${alpha * 0.9})`;
      ctx.lineWidth = Math.max(1.4, Math.min(5, (focal * 0.04) / feet.depth));
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(feet.x, feet.y);
      ctx.lineTo(feet.x, feet.y - height);
      ctx.stroke();
      ctx.fillStyle = `rgba(202,219,132,${alpha})`;
      ctx.beginPath();
      ctx.arc(feet.x, feet.y - height, Math.max(2, height * 0.09), 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(feet.x, feet.y, Math.max(3, height * 0.2), Math.max(1, height * 0.06), 0, 0, TAU);
      ctx.stroke();
      if (dist < 3.4) {
        ctx.font = `500 ${Math.max(8, Math.min(11, h * 0.017))}px "IBM Plex Mono", monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(202,219,132,${Math.min(0.9, alpha)})`;
        ctx.fillText(person.name.toLowerCase(), feet.x, feet.y + 14);
      }
    });

    const goal = this.level.goal;
    const gdx = goal.x + 0.5 - this.px;
    const gdy = goal.y + 0.5 - this.py;
    const goalDist = Math.hypot(gdx, gdy);
    if (goalDist <= radius + 0.8) {
      const point = this.project(goal.x + 0.5, goal.y + 0.5, w, h, focal, horizon, eye);
      if (point) {
        const alpha = Math.min(0.95, 0.25 + strength * Math.max(0.15, 1 - goalDist / (radius + 0.8)));
        ctx.font = `500 ${Math.max(9, Math.min(13, h * 0.019))}px "IBM Plex Mono", monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(243,238,226,${alpha})`;
        ctx.fillText(goal.label.toLowerCase(), point.x, point.y - 16);
        ctx.strokeStyle = `rgba(243,238,226,${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y - 10);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    }
  }

  private drawScanWave(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, strength: number) {
    const eased = 1 - Math.pow(1 - t, 2);
    const cx = w / 2;
    const cy = h * 0.83;
    for (let i = 0; i < 2; i += 1) {
      const progress = Math.max(0, Math.min(1, eased - i * 0.16));
      if (progress <= 0) continue;
      ctx.strokeStyle = `rgba(202,219,132,${(1 - progress) * 0.36 * strength})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, progress * w * 0.62, progress * 78, 0, Math.PI, TAU);
      ctx.stroke();
    }
  }

  private caneTip(w: number, h: number) {
    const anchorX = w * 0.68;
    const anchorY = h + h * 0.04;
    const swing = 0.52 + Math.sin(this.canePhase) * 0.17 + this.caneKick * 0.16;
    const length = Math.min(h * 0.72, w * 0.62);
    return {
      anchorX,
      anchorY,
      swing,
      length,
      tipX: anchorX - Math.sin(swing) * length,
      tipY: anchorY - Math.cos(swing) * length,
    };
  }

  private drawTipGlow(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
    if (strength <= 0.02) return;
    const { tipX, tipY } = this.caneTip(w, h);
    const contactX = tipX;
    const contactY = Math.min(h - 4, tipY + h * 0.018);
    const glowRadius = Math.max(60, Math.min(w, h) * 0.22);
    const gradient = ctx.createRadialGradient(contactX, contactY, 0, contactX, contactY, glowRadius);
    gradient.addColorStop(0, `rgba(202,219,132,${0.2 * strength})`);
    gradient.addColorStop(0.45, `rgba(202,219,132,${0.07 * strength})`);
    gradient.addColorStop(1, "rgba(202,219,132,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(contactX, contactY, glowRadius, glowRadius * 0.34, 0, 0, TAU);
    ctx.fill();

    for (let i = 0; i < 7; i += 1) {
      const angle = (i / 7) * TAU + this.time * 0.35;
      const spread = glowRadius * (0.16 + ((i * 37) % 10) / 24);
      const x = contactX + Math.cos(angle) * spread;
      const y = contactY + Math.sin(angle) * spread * 0.3;
      const alpha = strength * (0.18 + ((i * 17) % 7) / 22);
      ctx.fillStyle = `rgba(202,219,132,${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.9 + ((i * 13) % 4) * 0.35, 0, TAU);
      ctx.fill();
    }
  }

  private drawCane(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const { anchorX, anchorY, swing, length, tipX, tipY } = this.caneTip(w, h);
    const startX = anchorX;
    const startY = anchorY;

    ctx.save();
    ctx.lineCap = "round";
    const grad = ctx.createLinearGradient(startX, startY, tipX, tipY);
    grad.addColorStop(0, "rgba(216,205,183,0.42)");
    grad.addColorStop(0.65, "rgba(243,238,226,0.82)");
    grad.addColorStop(1, "rgba(255,255,255,0.95)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(2.4, w * 0.0027);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    const tipStartX = tipX + Math.sin(swing) * length * 0.1;
    const tipStartY = tipY + Math.cos(swing) * length * 0.1;
    ctx.strokeStyle = "rgba(226,85,59,0.95)";
    ctx.lineWidth = Math.max(2.6, w * 0.003);
    ctx.beginPath();
    ctx.moveTo(tipStartX, tipStartY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.fillStyle = "rgba(243,238,226,0.85)";
    ctx.beginPath();
    ctx.arc(tipStartX, tipStartY, Math.max(2, w * 0.004), 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  private drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const gradient = ctx.createRadialGradient(w / 2, h * 0.58, h * 0.12, w / 2, h * 0.58, Math.max(w, h) * 0.72);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0.08)");
    gradient.addColorStop(1, "rgba(0,0,0,0.72)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }
}

export function surfaceName(tile: Tile) {
  return TILE_SURFACE[tile] ?? "concrete";
}
