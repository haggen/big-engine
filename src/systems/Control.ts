import { ActiveComponent } from "~/src/components/Active";
import { ControlComponent } from "~/src/components/Control";
import { MobileComponent } from "~/src/components/Mobile";
import { PhysicsComponent } from "~/src/components/Physics";
import { System } from "~/src/engine/System";
import { Vector } from "~/src/engine/Vector";

export class Control extends System {
  update(delta: number) {
    this.engine
      .getEntityByComponent(ActiveComponent, ControlComponent, MobileComponent)
      .forEach((entity) => {
        const data = this.engine.getData(entity, PhysicsComponent);

        data.direction = new Vector(0, 0);

        if (this.engine.input.get("ArrowLeft")) {
          data.direction.x -= 1;
        }
        if (this.engine.input.get("ArrowRight")) {
          data.direction.x += 1;
        }
        if (this.engine.input.get("ArrowUp")) {
          data.direction.y -= 1;
        }
        if (this.engine.input.get("ArrowDown")) {
          data.direction.y += 1;
        }

        data.direction.normalize();

        const v = new Vector(data.direction);
        v.multiply(data.acceleration);
        data.velocity.add(v);
      });
  }
}
