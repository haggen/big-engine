import { Entity } from "../engine/entity";
import { Vector } from "../engine/vector";

import { game } from ".";

const initialState = {
  position: new Vector(),
  size: new Vector(16, 16),
  direction: new Vector(),
  velocity: new Vector(),
  acceleration: 0,
  speed: 0,
};
export const player = new Entity(initialState, "player");
game.addEntity(player);

game.addEventHandler("render", () => {
  const { renderingContext } = game;
  const { position, size } = player.state;

  renderingContext.fillStyle = "blue";
  renderingContext.beginPath();
  renderingContext.rect(
    Math.round(position.x),
    Math.round(position.y),
    size.x,
    size.y
  );
  renderingContext.fill();
});

game.addEventHandler("update", (delta) => {
  const { input, canvasElement } = game;
  const { position, direction } = player.state;

  if ("ShiftLeft" in input) {
    player.state.acceleration = 16 * 24;
  } else {
    player.state.acceleration = 16 * 12;
  }

  if ("KeyW" in input) {
    direction.y = -1;
  } else if ("KeyS" in input) {
    direction.y = +1;
  } else {
    direction.y = 0;
  }

  if ("KeyA" in input) {
    direction.x = -1;
  } else if ("KeyD" in input) {
    direction.x = +1;
  } else {
    direction.x = 0;
  }

  direction.normalize();

  player.state.velocity = new Vector(direction);
  player.state.velocity.multiply(player.state.acceleration * delta);

  position.add(player.state.velocity);

  // Teleport to the other side.
  position.x =
    (position.x > 0 ? position.x : canvasElement.width + position.x) %
    canvasElement.width;
  position.y =
    (position.y > 0 ? position.y : canvasElement.height + position.y) %
    canvasElement.height;
});
