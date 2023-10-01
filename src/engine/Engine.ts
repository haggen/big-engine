import { Component } from "~/src/engine/Component";
import { System } from "~/src/engine/System";
import { Event, Time, createId } from "~/src/engine/shared";
import type { Key, Input, Handler } from "~/src/engine/shared";

/**
 * The engine is responsible for:
 * - Organizing and retrieving game data.
 * - Executing the game loop.
 * - Providing web APIs for the systems.
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
    simulation: {
      /** Simulation rate, in milliseconds. */
      rate: Time.Second / 60,
    },
    rendering: {
      /** Whether the rendering is paused. */
      paused: false,
    },
  };

  /**
   * Game statistics.
   */
  stats = {
    /** Time of the last game tick. */
    time: 0,

    simulation: {
      /** Total simulation steps. */
      steps: 0,
      /** Time spent in last step. */
      duration: 0,
      /** Time since last step. */
      delta: 0,
      /** Accumulated time since last fixed step. */
      drift: 0,
    },

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
   * Map of system types and their instances.
   */
  systems = new Map<typeof System, System>();

  /**
   * Set of entity ids.
   */
  // entities = new Set<string>();

  /**
   * An index of components by entitiy ids.
   */
  data = new Map<string, Map<typeof Component, Component>>();

  /**
   * An index of entities by component types.
   */
  // dataInvertedIndex = new Map<typeof Component, Set<string>>();

  /**
   * Map of input keys and their state.
   */
  input = new Map<Key, Input>();

  /**
   * Map of events and a set of their handlers.
   */
  eventHandlers = new Map<Event, Set<Handler>>();

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
  }

  /**
   * Handle game event.
   */
  addEventHandler(event: Event.Update, handler: Handler.Update): void;
  addEventHandler(event: Event.Render, handler: Handler.Render): void;
  addEventHandler(event: Event, handler: Handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  /**
   * Unregister event handler.
   */
  removeEventHandler(event: Event.Update, handler: Handler.Update): void;
  removeEventHandler(event: Event.Render, handler: Handler.Render): void;
  removeEventHandler(event: Event, handler: Handler) {
    this.eventHandlers.get(event)?.delete(handler);
  }

  /**
   * Dispatch game event.
   */
  dispatchEvent(event: Event, ...args: any[]) {
    const handlers = this.eventHandlers.get(event) ?? [];
    for (const handler of handlers) {
      handler(...args);
    }
  }

  /**
   * Add a system to the game.
   */
  addSystem<T extends System>(system: T) {
    this.systems.set(system.constructor as typeof System, system);

    system.engine = this;

    system.install();

    this.addEventHandler(Event.Update, (delta) => system.update(delta));
    this.addEventHandler(Event.Render, (delta) => system.render(delta));
  }

  /**
   * Add an entity to the game.
   */
  addEntity(entity: string = createId()) {
    this.data.set(entity, new Map());
    return entity;
  }

  /**
   * Remove an entity from the game.
   */
  removeEntity(entity: string) {
    this.data.delete(entity);
  }

  /**
   * Add component to an entity.
   *
   * @param entity The entity.
   * @param component The component.
   */
  addComponent<T extends Component>(entity: string, component: T) {
    if (!this.data.has(entity)) {
      throw new Error(`Entity ${entity} not found`);
    }
    this.data
      .get(entity)!
      .set(component.constructor as typeof Component, component);
  }

  /**
   * Remove component from an entity.
   *
   * @param entity The entity.
   */
  removeComponent<T extends typeof Component>(entity: string, component: T) {
    if (!this.data.has(entity)) {
      throw new Error(`Entity ${entity} not found`);
    }
    this.data.get(entity)!.delete(component);
  }

  /**
   * Get component data for an entity.
   *
   * @param entity The entity.
   * @param component Component type.
   */
  getData<T extends typeof Component>(entity: string, component: T) {
    const components = this.data.get(entity);
    if (!components) {
      throw new Error(`Entity ${entity} not found`);
    }
    return components.get(component) as InstanceType<T>;
  }

  /**
   * Find one or more entities by their components.
   *
   * @param components List of components to match.
   */
  getEntityByComponent(...components: (typeof Component)[]) {
    const entities = Array.from(this.data.keys());
    const result = [];

    loop: for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]!;

      for (let j = 0; j < components.length; j++) {
        const component = components[j]!;

        if (!this.data.get(entity)!.has(component)) {
          continue loop;
        }
      }

      result.push(entity);
    }

    return result;
  }

  /**
   * Advance game simulation.
   *
   * @param delta Time since last update, in milliseconds.
   */
  update(delta: number) {
    const now = performance.now();

    this.dispatchEvent(Event.Update, delta);

    this.stats.simulation.steps += 1;
    this.stats.simulation.delta = delta;
    this.stats.simulation.duration = performance.now() - now;
  }

  /**
   * Draw a frame.
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

    this.dispatchEvent(Event.Render, delta);

    this.stats.rendering.count += 1;
    this.stats.rendering.rate = Time.Second / delta;
    this.stats.rendering.delta = delta;
    this.stats.rendering.duration = performance.now() - now;
  }

  /**
   * Updates and renders the game.
   */
  step() {
    const { stats, config } = this;

    // Get time elapsed since last tick.
    const time = performance.now();
    const delta = time - this.stats.time;

    stats.time = time;

    // Limit drift.
    if (stats.simulation.drift < Time.Second) {
      stats.simulation.drift += delta;
    }

    // Simulate the game in a fixed rate, accounting for drift, i.e. leftover time between updates.
    while (stats.simulation.drift >= config.simulation.rate) {
      stats.simulation.drift -= config.simulation.rate;
      this.update(config.simulation.rate);
    }

    this.render(delta);
  }

  /**
   * Listen to input.
   */
  handleInput() {
    // Use queues to avoid changing state in between updates.
    const freshKeyQueue: Key[] = [];
    const staleKeyQueue: Key[] = [];

    this.canvasElement.addEventListener("keydown", (e) => {
      e.preventDefault();

      // Prevent duplicate keydown events.
      if (e.repeat) {
        return;
      }

      freshKeyQueue.push(e.code as Key);
    });

    this.canvasElement.addEventListener("mousedown", (e) => {
      freshKeyQueue.push(`Mouse${e.button}` as Key);
    });

    // Listen on window to end inputs even if the canvas loses focus.
    window.addEventListener("keyup", (e) => {
      staleKeyQueue.push(e.code as Key);
    });
    window.addEventListener("mouseup", (e) => {
      staleKeyQueue.push(`Mouse${e.button}` as Key);
    });

    // Prevent the context menu on right-click.
    this.canvasElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Update input state and execute fresh and stale key queues.
    this.addEventHandler(Event.Update, (delta) => {
      // Remove stale keys first so we don't update them needlessly.
      for (const key of staleKeyQueue.values()) {
        this.input.delete(key);
      }
      staleKeyQueue.length = 0;

      for (const input of this.input.values()) {
        input.duration += delta;
        input.fresh = false;
      }

      // Add fresh input last so we don't update them needlessly.
      for (const key of freshKeyQueue.values()) {
        this.input.set(key, {
          key,
          time: this.stats.time,
          duration: 0,
          fresh: true,
        });
      }
      freshKeyQueue.length = 0;
    });
  }

  /**
   * Start the game.
   */
  start() {
    this.handleInput();

    // const loop = () => (this.step(), requestAnimationFrame(loop));
    const loop = () => {
      this.step();
      requestAnimationFrame(loop);
    };

    loop();
  }
}
