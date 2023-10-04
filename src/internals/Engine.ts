import { InputHandler, StateManager, System } from "~/src/internals";
import { Time } from "~/src/shared/Time";

/**
 * The engine is responsible for:
 *
 * - Organizing the internals.
 * - Executing the game loop.
 */
export class Engine {
  /**
   * Canvas element.
   */
  canvasElement: HTMLCanvasElement;

  /**
   * Rendering context.
   */
  renderingContext: CanvasRenderingContext2D;

  /**
   * Game configuration.
   */
  config = {
    /** Simulation configuration. */
    simulation: {
      /** Simulation rate, in milliseconds. */
      rate: Time.Second / 50,
    },
  };

  /**
   * Game statistics.
   */
  stats = {
    /** Time of the last game tick. */
    time: 0,
    /** Simulation statistics. */
    simulation: {
      /** Total simulation steps. */
      count: 0,
      /** Time since last step. */
      delta: 0,
      /** Time spent in last step. */
      duration: 0,
      /** Accumulated time since last fixed step. */
      drift: 0,
    },
    /** Rendering statistics. */
    rendering: {
      /** Total frames rendered. */
      count: 0,
      /** Frames per second. */
      rate: 0,
      /** Time since last rendered frame. */
      delta: 0,
      /** Time spent in last frame. */
      duration: 0,
    },
  };

  /**
   * Systems attached to the game.
   */
  systems = new Map<typeof System, System>();

  /**
   * State manager.
   */
  state: StateManager;

  /**
   * Input handler.
   */
  input: InputHandler;

  /**
   * Game constructor.
   */
  constructor(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
    const context = canvasElement.getContext("2d");
    if (!context) {
      throw new Error("Couldn't get rendering context");
    }
    this.renderingContext = context;

    this.input = new InputHandler(this);
    this.state = new StateManager(this);
  }

  /**
   * Add a system to the game.
   */
  addSystem<T extends System>(system: T) {
    this.systems.set(system.constructor as typeof System, system);

    system.engine = this;

    system.install();
  }

  /**
   * Update game state.
   *
   * @param delta Time since last update, in milliseconds.
   */
  update(delta: number) {
    const now = performance.now();

    this.input.update(delta);

    for (const [, system] of this.systems) {
      system.update(delta);
    }

    this.stats.simulation.count += 1;
    this.stats.simulation.delta = delta;
    this.stats.simulation.duration = performance.now() - now;
  }

  /**
   * Draw a frame.
   *
   * @param delta Time since last update, in milliseconds.
   */
  draw(delta: number) {
    const now = performance.now();

    this.renderingContext.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    for (const system of this.systems.values()) {
      system.draw(delta);
    }

    this.stats.rendering.count += 1;
    this.stats.rendering.rate = Time.Second / delta;
    this.stats.rendering.delta = delta;
    this.stats.rendering.duration = performance.now() - now;
  }

  /**
   * Game tick.
   */
  tick() {
    const { config, stats } = this;

    const time = performance.now();
    const delta = time - this.stats.time;

    stats.time = time;

    // Prevent drift from ballooning.
    stats.simulation.drift += Math.min(delta, Time.Second);

    // Update game state at a fixed rate, accounting for drift, i.e. leftover time between updates.
    while (stats.simulation.drift >= config.simulation.rate) {
      stats.simulation.drift -= config.simulation.rate;
      this.update(config.simulation.rate);
    }

    this.draw(delta);
  }

  /**
   * Start the game.
   */
  start() {
    const loop = () => (this.tick(), requestAnimationFrame(loop));
    loop();
  }
}
