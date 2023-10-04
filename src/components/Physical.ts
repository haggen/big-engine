import { Component, Vector } from "~/src/internals";

export class Physical extends Component {
  position = new Vector();
  size = new Vector(10, 10);
  direction = new Vector();
  velocity = new Vector();
  acceleration = 100;
  mass = 10;

  constructor(data?: Partial<Physical>) {
    super();
    Object.assign(this, data);
  }
}
