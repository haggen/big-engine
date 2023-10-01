import { Component } from "~/src/engine/Component";
import { Vector } from "~/src/engine/Vector";

export class PhysicsComponent extends Component {
  position = new Vector();
  size = new Vector(10, 10);
  direction = new Vector();
  velocity = new Vector();
  acceleration = 100;
  mass = 10;

  constructor(data?: Partial<PhysicsComponent>) {
    super();
    Object.assign(this, data);
  }
}
