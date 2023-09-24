import { Engine } from "./engine";

/**
 * Systems handle data and executes logic.
 * You should always use the engine to interface with the browser.
 */
export class System {
  engine: Engine;

  install() {}
  update(delta: number) {}
  render(delta: number) {}
}
