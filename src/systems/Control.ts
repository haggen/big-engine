import { System, Vector } from "~/src/internals";
import { Activable } from "~/src/components/Active";
import { Controllable } from "~/src/components/Controllable";
import { Mobile } from "~/src/components/Mobile";
import { Physical } from "~/src/components/Physical";

export class Control extends System {
  update() {
    const entities = this.engine.state.query(Activable, Controllable, Mobile);

    for (const entity of entities) {
      const physical = this.engine.state.get(entity, Physical);

      if (this.engine.input.isPressed("Mouse0")) {
        physical.direction = new Vector(this.engine.input.coordinates);
        physical.direction.subtract(physical.position);
      } else {
        physical.direction = new Vector(0, 0);

        if (this.engine.input.isPressed("ArrowLeft")) {
          physical.direction.x -= 1;
        }
        if (this.engine.input.isPressed("ArrowRight")) {
          physical.direction.x += 1;
        }
        if (this.engine.input.isPressed("ArrowUp")) {
          physical.direction.y -= 1;
        }
        if (this.engine.input.isPressed("ArrowDown")) {
          physical.direction.y += 1;
        }
      }

      physical.direction.normalize();

      const force = new Vector(physical.direction);
      force.multiply(physical.acceleration);
      physical.velocity.add(force);
    }
  }
}
