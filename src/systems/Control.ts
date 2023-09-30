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
        const physicalData = this.engine.getData(entity, PhysicsComponent);

        physicalData.direction = new Vector(0, 0);

        if (this.engine.input.get("ArrowLeft")) {
          physicalData.direction.x -= 1;
        }
        if (this.engine.input.get("ArrowRight")) {
          physicalData.direction.x += 1;
        }
        if (this.engine.input.get("ArrowUp")) {
          physicalData.direction.y -= 1;
        }
        if (this.engine.input.get("ArrowDown")) {
          physicalData.direction.y += 1;
        }

        const space = this.engine.input.get("Space");
        if (space?.fresh) {
          physicalData.mass = physicalData.mass === 1 ? 100 : 1;
        }

        physicalData.direction.normalize();

        const v = new Vector(physicalData.direction);
        v.multiply(physicalData.acceleration);
        physicalData.velocity.add(v);
      });
  }
}
