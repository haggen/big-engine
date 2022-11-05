const keyMap = {
  [" "]: "Space",
};

export class Game {
  canvasElement = null;
  renderingContext = null;

  config = {
    simulation: {
      rate: 1000 / 100,
    },
  };

  statistics = {
    time: 0,

    rendering: {
      count: 0,
      delta: 0,
      elapsed: 0,
    },

    simulation: {
      step: 0,
      elapsed: 0,
      accumulator: 0,
    },
  };

  world = [];
  input = [];

  constructor(canvasElement) {
    this.canvasElement = canvasElement;
    this.renderingContext = canvasElement.getContext("2d");
  }

  addEntity(entity) {
    entity.game = this;
    this.world.push(entity);
  }

  findEntity(predicate) {
    return this.world.find(predicate);
  }

  render(delta) {
    const now = performance.now();

    this.statistics.rendering.count += 1;

    this.renderingContext.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    this.world.forEach((entity) => {
      const now = performance.now();

      entity.statistics.rendering.count += 1;
      entity.trigger("render", delta / 1000);

      entity.statistics.rendering.elapsed = performance.now() - now;
    });

    this.statistics.rendering.elapsed = performance.now() - now;
  }

  update(delta) {
    const now = performance.now();

    this.statistics.simulation.step += 1;

    this.world.forEach((entity) => {
      const now = performance.now();
      entity.statistics.simulation.step += 1;
      entity.trigger("update", delta / 1000);
      entity.statistics.simulation.elapsed = performance.now() - now;
    });

    this.statistics.simulation.elapsed = performance.now() - now;
  }

  loop() {
    requestAnimationFrame(() => this.loop());

    const time = performance.now();
    const delta = time - this.statistics.time;

    this.statistics.time = time;
    this.statistics.simulation.accumulator += delta;

    while (
      this.statistics.simulation.accumulator >= this.config.simulation.rate
    ) {
      this.statistics.simulation.accumulator -= this.config.simulation.rate;
      this.update(this.config.simulation.rate);
    }

    this.render(delta);
  }

  run() {
    window.addEventListener("keydown", (e) => {
      const key = keyMap[e.key] ?? e.key;
      this.input[key] = true;
    });

    window.addEventListener("keyup", (e) => {
      const key = keyMap[e.key] ?? e.key;
      delete this.input[key];
    });

    this.loop();
  }
}
