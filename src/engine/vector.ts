/**
 * Two component vector.
 */
export class Vector {
  x = 0;
  y = 0;

  constructor(x: Vector | number = 0, y?: number) {
    if (x instanceof Vector) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y ?? x;
    }
  }

  /**
   * Vector magnitude.
   */
  get length() {
    const { x, y } = this;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * String representation, e.g. x, y.
   */
  toString() {
    const { x, y } = this;
    return `${x.toFixed(2)}, ${y.toFixed(2)}`;
  }

  /**
   * Change vector by adding another vector or scalars.
   */
  add(x: Vector | number, y?: number) {
    if (x instanceof Vector) {
      this.x += x.x;
      this.y += x.y;
    } else {
      this.x += x;
      this.y += y ?? x;
    }
  }

  /**
   * Change vector by subtracting another vector or scalars.
   */
  subtract(x: Vector | number, y?: number) {
    if (x instanceof Vector) {
      this.x -= x.x;
      this.y -= x.y;
    } else {
      this.x -= x;
      this.y -= y ?? x;
    }
  }

  /**
   * Change vector by multiplying both components by given scalar.
   */
  multiply(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  /**
   * Get the dot product between two vectors.
   */
  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
   * Get the distance between two vectors.
   */
  distance(vector: Vector) {
    const distance = new Vector(this);
    distance.subtract(vector);
    return distance.length;
  }

  /**
   * Normalize vector to unit length.
   */
  normalize() {
    const { length } = this;

    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    }
  }

  /**
   * Clamp vector's magnitude.
   */
  clamp(max: number) {
    const { length } = this;

    if (length > max) {
      this.normalize();
      this.multiply(max);
    }
  }
}
