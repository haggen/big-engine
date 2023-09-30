import { Component } from "~/src/engine/Component";
import { Time } from "~/src/engine/shared";
import { System } from "~/src/engine/System";
import { Vector } from "~/src/engine/Vector";

function format(label: string, value: string | number) {
  if (typeof value === "number") {
    value = value.toFixed(2).padStart(10);
  }
  return `${label.padEnd(10)}${value}`;
}

export class Data extends Component {
  text: string[] = [];
  position = new Vector();

  constructor(data?: Partial<Data>) {
    super();
    Object.assign(this, data);
  }
}

export class Debug extends System {
  checkpoint: number = 0;
  entity: string = "debug";

  install() {
    this.checkpoint = this.engine.stats.time;

    this.engine.addEntity(this.entity);
    this.engine.addComponent(this.entity, new Data());
  }

  update() {
    const delta = this.engine.stats.time - this.checkpoint;
    const data = this.engine.getData(this.entity, Data);

    // Update keys in real time.
    if (data.text.length > 0) {
      data.text[12] = format(
        "Keys",
        Array.from(this.engine.input.keys()).toString()
      );
    }

    if (delta < 500) {
      return;
    }

    data.text = [];

    data.text.push("--Rendering".padEnd(20, "-"));
    data.text.push(format("Count", this.engine.stats.rendering.count));
    data.text.push(format("Rate", this.engine.stats.rendering.rate));
    data.text.push(format("Delta", this.engine.stats.rendering.delta));
    data.text.push(format("Duration", this.engine.stats.rendering.duration));

    data.text.push("--Simulation".padEnd(20, "-"));
    data.text.push(format("Steps", this.engine.stats.simulation.steps));
    data.text.push(
      format("Rate", Time.Second / this.engine.config.simulation.rate)
    );
    data.text.push(format("Delta", this.engine.stats.simulation.delta));
    data.text.push(format("Duration", this.engine.stats.simulation.duration));
    data.text.push(format("Drift", this.engine.stats.simulation.drift));

    data.text.push("--Input".padEnd(20, "-"));
    data.text.push(
      format("Keys", Array.from(this.engine.input.keys()).toString())
    );

    this.checkpoint = this.engine.stats.time;
  }

  render() {
    this.engine.renderingContext.fillStyle = "red";
    this.engine.renderingContext.font = "14px monospace";
    this.engine.renderingContext.textBaseline = "top";

    const data = this.engine.getData(this.entity, Data);

    for (let i = 0; i < data.text.length; i++) {
      this.engine.renderingContext.fillText(
        data.text[i]!,
        data.position.x,
        data.position.y + i * 16
      );
    }
  }
}
