const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const Timing = {
  update(timing, elapsed) {
    timing.delta = elapsed - timing.elapsed;
    timing.elapsed = elapsed;
  },

  scale(timing, rate, value = 1) {
    return value * (timing.delta / rate);
  },
};

export const Vector = {
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

const state = {
  timing: {
    tick: {
      elapsed: 0,
      delta: 0,
    },

    draw: {
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
    speed: 200,
  },
};

const config = {
  timing: {
    update: {
      rate: 1000 / 60,
    },
    draw: {
      rate: 1000 / 60,
    },
  },
};

function draw(elapsed) {
  Timing.update(state.timing.draw, elapsed);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "blue";
  context.font = "14px monospace";
  context.textBaseline = "top";

  context.fillText(`Ticks   ${1000 / state.timing.tick.delta}`, 0, 0);
  context.fillText(`Draws   ${1000 / state.timing.draw.delta}`, 0, 14);
  context.fillText(`Updates ${1000 / state.timing.update.delta}`, 0, 28);

  context.fillStyle = "blue";
  context.fillRect(state.player.position.x, state.player.position.y, 16, 16);
}

function update(elapsed) {
  Timing.update(state.timing.update, elapsed);

  if (state.activeKeys.ArrowUp) {
    state.player.velocity.y = -state.player.speed;
  } else if (state.activeKeys.ArrowDown) {
    state.player.velocity.y = state.player.speed;
  } else {
    state.player.velocity.y = 0;
  }

  if (state.activeKeys.ArrowRight) {
    state.player.velocity.x = state.player.speed;
  } else if (state.activeKeys.ArrowLeft) {
    state.player.velocity.x = -state.player.speed;
  } else {
    state.player.velocity.x = 0;
  }

  Vector.multiply(
    state.player.velocity,
    Timing.scale(state.timing.update, 1000)
  );
  Vector.add(state.player.position, state.player.velocity);
}

function tick(elapsed) {
  Timing.update(state.timing.tick, elapsed);

  if (state.timing.update.elapsed + config.timing.update.rate < elapsed) {
    update(elapsed);
  }

  if (state.timing.draw.elapsed + config.timing.draw.rate < elapsed) {
    draw(elapsed);
  }

  window.requestAnimationFrame(tick);
}

tick();

window.addEventListener("keydown", (e) => {
  state.activeKeys[e.key] = true;
  e.preventDefault();
});

window.addEventListener("keyup", (e) => {
  delete state.activeKeys[e.key];
  e.preventDefault();
});
