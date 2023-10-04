import { Engine } from "./Engine";

/**
 * A system is a process which acts on all entities with the desired components. For example, a physics system may query for entities having mass, velocity and position components, and iterate over the results doing physics calculations on the sets of components for each entity.
 */
export class System {
  /**
   * A game engine instance.
   */
  engine!: Engine;

  /**
   * Called when the system is installed on the engine.
   */
  install() {}

  /**
   * Update the game state.
   * @param delta Time since last update, in milliseconds.
   */
  update(delta: number) {}

  /**
   * Draw a frame.
   * @param delta Time since last draw, in milliseconds.
   */
  draw(delta: number) {}
}
