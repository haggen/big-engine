interface Math {
  /**
   * Clamp a value between a minimum and maximum.
   */
  clamp(value: number, min: number, max: number): number;
}

Math.clamp = (value, min, max) => Math.min(Math.max(value, min), max);
