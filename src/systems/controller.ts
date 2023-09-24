import { Controllable } from "../components/controllable";
import { Physical } from "../components/physical";
import { Time } from "../engine/shared";
import { System } from "../engine/system";
import { Vector } from "../engine/vector";

export class Controller extends System {
  update(delta: number) {
    this.engine
      .getEntityByComponent(Physical, Controllable)
      .forEach((entity) => {
        const physical = this.engine.getData(entity, Physical);
        const controllable = this.engine.getData(entity, Controllable);

        const up = this.engine.input.get("ArrowUp");
        if (up?.fresh) {
          const v = new Vector(0, -1);
          v.multiply(controllable.jumpAccel);
          physical.velocity.add(v);
        }

        const down = this.engine.input.get("ArrowDown");
        if (down) {
          const v = new Vector(0, 1);
          v.multiply(physical.acceleration);
          v.multiply(delta / Time.Second);
          physical.velocity.add(v);
        }

        const left = this.engine.input.get("ArrowLeft");
        if (left) {
          const v = new Vector(-1, 0);
          v.multiply(physical.acceleration);
          v.multiply(delta / Time.Second);
          physical.velocity.add(v);
        }

        const right = this.engine.input.get("ArrowRight");
        if (right) {
          const v = new Vector(1, 0);
          v.multiply(physical.acceleration);
          v.multiply(delta / Time.Second);
          physical.velocity.add(v);
        }
      });
  }
}
