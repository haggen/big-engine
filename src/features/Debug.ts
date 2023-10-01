import { ActiveComponent } from "~/src/components/Active";
import { PhysicsComponent } from "~/src/components/Physics";
import { RenderComponent } from "~/src/components/Render";
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
  enabled = false;

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

    if (this.engine.input.get("KeyD")?.fresh) {
      data.enabled = !data.enabled;
    }

    if (!data.enabled) {
      return;
    }

    // Update keys in real time.
    if (data.text.length > 0) {
      data.text[12] = format(
        "Keys",
        Array.from(this.engine.input.keys()).toString()
      );
    }

    if (delta < 300) {
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
    const data = this.engine.getData(this.entity, Data);

    if (!data.enabled) {
      return;
    }

    this.engine.renderingContext.fillStyle = "rgba(0, 0, 0, .8)";
    this.engine.renderingContext.fillRect(
      data.position.x,
      data.position.y,
      135,
      data.text.length * 14
    );

    this.engine.renderingContext.fillStyle = "white";
    this.engine.renderingContext.font = "12px monospace";
    this.engine.renderingContext.textBaseline = "top";

    for (let i = 0; i < data.text.length; i++) {
      this.engine.renderingContext.fillText(
        data.text[i]!,
        data.position.x,
        data.position.y + i * 14
      );
    }

    const entities = this.engine.getEntityByComponent(
      ActiveComponent,
      PhysicsComponent,
      RenderComponent
    );

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]!;
      const physical = this.engine.getData(entity, PhysicsComponent);

      // Draw an arrow to show velocity
      this.engine.renderingContext.strokeStyle = "green";
      this.engine.renderingContext.beginPath();
      this.engine.renderingContext.moveTo(
        physical.position.x + physical.size.x / 2,
        physical.position.y + physical.size.y / 2
      );
      this.engine.renderingContext.lineTo(
        physical.position.x + physical.size.x / 2 + physical.velocity.x / 10,
        physical.position.y + physical.size.y / 2 + physical.velocity.y / 10
      );
      this.engine.renderingContext.stroke();
      this.engine.renderingContext.closePath();

      const text = physical.velocity.length.toFixed(2);
      const textInfo = this.engine.renderingContext.measureText(text);
      this.engine.renderingContext.fillStyle = "green";
      this.engine.renderingContext.font = "12px monospace";
      this.engine.renderingContext.fillText(
        text,
        physical.position.x - textInfo.width,
        physical.position.y + -10
      );
    }
  }
}
