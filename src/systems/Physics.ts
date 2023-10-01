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

    for (let indexA = 0; indexA < entities.length; indexA++) {
      const entityA = entities[indexA]!;
      const dataA = this.engine.getData(entityA, PhysicsComponent);

      for (let indexB = indexA + 1; indexB < entities.length; indexB++) {
        const entityB = entities[indexB]!;
        const dataB = this.engine.getData(entityB, PhysicsComponent);

        if (!this.isColliding(dataA, dataB)) {
          continue;
        }

        const centerA = new Vector(dataA.position);
        centerA.add(dataA.size.x / 2, dataA.size.y / 2);

        const centerB = new Vector(dataB.position);
        centerB.add(dataB.size.x / 2, dataB.size.y / 2);

        const collision = new Vector(centerA);
        collision.subtract(centerB);
        collision.normalize();

        const velocityDiff = new Vector(dataA.velocity);
        velocityDiff.subtract(dataB.velocity);

        const relativeVelocity = collision.dot(velocityDiff);

        const impulse = (2 * relativeVelocity) / (dataA.mass + dataB.mass);

        const forceA = new Vector(collision);
        forceA.multiply(impulse * dataB.mass);
        dataA.velocity.subtract(forceA);

        const forceB = new Vector(collision);
        forceB.multiply(impulse * dataA.mass);
        dataB.velocity.add(forceB);
      }

      dataA.velocity.divide(1 + dataA.mass / 1000);
      dataA.velocity.clamp(1000);

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
