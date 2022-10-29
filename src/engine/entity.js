export class Entity {
  props = {};
  game = null;

  subscribers = {
    render: [],
    input: [],
    update: [],
  };

  on(event, subscriber) {
    this.subscribers[event].push(subscriber);
  }

  trigger(event, ...args) {
    this.subscribers[event].forEach((subscriber) => {
      subscriber.apply(this, args);
    });
  }
}
