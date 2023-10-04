import type { Component, Engine } from "~/src/internals";
import { createId } from "~/src/shared/createId";

/**
 * State manager.
 */
export class StateManager {
  engine: Engine;

  data = new Map<string, Map<typeof Component, Component>>();

  constructor(engine: Engine) {
    this.engine = engine;
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
   * @param components The component.
   */
  addComponent<T extends Component>(entity: string, ...components: T[]) {
    const data = this.data.get(entity);

    if (!data) {
      throw new Error(`Entity ${entity} not found`);
    }

    for (const component of components) {
      data.set(component.constructor as typeof Component, component);
    }
  }

  /**
   * Remove component from an entity.
   *
   * @param entity The entity.
   */
  removeComponent<T extends typeof Component>(
    entity: string,
    ...components: T[]
  ) {
    const data = this.data.get(entity);

    if (!data) {
      throw new Error(`Entity ${entity} not found`);
    }

    for (const component of components) {
      data.delete(component);
    }
  }

  /**
   * Get component data for an entity.
   *
   * @param entity The entity.
   * @param component Component type.
   */
  get<T extends typeof Component>(entity: string, component: T) {
    const data = this.data.get(entity);

    if (!data) {
      throw new Error(`Entity ${entity} not found`);
    }

    return data.get(component) as InstanceType<T>;
  }

  /**
   * Find one or more entities by their components.
   *
   * @param components List of components to match.
   */
  query(...components: (typeof Component)[]) {
    const result = [];

    loop: for (const [entity, data] of this.data) {
      for (const component of components) {
        if (!data.has(component)) {
          continue loop;
        }
      }

      result.push(entity);
    }

    return result;
  }
}
