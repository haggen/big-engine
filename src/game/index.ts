import { Game } from "../engine/game";

const canvasElement = document.querySelector("canvas");
if (!canvasElement) {
  throw new Error("No <canvas> found");
}

export const game = new Game(canvasElement);
