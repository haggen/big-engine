import { Component } from "~/src/engine/Component";

export class RenderComponent extends Component {
  color = "fuchsia";

  constructor(data?: Partial<RenderComponent>) {
    super();
    Object.assign(this, data);
  }
}
