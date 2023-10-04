import { Component } from "~/src/internals/Component";

export class Renderable extends Component {
  color = "fuchsia";

  constructor(data?: Partial<Renderable>) {
    super();
    Object.assign(this, data);
  }
}
