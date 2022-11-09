import { Entity } from "./entity";

type Handler<T extends any[] = any[]> = (...args: T) => void;

const keyMap = {
  [" "]: "Space",
};

export class Game {
  canvasElement: HTMLCanvasElement;
  renderingContext: CanvasRenderingContext2D;

  config = {
    simulation: {
      rate: 1000 / 100,
    },
  };

  /**
   * Game statistics.
   */
  statistics = {
    /** Time of the last game loop. */
    time: 0,

    rendering: {
      /** Total frames rendered. */
      count: 0,
      /** Frames per second. */
      rate: 0,
      /** Time since last rendered frame. */
      delta: 0,
      /** Time spent in last frame. */
      elapsed: 0,
    },

    simulation: {
      /** Total simulation steps. */
      steps: 0,
      /** Time spent in last step. */
      elapsed: 0,
      /** Time since last simulation step. */
      accumulator: 0,
    },
  };

  /**
   * Game entities.
   */
  entities: Record<string, Entity<any>> = {};

  /**
   * Input state.
   */
  input: Record<string, true> = {};

  /**
   * Game event handlers.
   */
  handlers: Record<string, Handler[]> = {};

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
    const context = canvasElement.getContext("2d");
    if (!context) {
      throw new Error("Couldn't get rendering context");
    }
    this.renderingContext = context;
  }

  /**
   * Handle game event.
   */
  addEventHandler(event: "update", handler: Handler<[number]>): void;
  addEventHandler(event: "render", handler: Handler<[number]>): void;
  addEventHandler(event: string, handler: Handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  /**
   * Unregister event handler.
   */
  removeEventHandler(event: string, handler: Handler) {
    this.handlers[event] = this.handlers[event].filter((h) => h !== handler);
  }

  /**
   * Trigger game event.
   */
  trigger(event: string, ...args: any[]) {
    this.handlers[event]?.forEach((handler) => {
      handler(...args);
    });
  }

  /**
   * Add an entity to the game world.
   */
  addEntity<T extends Entity<any>>(entity: T) {
    this.entities[entity.id] = entity;
  }

  /**
   * Find an entity.
   */
  findEntity(predicate: string | ((entity: Entity<any>) => boolean)) {
    if (typeof predicate === "string") {
      return this.entities[predicate];
    }
    return Object.values(this.entities).find(predicate);
  }

  /**
   * Render a frame.
   *
   * @param delta Time since last update, in milliseconds.
   */
  render(delta: number) {
    const now = performance.now();

    this.renderingContext.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    this.trigger("render", delta / 1000);

    this.statistics.rendering.count += 1;
    this.statistics.rendering.rate = 1000 / delta;
    this.statistics.rendering.elapsed = performance.now() - now;
  }

  /**
   * Advance game state.
   *
   * @param delta Time since last update, in milliseconds.
   */
  update(delta: number) {
    const now = performance.now();

    this.trigger("update", delta / 1000);

    this.statistics.simulation.steps += 1;
    this.statistics.simulation.elapsed = performance.now() - now;
  }

  /**
   * Game loop.
   */
  loop() {
    const { statistics, config } = this;

    const time = performance.now();
    const delta = time - this.statistics.time;

    statistics.time = time;
    statistics.simulation.accumulator += delta;

    while (statistics.simulation.accumulator >= config.simulation.rate) {
      statistics.simulation.accumulator -= config.simulation.rate;
      this.update(config.simulation.rate);
    }

    this.render(delta);

    requestAnimationFrame(() => this.loop());
  }

  /**
   * Start the game.
   */
  start() {
    window.addEventListener("keydown", (e) => {
      const key = keyMap[e.key] ?? e.key;
      this.input[key] = true;
    });

    window.addEventListener("keyup", (e) => {
      const key = keyMap[e.key] ?? e.key;
      delete this.input[key];
    });

    this.loop();
  }
}
