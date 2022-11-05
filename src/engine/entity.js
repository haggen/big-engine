export class Entity {
  props = {};
  game = null;
  tags = new Set();

  statistics = {
    rendering: {
      count: 0,
      elapsed: 0,
    },

    simulation: {
      step: 0,
      elapsed: 0,
    },
  };

  subscribers = {
    render: [],
    update: [],
  };

  on(event, subscriber) {
    this.subscribers[event].push(subscriber);
  }

  off(event, subscriber) {
    this.subscribers[event] = this.subscribers[event].filter(
      (s) => s !== subscriber
    );
  }

  trigger(event, ...args) {
    this.subscribers[event].forEach((subscriber) => {
      subscriber.apply(this, args);
    });
  }
}
