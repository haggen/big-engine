import { Game } from "./engine/game";
import { Vector } from "./engine/vector";
import { Entity } from "./engine/entity";

const game = new Game(document.querySelector("canvas"));
game.run();

// ---

const player = new Entity();
game.addEntity(player);

player.tags.add("player");

player.props.position = new Vector();
player.props.size = new Vector(16, 16);
player.props.velocity = new Vector(0, 0);
player.props.acceleration = 2000;
player.props.friction = 0;
player.props.breakingForce = 4000;
player.props.airResist = 2000;
player.props.maxSpeed = 500;

player.on("render", function () {
  const { renderingContext } = this.game;

  renderingContext.fillStyle = "blue";
  renderingContext.fillRect(
    Math.round(this.props.position.x),
    Math.round(this.props.position.y),
    this.props.size.x,
    this.props.size.y
  );
});

player.on("update", function (delta) {
  const { input } = this.game;

  if ("Space" in input) {
    this.props.friction = this.props.breakingForce;
  } else {
    this.props.friction = this.props.airResist;
  }

  if ("ArrowUp" in input) {
    this.props.velocity.y -= this.props.acceleration * delta;
    this.props.friction = 0;
  } else if ("ArrowDown" in input) {
    this.props.velocity.y += this.props.acceleration * delta;
    this.props.friction = 0;
  }

  if (this.props.velocity.y > 0) {
    this.props.velocity.y = Math.max(
      0,
      this.props.velocity.y - this.props.friction * delta
    );
  } else if (this.props.velocity.y < 0) {
    this.props.velocity.y = Math.min(
      0,
      this.props.velocity.y + this.props.friction * delta
    );
  }

  this.props.velocity.y = Math.min(
    this.props.maxSpeed,
    Math.max(-this.props.maxSpeed, this.props.velocity.y)
  );

  if ("ArrowLeft" in input) {
    this.props.velocity.x -= this.props.acceleration * delta;
    this.props.friction = 0;
  } else if ("ArrowRight" in input) {
    this.props.velocity.x += this.props.acceleration * delta;
    this.props.friction = 0;
  }

  if (this.props.velocity.x > 0) {
    this.props.velocity.x = Math.max(
      0,
      this.props.velocity.x - this.props.friction * delta
    );
  } else if (this.props.velocity.x < 0) {
    this.props.velocity.x = Math.min(
      0,
      this.props.velocity.x + this.props.friction * delta
    );
  }

  this.props.velocity.x = Math.min(
    this.props.maxSpeed,
    Math.max(-this.props.maxSpeed, this.props.velocity.x)
  );

  const velocity = new Vector(this.props.velocity);
  velocity.multiply(delta);
  if (velocity.x !== 0 && velocity.y !== 0) {
    velocity.multiply(0.7071);
  }
  this.props.position.add(velocity);
  this.props.speed = velocity.length / delta;
});

// ---

const debugInfo = new Entity();
game.addEntity(debugInfo);

debugInfo.props.position = new Vector(7, 7);

debugInfo.on("render", function (delta) {
  const { renderingContext, statistics } = this.game;
  const { player } = this.props;

  renderingContext.fillStyle = "blue";
  renderingContext.font = "14px monospace";
  renderingContext.textBaseline = "top";

  const text = [
    `Rendering ${(1 / delta).toFixed(
      2
    )}/s ${statistics.rendering.elapsed.toFixed(2)}s (${
      statistics.rendering.count
    })`,
    `Simul.    ${
      1000 / this.game.config.simulation.rate.toFixed(2)
    }/s ${statistics.simulation.elapsed.toFixed(2)}s (${
      statistics.simulation.step
    })`,
    `Input     ${Object.keys(this.game.input).join()}`,
  ];

  if (player) {
    text.push(
      ``,
      `Player    ${player.props.position}`,
      `Velocity  ${player.props.velocity}`,
      `Speed     ${player.props.speed.toFixed(2)}`,
      `Friction  ${player.props.friction}`,
      `Accel.    ${player.props.acceleration}`
    );
  }

  const position = new Vector(this.props.position);
  text.forEach((line) => {
    renderingContext.fillText(line, position.x, position.y);
    position.add(new Vector(0, 14));
  });
});

debugInfo.on("update", function () {
  if (!this.props.player) {
    this.props.player = this.game.findEntity((entity) =>
      entity.tags.has("player")
    );
  }
});
