import { Engine } from "~/src/engine/Engine";
import { Vector } from "~/src/engine/Vector";
import { Control } from "~/src/systems/Control";
import { Physics } from "~/src/systems/Physics";
import { Render } from "~/src/systems/Render";
import { PhysicsComponent } from "~/src/components/Physics";
import { RenderComponent } from "~/src/components/Render";
import { ControlComponent } from "~/src/components/Control";
import * as Debug from "~/src/features/Debug";
import { ActiveComponent } from "~/src/components/Active";
import { MobileComponent } from "~/src/components/Mobile";

const canvasElement = document.querySelector("canvas");
if (!canvasElement) {
  throw new Error("No <canvas> found");
}

const game = (window.game = new Engine(canvasElement));

game.start();

game.addSystem(new Control());
game.addSystem(new Physics());
game.addSystem(new Render());
game.addSystem(new Debug.Debug());

const player = game.addEntity();

game.addComponent(player, new ActiveComponent());
game.addComponent(player, new MobileComponent());
game.addComponent(
  player,
  new PhysicsComponent({
    position: new Vector(
      game.canvasElement.width / 2,
      game.canvasElement.height / 2
    ),
    size: new Vector(30, 30),
    mass: 1,
    acceleration: 300,
  })
);
game.addComponent(player, new RenderComponent());
game.addComponent(player, new ControlComponent());

for (let i = 0; i < 800; i++) {
  const box = game.addEntity();

  game.addComponent(box, new ActiveComponent());
  game.addComponent(box, new MobileComponent());
  game.addComponent(
    box,
    new PhysicsComponent({
      position: new Vector(
        game.canvasElement.width * Math.random(),
        game.canvasElement.height * Math.random()
      ),
      size: new Vector(3, 3),
      mass: 1,
      friction: 0.95,
    })
  );
  game.addComponent(box, new RenderComponent({ color: "black" }));
}
