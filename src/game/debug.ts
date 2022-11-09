import { Entity } from "../engine/entity";
import { Vector } from "../engine/vector";

import { game } from ".";

type State = {
  position: Vector;
  text: string[];
  player: Entity<any> | undefined;
};

const initialState: State = {
  position: new Vector(7, 7),
  text: [],
  player: undefined,
};
export const overlay = new Entity(initialState);
game.addEntity(overlay);

game.addEventHandler("render", () => {
  const { renderingContext } = game;
  const { text } = overlay.state;

  renderingContext.fillStyle = "red";
  renderingContext.font = "14px monospace";
  renderingContext.textBaseline = "top";

  const position = new Vector(overlay.state.position);
  text.forEach((line) => {
    renderingContext.fillText(line, position.x, position.y);
    position.add(0, 14);
  });
});

game.addEventHandler("update", () => {
  const { statistics } = game;
  const { text, player } = overlay.state;

  const time = (statistics.time / 1000).toFixed(2);
  const renderingRate = statistics.rendering.rate.toFixed(2);
  const renderingElapsed = statistics.rendering.elapsed.toFixed(2);
  const simulationRate = (1000 / game.config.simulation.rate).toFixed(2);
  const simulationElapsed = statistics.simulation.elapsed.toFixed(2);

  if (statistics.simulation.steps % 20 === 0) {
    text[0] = `${"Time".padEnd(12)} ${time}s`;
    text[1] = `${"Rendering".padEnd(
      12
    )} ${renderingRate}/s ${renderingElapsed}s (${statistics.rendering.count})`;
    text[2] = `${"Simul.".padEnd(
      12
    )} ${simulationRate}/s ${simulationElapsed}s (${
      statistics.simulation.steps
    })`;
  }
  text[3] = `${"Input".padEnd(12)} ${Object.keys(game.input).join()}`;

  if (player) {
    text[4] = ``;
    text[5] = `${"Player".padEnd(12)} ${player.state.position}`;
    text[6] = `${"Direction".padEnd(12)} ${player.state.direction}`;
    text[7] = `${"Velocity".padEnd(12)} ${player.state.velocity}`;
    text[8] = `${"Accel.".padEnd(12)} ${player.state.acceleration}`;
    text[9] = `${"Speed".padEnd(12)} ${player.state.speed.toFixed(2)}`;
  } else {
    overlay.state.player = game.findEntity("player");
  }
});
