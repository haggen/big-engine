import { ActiveComponent } from "~/src/components/Active";
import { PhysicsComponent } from "~/src/components/Physics";
import { RenderComponent } from "~/src/components/Render";
import { System } from "~/src/engine/System";

export class Render extends System {
  render() {
    this.engine
      .getEntityByComponent(ActiveComponent, PhysicsComponent, RenderComponent)
      .forEach((entity) => {
        const renderable = this.engine.getData(entity, RenderComponent);
        const physical = this.engine.getData(entity, PhysicsComponent);

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
