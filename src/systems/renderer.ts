import { Physical } from "../components/physical";
import { Renderable } from "../components/renderable";
import { System } from "../engine/system";

export class Renderer extends System {
  render() {
    this.engine.getEntityByComponent(Physical, Renderable).forEach((entity) => {
      const renderable = this.engine.getData(entity, Renderable);
      const physical = this.engine.getData(entity, Physical);

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
    });
  }
}
