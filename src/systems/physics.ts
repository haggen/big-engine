import { Physical } from "../components/physical";
import { Time } from "../engine/shared";
import { System } from "../engine/system";
import { Vector } from "../engine/vector";

export class Physics extends System {
  update(delta: number) {
    this.engine.getEntityByComponent(Physical).forEach((entity) => {
      const physical = this.engine.getData(entity, Physical);

      const gravity = new Vector(0, 200);
      gravity.multiply(delta / Time.Second);

      physical.velocity.multiply(physical.friction);
      physical.velocity.add(gravity);
      physical.velocity.clamp(200);

      physical.position.add(physical.velocity);

      physical.position.x = Math.clamp(
        physical.position.x,
        0,
        this.engine.canvasElement.width - physical.size.x
      );
      physical.position.y = Math.clamp(
        physical.position.y,
        0,
        this.engine.canvasElement.height - physical.size.y
      );
    });
  }
}
