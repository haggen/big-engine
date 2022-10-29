export class Vector {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    if (x instanceof Vector) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
