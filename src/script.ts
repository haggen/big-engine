import { System, Component, Engine, Vector } from "~/src/internals";
import { Control } from "~/src/systems/Control";
import { Physics } from "~/src/systems/Physics";
import { Render } from "~/src/systems/Render";
import { Physical } from "~/src/components/Physical";
import { Renderable } from "~/src/components/Render";
import { Controllable } from "~/src/components/Controllable";
import * as Debug from "~/src/features/Debug";
import { Activable } from "~/src/components/Active";
import { Mobile } from "~/src/components/Mobile";
import { Time } from "~/src/shared/Time";

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

    const player = this.engine.state.query(Controllable);
    const physicalData = this.engine.state.get(player[0]!, Physical);

    const space = this.engine.input.get("Space");
    if (space?.fresh) {
      physicalData.mass = physicalData.mass === 100 ? 2000 : 100;
      physicalData.acceleration = physicalData.mass * 2;
    }

    const boxes = this.engine.state.query(BoxComponent);
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]!;
      const physicalData = this.engine.state.get(box, Physical);

      if (
        physicalData.position.x + physicalData.size.x < 0 ||
        physicalData.position.x > this.engine.canvasElement.width
      ) {
        this.engine.state.removeEntity(box);
      }
      if (
        physicalData.position.y + physicalData.size.y < 0 ||
        physicalData.position.y > this.engine.canvasElement.height
      ) {
        this.engine.state.removeEntity(box);
      }
    }
  }

  draw() {
    const boxes = this.engine.state.query(BoxComponent);
    const player = this.engine.state.query(Controllable);
    const playerPhysical = this.engine.state.get(player[0]!, Physical);

    this.engine.renderingContext.textBaseline = "top";
    this.engine.renderingContext.font = "bold 14px monospace";
    this.engine.renderingContext.fillStyle = "red";
    this.engine.renderingContext.strokeStyle = "white";
    this.engine.renderingContext.lineWidth = 1;

    const text = `BOXES [enter/backspace]: ${boxes.length}     PLAYER MASS [space]: ${playerPhysical.mass}     DEBUG [d]`;

    this.engine.renderingContext.fillText(
      text,
      this.engine.canvasElement.width / 2 -
        this.engine.renderingContext.measureText(text).width / 2,
      10
    );
  }

  deleteBoxes() {
    const boxes = this.engine.state.query(BoxComponent);
    for (let i = 0; i < 100; i++) {
      this.engine.state.removeEntity(boxes[i]!);
    }
  }

  spawnMoreBoxes() {
    for (let i = 0; i < 100; i++) {
      const box = game.state.addEntity();

      game.state.addComponent(box, new BoxComponent());
      game.state.addComponent(box, new Activable());
      game.state.addComponent(box, new Mobile());
      game.state.addComponent(
        box,
        new Physical({
          position: new Vector(
            game.canvasElement.width * Math.random(),
            game.canvasElement.height * Math.random()
          ),
          size: new Vector(5, 5),
          mass: 50,
        })
      );
      game.state.addComponent(box, new Renderable({ color: "black" }));
    }
  }
}

game.addSystem(new Control());
game.addSystem(new Physics());
game.addSystem(new Render());
game.addSystem(new CustomSystem());
game.addSystem(new Debug.Debug());

const player = game.state.addEntity();
game.state.addComponent(player, new Activable());
game.state.addComponent(player, new Mobile());
game.state.addComponent(
  player,
  new Physical({
    position: new Vector(
      game.canvasElement.width / 2,
      game.canvasElement.height / 2
    ),
    size: new Vector(20),
    mass: 100,
    acceleration: 200,
  })
);
game.state.addComponent(player, new Renderable());
game.state.addComponent(player, new Controllable());
