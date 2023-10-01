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
import { Time } from "~/src/engine/shared";
import { System } from "~/src/engine/System";
import { Component } from "~/src/engine/Component";

const canvasElement = document.querySelector("canvas");
if (!canvasElement) {
  throw new Error("No <canvas> found");
}
canvasElement.width = window.innerWidth * 0.9;
canvasElement.height = window.innerHeight * 0.9;

const game = new Engine(canvasElement);
game.config.simulation.rate = Time.Second / 50;
game.start();

class BoxComponent extends Component {}

class CustomSystem extends System {
  update(delta: number) {
    if (this.engine.input.get("Enter")?.fresh) {
      this.spawnMoreBoxes();
    }
    if (this.engine.input.get("Backspace")?.fresh) {
      this.deleteBoxes();
    }

    const player = this.engine.getEntityByComponent(ControlComponent);
    const physicalData = this.engine.getData(player[0]!, PhysicsComponent);

    const space = this.engine.input.get("Space");
    if (space?.fresh) {
      physicalData.mass = physicalData.mass === 100 ? 2000 : 100;
      physicalData.acceleration = physicalData.mass === 100 ? 100 : 1000;
    }

    const boxes = this.engine.getEntityByComponent(BoxComponent);
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]!;
      const physicalData = this.engine.getData(box, PhysicsComponent);

      if (
        physicalData.position.x + physicalData.size.x < 0 ||
        physicalData.position.x > this.engine.canvasElement.width
      ) {
        this.engine.removeEntity(box);
      }
      if (
        physicalData.position.y + physicalData.size.y < 0 ||
        physicalData.position.y > this.engine.canvasElement.height
      ) {
        this.engine.removeEntity(box);
      }
    }
  }

  render() {
    const boxes = this.engine.getEntityByComponent(BoxComponent);
    const player = this.engine.getEntityByComponent(ControlComponent);
    const playerData = this.engine.getData(player[0]!, PhysicsComponent);

    this.engine.renderingContext.textBaseline = "top";
    this.engine.renderingContext.font = "bold 14px monospace";
    this.engine.renderingContext.fillStyle = "red";
    this.engine.renderingContext.strokeStyle = "white";
    this.engine.renderingContext.lineWidth = 1;

    const text = `BOXES [enter/backspace]: ${boxes.length}     PLAYER MASS [space]: ${playerData.mass}     DEBUG [d]`;

    this.engine.renderingContext.fillText(
      text,
      this.engine.canvasElement.width / 2 -
        this.engine.renderingContext.measureText(text).width / 2,
      10
    );
  }

  deleteBoxes() {
    const boxes = this.engine.getEntityByComponent(BoxComponent);
    for (let i = 0; i < 100; i++) {
      this.engine.removeEntity(boxes[i]!);
    }
  }

  spawnMoreBoxes() {
    for (let i = 0; i < 100; i++) {
      const box = game.addEntity();

      game.addComponent(box, new BoxComponent());
      game.addComponent(box, new ActiveComponent());
      game.addComponent(box, new MobileComponent());
      game.addComponent(
        box,
        new PhysicsComponent({
          position: new Vector(
            game.canvasElement.width * Math.random(),
            game.canvasElement.height * Math.random()
          ),
          size: new Vector(5, 5),
          mass: 50,
        })
      );
      game.addComponent(box, new RenderComponent({ color: "black" }));
    }
  }
}

game.addSystem(new Control());
game.addSystem(new Physics());
game.addSystem(new Render());
game.addSystem(new CustomSystem());
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
    size: new Vector(20),
    mass: 100,
    acceleration: 100,
  })
);
game.addComponent(player, new RenderComponent());
game.addComponent(player, new ControlComponent());
