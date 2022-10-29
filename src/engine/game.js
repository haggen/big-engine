import { Timing } from "./timing";
import { Vector } from "./vector";

export const Game = {
  canvas: null,
  context: null,

  state: {
    timing: {
      tick: {
        elapsed: 0,
        delta: 0,
      },

      draw: {
        elapsed: 0,
        delta: 0,
      },

      poll: {
        elapsed: 0,
        delta: 0,
      },

      update: {
        elapsed: 0,
        delta: 0,
      },
    },

    activeKeys: {},

    player: {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      speed: 300,
    },
  },

  config: {
    timing: {
      update: {
        rate: 1000 / 100,
      },
      draw: {
        rate: 1000 / 30,
      },
    },
  },

  tick(elapsed) {
    const { timing } = this.state;

    Timing.update(timing.tick, elapsed);

    this.draw(elapsed);
    this.poll(elapsed);
    this.update(elapsed);

    window.requestAnimationFrame((elapsed) => {
      this.tick(elapsed);
    });
  },

  draw(elapsed) {
    const { timing, player } = this.state;
    const { rate } = this.config.timing.draw;

    if (timing.draw.elapsed + rate > elapsed) {
      return;
    }

    Timing.update(timing.draw, elapsed);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "blue";
    this.context.font = "14px monospace";
    this.context.textBaseline = "top";

    this.context.fillText(`TPS ${1000 / timing.tick.delta}`, 0, 0);
    this.context.fillText(`DPS ${1000 / timing.draw.delta}`, 0, 14);
    this.context.fillText(`UPS ${1000 / timing.update.delta}`, 0, 28);
    this.context.fillText(`UDT ${timing.update.delta}`, 0, 42);

    this.context.fillStyle = "blue";
    this.context.fillRect(player.position.x, player.position.y, 16, 16);
  },

  poll(elapsed) {
    const { timing, player, activeKeys } = this.state;

    Timing.update(timing.poll, elapsed);

    if (activeKeys.ArrowUp) {
      player.velocity.y = -1;
    } else if (activeKeys.ArrowDown) {
      player.velocity.y = 1;
    } else {
      player.velocity.y = 0;
    }

    if (activeKeys.ArrowRight) {
      player.velocity.x = 1;
    } else if (activeKeys.ArrowLeft) {
      player.velocity.x = -1;
    } else {
      player.velocity.x = 0;
    }
  },

  update(elapsed) {
    const { player, timing } = this.state;
    const { rate } = this.config.timing.update;

    if (timing.update.elapsed + rate > elapsed) {
      return;
    }

    Timing.update(timing.update, elapsed);

    Vector.multiply(
      player.velocity,
      Timing.scale(timing.update, 1000, player.speed)
    );
    Vector.add(player.position, player.velocity);
  },

  start() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    window.addEventListener("keydown", (e) => {
      this.state.activeKeys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      delete this.state.activeKeys[e.key];
    });

    this.tick(0);
  },
};
