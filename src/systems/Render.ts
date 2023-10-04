import { System } from "~/src/internals";
import { Activable } from "~/src/components/Active";
import { Physical } from "~/src/components/Physical";
import { Renderable } from "~/src/components/Render";

export class Render extends System {
  draw() {
    const entities = this.engine.state.query(Activable, Physical, Renderable);

    for (const entity of entities) {
      const renderable = this.engine.state.get(entity, Renderable);
      const physical = this.engine.state.get(entity, Physical);

      this.engine.renderingContext.fillStyle = renderable.color;
      this.engine.renderingContext.beginPath();
      this.engine.renderingContext.rect(
        Math.round(physical.position.x),
        Math.round(physical.position.y),
        physical.size.x,
        physical.size.y
      );
      this.engine.renderingContext.fill();
      this.engine.renderingContext.closePath();
    }
  }
}
