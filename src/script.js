import { Game } from "./engine/game";
import { Vector } from "./engine/vector";
import { Entity } from "./engine/entity";

const game = new Game(document.querySelector("canvas"));
game.start();

// ---

const debugInfo = new Entity();
game.addEntity(debugInfo);

debugInfo.props.position = new Vector(10, 10);
debugInfo.props.fps = 0;
debugInfo.props.delta = 0;

debugInfo.on("render", function () {
  const { renderingContext } = this.game;

  renderingContext.fillStyle = "blue";
  renderingContext.font = "14px monospace";
  renderingContext.textBaseline = "top";

  renderingContext.fillText(
    `FPS ${this.props.fps}`,
    this.props.position.x,
    this.props.position.y
  );
});

debugInfo.on("update", function ({ delta }) {
  this.props.delta += delta;

  if (this.props.delta < 1000) {
    return;
  }
  this.props.delta = 0;

  this.props.fps = 1000 / this.game.stats.delta;
});

// ---

const player = new Entity();
game.addEntity(player);

player.props.position = new Vector();
player.props.size = new Vector(16, 16);
player.props.velocity = new Vector();
player.props.speed = 300;

player.on("render", function () {
  const { renderingContext } = this.game;

  renderingContext.fillStyle = "blue";
  renderingContext.fillRect(
    this.props.position.x,
    this.props.position.y,
    this.props.size.x,
    this.props.size.y
  );
});

player.on("input", function () {
  const { input } = this.game;

  if ("ArrowUp" in input) {
    this.props.velocity.y = -1;
  } else if ("ArrowDown" in input) {
    this.props.velocity.y = 1;
  } else {
    this.props.velocity.y = 0;
  }

  if ("ArrowRight" in input) {
    this.props.velocity.x = 1;
  } else if ("ArrowLeft" in input) {
    this.props.velocity.x = -1;
  } else {
    this.props.velocity.x = 0;
  }
});

player.on("update", function ({ delta }) {
  this.props.velocity.multiply(this.props.speed * (delta / 1000));
  this.props.position.add(this.props.velocity);
});
