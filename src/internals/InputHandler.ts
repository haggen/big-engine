import { Vector, type Engine } from "~/src/internals";

/**
 * Input keys.
 */
export type InputKey =
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
 * Input state.
 */
export type Input = {
  /** Input key. */
  key: InputKey;
  /** When it was activated. */
  time: number;
  /** How long it's been activated. */
  duration: number;
  /** If it's the first update the input has been detected. */
  fresh: boolean;
  /** If it's the last update the input is active. */
  stale: boolean;
  /** Screenspace cursor coordinates. */
  coordinates: Vector;
};

/**
 * Handle input.
 */
export class InputHandler {
  /**
   * Game engine instance.
   */
  engine: Engine;

  /**
   * Input queues.
   */
  queue = {
    fresh: new Set<Input>(),
    stale: new Set<InputKey>(),
  };

  /**
   * Input state.
   */
  state = new Map<InputKey, Input>();

  /**
   * Cursor coordinates.
   */
  coordinates = new Vector(0);

  /**
   * Input handler constructor.
   */
  constructor(engine: Engine) {
    this.engine = engine;

    engine.canvasElement.addEventListener("keydown", (e) => {
      e.preventDefault();

      // Prevent duplicate keydown events.
      if (e.repeat) {
        return;
      }

      this.queue.fresh.add({
        key: e.code as InputKey,
        time: engine.stats.time,
        duration: 0,
        coordinates: new Vector(0),
        fresh: true,
        stale: false,
      });
    });

    engine.canvasElement.addEventListener("mousedown", (e) => {
      this.queue.fresh.add({
        key: `Mouse${e.button}` as InputKey,
        time: engine.stats.time,
        duration: 0,
        coordinates: new Vector(e.offsetX, e.offsetY),
        fresh: true,
        stale: false,
      });
    });

    engine.canvasElement.addEventListener("mousemove", (e) => {
      this.coordinates.x = e.offsetX;
      this.coordinates.y = e.offsetY;
    });

    // Listen on window to finish input state even if the canvas loses focus.
    window.addEventListener("keyup", (e) => {
      this.queue.stale.add(e.code as InputKey);
    });

    window.addEventListener("mouseup", (e) => {
      this.queue.stale.add(`Mouse${e.button}` as InputKey);
    });

    // Prevent the context menu on right-click.
    engine.canvasElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  isFresh(key: InputKey) {
    return this.state.get(key)?.fresh ?? false;
  }

  isStale(key: InputKey) {
    return this.state.get(key)?.stale ?? false;
  }

  isPressed(key: InputKey) {
    return this.state.has(key);
  }

  get(key: InputKey) {
    return this.state.get(key);
  }

  update(delta: number) {
    const marked = new Set<InputKey>();

    for (const [, input] of this.state) {
      input.duration += delta;
      input.fresh = false;

      if (input.stale) {
        marked.add(input.key);
      }
    }

    for (const key of marked) {
      this.state.delete(key);
    }

    for (const key of this.queue.stale) {
      const input = this.state.get(key);
      if (input) {
        input.stale = true;
      }
    }
    this.queue.stale.clear();

    for (const input of this.queue.fresh) {
      this.state.set(input.key, input);
    }
    this.queue.fresh.clear();
  }
}
