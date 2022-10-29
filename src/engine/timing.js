export const Timing = {
  update(timing, elapsed) {
    timing.delta = elapsed - timing.elapsed;
    timing.elapsed = elapsed;
  },

  scale(timing, rate, value = 1) {
    return value * (timing.delta / rate);
  },
};
