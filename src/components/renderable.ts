import { Component } from "../engine/component";

export class Renderable extends Component {
  color: string;

  constructor(color: string) {
    super();

    this.color = color;
  }
}
