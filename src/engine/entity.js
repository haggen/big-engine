export class Entity {
  game = null;

  props = {};

  subscribers = {
    render: [],
    input: [],
    update: [],
  };

  set(prop, value) {
    this.props[prop] = value;
  }

  get(prop) {
    return this.props[prop];
  }

  on(event, subscriber) {
    this.subscribers[event].push(subscriber);
  }

  trigger(event, ...args) {
    this.subscribers[event].forEach((subscriber) => {
      subscriber.apply(this, args);
    });
  }
}
