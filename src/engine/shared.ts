/**
 * Serializable type.
 */
export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: string]: Serializable }
  | { toJSON: () => Serializable };

/**
 * Time units.
 */
export enum Time {
  Second = 1000,
  Minute = 60 * Second,
  Hour = 60 * Minute,
}

/**
 * Available game events.
 */
export enum Event {
  Update = "update",
  Render = "render",
}

export namespace Handler {
  /**
   * Update event handler.
   */
  export type Update = (delta: number) => void;

  /**
   * Render event handler.
   */
  export type Render = (delta: number) => void;
}

/**
 * Any event handler.
 */
export type Handler = (...args: any[]) => void;

/**
 * An input state.
 */
export type Input = {
  /** Which key has been activated. */
  key: Key;
  /** When it was activated. */
  time: number;
  /** How long it's been activated. */
  duration: number;
  /** If it's the first tick the input has been detected. */
  fresh: boolean;
};

/**
 * Available input keys.
 */
export type Key =
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
 * Unique identifier.
 */
let nextId = 1;

/**
 * Create random unique identifier.
 */
export function createId() {
  return (nextId++).toString(36);
}

/**
 * Clamp a value between a minimum and maximum.
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
