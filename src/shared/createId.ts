/**
 * Unique identifier.
 */
let nextId = 1;

/**
 * Create random unique identifier.
 */
export function createId() {
  return (nextId++).toString(36);
}
