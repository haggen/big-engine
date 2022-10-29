import { Game } from "./engine/game";
import { Vector } from "./engine/vector";
import { Entity } from "./engine/entity";

const game = new Game(document.querySelector("canvas"));
game.start();

// ---

const debugInfo = new Entity();
game.addEntity(debugInfo);

debugInfo.set("position", new Vector(10, 10));
debugInfo.set("fps", { min: 0, max: 0, avg: 0 });
debugInfo.set("ups", { min: 0, max: 0, avg: 0 });

debugInfo.on("render", function () {
  const { renderingContext, stats } = this.game;

  renderingContext.fillStyle = "blue";
  renderingContext.font = "12px monospace";
  renderingContext.textBaseline = "top";

  const position = new Vector(this.props.position);

  renderingContext.fillText(
    `FPS ${this.props.fps.avg} ${this.props.fps.min} ${this.props.fps.max}`,
    position.x,
    position.y
  );
  position.y += 14;

  renderingContext.fillText(
    `UPS ${this.props.ups.avg} ${this.props.ups.min} ${this.props.ups.max}`,
    position.x,
    position.y
  );
});

debugInfo.on("update", function () {
  const { stats } = this.game;

  const fps = 1000 / stats.render.delta;
  const ups = 1000 / stats.update.delta;

  this.props.fps.min = Math.min(this.props.fps.min, fps);
  this.props.fps.max = Math.max(this.props.fps.max, fps);
  this.props.fps.avg = (this.props.fps.avg + fps) / 2;

  this.props.ups.min = Math.min(this.props.ups.min, ups);
  this.props.ups.max = Math.max(this.props.ups.max, ups);
  this.props.ups.avg = (this.props.ups.avg + ups) / 2;
});

// ---

const player = new Entity();
game.addEntity(player);

player.set("position", new Vector());
player.set("size", new Vector(16, 16));
player.set("velocity", new Vector());
player.set("speed", 300);

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
