import { Entity } from "./entity";

/**
 * Game event handler.
 */
type Handler<T extends any[] = any[]> = (...args: T) => void;

/**
 * Available keys.
 */
type Key =
  | "Escape"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12"
  | "KeyQ"
  | "KeyW"
  | "KeyE"
  | "KeyR"
  | "KeyT"
  | "KeyY"
  | "KeyU"
  | "KeyI"
  | "KeyO"
  | "KeyP"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "KeyF"
  | "KeyG"
  | "KeyH"
  | "KeyJ"
  | "KeyK"
  | "KeyL"
  | "KeyZ"
  | "KeyX"
  | "KeyC"
  | "KeyV"
  | "KeyB"
  | "KeyN"
  | "KeyM"
  | "Digit1"
  | "Digit2"
  | "Digit3"
  | "Digit4"
  | "Digit5"
  | "Digit6"
  | "Digit7"
  | "Digit8"
  | "Digit9"
  | "Digit0"
  | "Numpad1"
  | "Numpad2"
  | "Numpad3"
  | "Numpad4"
  | "Numpad5"
  | "Numpad6"
  | "Numpad7"
  | "Numpad8"
  | "Numpad9"
  | "Numpad0"
  | "Space"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Backspace"
  | "Enter"
  | "ShiftLeft"
  | "ShiftRight"
  | "AltLeft"
  | "AltRight"
  | "ControlLeft"
  | "ControlRight"
  | "MetaLeft"
  | "MetaRight"
  | "Tab"
  | "CapsLock"
  | "Home"
  | "End"
  | "PageUp"
  | "PageDown"
  | "Insert"
  | "Delete"
  | "Minus"
  | "Equal"
  | "BracketLeft"
  | "BracketRight"
  | "Backslash"
  | "Semicolon"
  | "Quote"
  | "Comma"
  | "Period"
  | "Slash"
  | `Mouse${number}`;

/**
 * An input state.
 */
type Input = {
  /** Which key has been activated. */
  key: Key;
  /** When it was activated. */
  time: number;
  /** How long it's been activated. */
  duration: number;
  /** If it's the first update the key's been detected. */
  fresh: boolean;
};

/**
 * Game.
 */
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
   * Input state map.
   */
  input: Record<string, Input> = {};

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
   * Listen to input.
   */
  addInputHandlers() {
    const addQueue: Input[] = [];
    const removeQueue: Key[] = [];

    this.canvasElement.addEventListener("keydown", (e) => {
      e.preventDefault();

      // Prevent duplicate keydown events.
      if (e.repeat) {
        return;
      }

      const state: Input = {
        key: e.code as Key,
        time: 0,
        duration: 0,
        fresh: true,
      };
      addQueue.push(state);
    });

    // Listen from window to catch events even if the canvas loses focus.
    window.addEventListener("keyup", (e) => {
      removeQueue.push(e.code as Key);
    });

    this.canvasElement.addEventListener("mousedown", (e) => {
      const state: Input = {
        key: `Mouse${e.button}` as Key,
        time: 0,
        duration: 0,
        fresh: true,
      };
      addQueue.push(state);
    });

    // Listen from window to catch events even if the canvas loses focus.
    window.addEventListener("mouseup", (e) => {
      removeQueue.push(`Mouse${e.button}` as Key);
    });

    this.canvasElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Update active input state.
    // Use queues to avoid changing state in between updates.
    this.addEventHandler("update", (delta) => {
      Object.values(this.input).forEach((state) => {
        state.duration += delta;
        state.fresh = false;
      });

      addQueue.forEach((state) => {
        state.time = this.statistics.time;
        this.input[state.key] = state;
      });
      addQueue.length = 0;

      removeQueue.forEach((key) => {
        delete this.input[key];
      });
      removeQueue.length = 0;
    });
  }

  /**
   * Start the game.
   */
  start() {
    this.addInputHandlers();
    this.loop();
  }
}
