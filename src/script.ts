import { Engine } from "./engine/engine";
import { Vector } from "./engine/vector";
import { Controller } from "./systems/controller";
import { Physics } from "./systems/physics";
import { Renderer } from "./systems/renderer";
import { Physical } from "./components/physical";
import { Renderable } from "./components/renderable";
import { Controllable } from "./components/controllable";
import * as Debug from "./features/Debug";

const canvasElement = document.querySelector("canvas");
if (!canvasElement) {
  throw new Error("No <canvas> found");
}

export const game = new Engine(canvasElement);

game.start();

game.addSystem(new Physics());
game.addSystem(new Controller());
game.addSystem(new Renderer());
game.addSystem(new Debug.Debug());

const player = game.addEntity();

game.addComponent(
  player,
  new Physical({
    size: new Vector(10, 10),
    acceleration: 200,
    friction: 0.8,
  })
);
game.addComponent(player, new Renderable("blue"));
game.addComponent(
  player,
  new Controllable({
    jumpAccel: 2000,
  })
);
