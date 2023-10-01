import { ActiveComponent } from "~/src/components/Active";
import { MobileComponent } from "~/src/components/Mobile";
import { PhysicsComponent } from "~/src/components/Physics";
import { System } from "~/src/engine/System";
import { Vector } from "~/src/engine/Vector";
import { Time } from "~/src/engine/shared";

export class Physics extends System {
  update(delta: number) {
    const entities = this.engine.getEntityByComponent(
      ActiveComponent,
      PhysicsComponent
    );

    for (let ai = 0; ai < entities.length; ai++) {
      const entityA = entities[ai]!;
      const dataA = this.engine.getData(entityA, PhysicsComponent);

      for (let bi = ai + 1; bi < entities.length; bi++) {
        const entityB = entities[bi]!;

        const dataB = this.engine.getData(entityB, PhysicsComponent);

        if (!this.isColliding(dataA, dataB)) {
          continue;
        }

        const normal = new Vector(dataA.position);
        normal.subtract(dataB.position);
        normal.normalize();

        const velocityDiff = new Vector(dataA.velocity);
        velocityDiff.subtract(dataB.velocity);

        const relativeVelocity = normal.dot(velocityDiff);

        const impulse = (2 * relativeVelocity) / (dataA.mass + dataB.mass);

        const forceA = new Vector(normal);
        forceA.multiply(impulse * dataB.mass);
        dataA.velocity.subtract(forceA);

        const forceB = new Vector(normal);
        forceB.multiply(impulse * dataA.mass);
        dataB.velocity.add(forceB);
      }

      dataA.velocity.clamp(1000);
      dataA.velocity.multiply(dataA.friction);

      if (this.engine.getData(entityA, MobileComponent)) {
        const v = new Vector(dataA.velocity);
        v.multiply(delta / Time.Second);
        dataA.position.add(v);
      }
    }
  }

  isColliding(a: PhysicsComponent, b: PhysicsComponent) {
    const al = a.position.x;
    const ar = a.position.x + a.size.x;
    const at = a.position.y;
    const ab = a.position.y + a.size.y;

    const bl = b.position.x;
    const br = b.position.x + b.size.x;
    const bt = b.position.y;
    const bb = b.position.y + b.size.y;

    if (ar < bl || al > br) {
      return false;
    }

    if (ab < bt || at > bb) {
      return false;
    }

    return true;
  }
}
