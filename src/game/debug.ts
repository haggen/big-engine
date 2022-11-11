import { Entity } from "../engine/entity";
import { Vector } from "../engine/vector";

import { game } from ".";

type State = {
  position: Vector;
  text: string[];
  visible: boolean;
};

function format(title: string, value: string) {
  return `${title.padEnd(12)} ${value}`;
}

export const perfOverlay = new Entity<State>({
  position: new Vector(7, 7),
  text: [],
  visible: true,
});
game.addEntity(perfOverlay);

game.addEventHandler("render", () => {
  const { renderingContext } = game;

  if (!perfOverlay.state.visible) {
    return;
  }

  renderingContext.fillStyle = "red";
  renderingContext.font = "14px monospace";
  renderingContext.textBaseline = "top";

  const position = new Vector(perfOverlay.state.position);
  perfOverlay.state.text.forEach((text) => {
    renderingContext.fillText(text, position.x, position.y);
    position.add(0, 14);
  });
});

game.addEventHandler("update", () => {
  const { statistics } = game;
  const { text } = perfOverlay.state;

  if (game.input.F1?.fresh) {
    console.log("F1 pressed");
    perfOverlay.state.visible = !perfOverlay.state.visible;
  }

  const time = (statistics.time / 1000).toFixed(2);
  const rendering = {
    count: statistics.rendering.count,
    rate: statistics.rendering.rate.toFixed(2),
    elapsed: statistics.rendering.elapsed.toFixed(2),
  };
  const simulation = {
    steps: statistics.simulation.steps,
    rate: (1000 / game.config.simulation.rate).toFixed(2),
    elapsed: statistics.simulation.elapsed.toFixed(2),
  };

  text[0] = format("Time", `${time}s`);
  text[1] = format(
    "Rendering",
    `${rendering.rate}/s ${rendering.elapsed}s (${rendering.count})`
  );
  text[2] = format(
    "Simulation",
    `${simulation.rate}/s ${simulation.elapsed}s (${simulation.steps})`
  );
});

// ---

export const inputOverlay = new Entity<State>({
  position: new Vector(game.canvasElement.width - 200, 7),
  text: [],
  visible: true,
});
game.addEntity(inputOverlay);

game.addEventHandler("render", () => {
  const { renderingContext } = game;

  if (!inputOverlay.state.visible) {
    return;
  }

  renderingContext.fillStyle = "red";
  renderingContext.font = "14px monospace";
  renderingContext.textBaseline = "top";

  const position = new Vector(inputOverlay.state.position);
  inputOverlay.state.text.forEach((text) => {
    renderingContext.fillText(text, position.x, position.y);
    position.add(0, 14);
  });
});

game.addEventHandler("update", () => {
  if (game.input.F1?.fresh) {
    inputOverlay.state.visible = !inputOverlay.state.visible;
  }

  inputOverlay.state.text = [];

  Object.values(game.input).forEach((state, index) => {
    inputOverlay.state.text[index] = `${state.key} ${
      state.fresh
    } ${state.duration.toFixed(2)}`;
  });
});
