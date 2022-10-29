export class Game {
  canvasElement = null;
  renderingContext = null;

  stats = {
    count: 0,
    delta: 0,
    elapsed: 0,
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
    this.renderingContext.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    this.entities.forEach((entity) => {
      entity.trigger("render", this.stats);
    });
  }

  evaluate() {
    this.entities.forEach((entity) => {
      entity.trigger("input", this.stats);
    });
  }

  update() {
    this.entities.forEach((entity) => {
      entity.trigger("update", this.stats);
    });
  }

  loop(elapsed) {
    requestAnimationFrame((elapsed) => this.loop(elapsed));

    this.stats.count += 1;
    this.stats.delta = elapsed - this.stats.elapsed;
    this.stats.elapsed = elapsed;

    this.render();
    this.evaluate();
    this.update();
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
