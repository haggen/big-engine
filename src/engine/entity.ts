/**
 * Unique identifier.
 */
let nextId = 1;

/**
 * Create random unique identifier.
 */
function createId() {
  return (nextId++).toString(36);
}

/**
 * Entity are things in the game world. e.g. the player, an enemy, a bullet, etc.
 */
export class Entity<T extends { [key: string]: any }> {
  /**
   * Unique identifier for this entity.
   */
  id: string;

  /**
   * Custom identifiers.
   */
  tags: string[] = [];

  /**
   * Entity data.
   */
  state: T;

  /**
   * Entity statistics.
   */
  statistics = {
    rendering: {
      /** Total frames rendered. */
      count: 0,
      /** Time spent in last frame. */
      elapsed: 0,
    },
    simulation: {
      /** Total simulation steps. */
      steps: 0,
      /** Time spent in last step. */
      elapsed: 0,
    },
  };

  constructor(initialState: T = {} as T, id: string = createId()) {
    this.state = initialState;
    this.id = id;
  }
}
