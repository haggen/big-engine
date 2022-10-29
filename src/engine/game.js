export class Game {
  canvasElement = null;
  renderingContext = null;

  stats = {
    loop: { elapsed: 0, delta: 0 },
    render: { elapsed: 0, delta: 0 },
    input: { elapsed: 0, delta: 0 },
    update: { elapsed: 0, delta: 0 },
  };

  config = {
    render: { rate: 1000 / 60 },
    update: { rate: 1000 / 100 },
  };

  entities = [];
  input = [];

  constructor(canvasElement) {
    this.canvasElement = canvasElement;
    this.renderingContext = canvasElement.getContext("2d");
  }

  addEntity(entity) {
    entity.game = this;
    this.entities.push(entity);
  }

  render() {
    const { stats } = this;
    const { rate } = this.config.render;

    const delta = stats.loop.elapsed - stats.render.elapsed;

    if (rate > delta) {
      return;
    }

    stats.render.delta = delta;
    stats.render.elapsed = stats.loop.elapsed;

    this.renderingContext.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    this.entities.forEach((entity) => {
      entity.trigger("render", stats.render);
    });
  }

  evalInput() {
    const { stats } = this;

    stats.input.delta = stats.loop.elapsed - stats.input.elapsed;
    stats.input.elapsed = stats.loop.elapsed;

    this.entities.forEach((entity) => {
      entity.trigger("input", stats.input);
    });
  }

  update() {
    const { stats } = this;
    const { rate } = this.config.update;

    const delta = stats.loop.elapsed - stats.update.elapsed;

    if (rate > delta) {
      return;
    }

    stats.update.delta = delta;
    stats.update.elapsed = stats.loop.elapsed;

    this.entities.forEach((entity) => {
      entity.trigger("update", stats.update);
    });
  }

  loop(elapsed) {
    const { stats } = this;

    stats.loop.delta = elapsed - stats.loop.elapsed;
    stats.loop.elapsed = elapsed;

    this.render();
    this.evalInput();
    this.update();

    window.requestAnimationFrame(this.loop.bind(this));
  }

  start() {
    window.addEventListener("keydown", (e) => {
      this.input[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      delete this.input[e.key];
    });

    this.loop(0);
  }
}
