import { createId } from "./shared";

export class Entity {
  /**
   * Entity unique identifier.
   */
  id: string;

  /**
   * Entity constructor.
   */
  constructor(id = createId()) {
    this.id = id;
  }
}
