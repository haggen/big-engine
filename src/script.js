const Timing = {
  update(timing, elapsed) {
    timing.delta = elapsed - timing.elapsed;
    timing.elapsed = elapsed;
  },

  scale(timing, rate, value = 1) {
    return value * (timing.delta / rate);
  },
};

const Vector = {
  add(a, b) {
    a.x += b.x;
    a.y += b.y;
  },

  subtract(a, b) {
    a.x -= b.x;
    a.y -= b.y;
  },

  multiply(vector, scalar) {
    vector.x *= scalar;
    vector.y *= scalar;
  },

  getLength(vector) {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
};

const Game = {
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
    Timing.update(this.state.timing.tick, elapsed);

    if (
      this.state.timing.draw.elapsed + this.config.timing.draw.rate <
      elapsed
    ) {
      this.draw(elapsed);
    }

    this.poll(elapsed);

    if (
      this.state.timing.update.elapsed + this.config.timing.update.rate <
      elapsed
    ) {
      this.update(elapsed);
    }

    window.requestAnimationFrame((elapsed) => this.tick(elapsed));
  },

  draw(elapsed) {
    Timing.update(this.state.timing.draw, elapsed);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "blue";
    this.context.font = "14px monospace";
    this.context.textBaseline = "top";

    this.context.fillText(`TPS ${1000 / this.state.timing.tick.delta}`, 0, 0);
    this.context.fillText(`DPS ${1000 / this.state.timing.draw.delta}`, 0, 14);
    this.context.fillText(
      `UPS ${1000 / this.state.timing.update.delta}`,
      0,
      28
    );
    this.context.fillText(`UDT ${this.state.timing.update.delta}`, 0, 42);

    this.context.fillStyle = "blue";
    this.context.fillRect(
      this.state.player.position.x,
      this.state.player.position.y,
      16,
      16
    );
  },

  poll(elapsed) {
    Timing.update(this.state.timing.poll, elapsed);

    if (this.state.activeKeys.ArrowUp) {
      this.state.player.velocity.y = -1;
    } else if (this.state.activeKeys.ArrowDown) {
      this.state.player.velocity.y = 1;
    } else {
      this.state.player.velocity.y = 0;
    }

    if (this.state.activeKeys.ArrowRight) {
      this.state.player.velocity.x = 1;
    } else if (this.state.activeKeys.ArrowLeft) {
      this.state.player.velocity.x = -1;
    } else {
      this.state.player.velocity.x = 0;
    }
  },

  update(elapsed) {
    Timing.update(this.state.timing.update, elapsed);

    Vector.multiply(
      this.state.player.velocity,
      Timing.scale(this.state.timing.update, 1000, this.state.player.speed)
    );
    Vector.add(this.state.player.position, this.state.player.velocity);
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

Game.start();
