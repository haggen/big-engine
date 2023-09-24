import { Component } from "../engine/component";
import { Vector } from "../engine/vector";

export class Physical extends Component {
  position: Vector;
  size: Vector;
  direction: Vector;
  velocity: Vector;
  acceleration: number;
  friction: number;

  constructor(data?: Partial<Physical>) {
    super();

    this.position = data?.position ?? new Vector();
    this.size = data?.size ?? new Vector();
    this.direction = data?.direction ?? new Vector();
    this.velocity = data?.velocity ?? new Vector();
    this.acceleration = data?.acceleration ?? 1;
    this.friction = data?.friction ?? 0.9;
  }
}
