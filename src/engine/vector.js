export const Vector = {
  add(a, b) {
    a.x += b.x;
    a.y += b.y;
  },

  subtract(a, b) {
    a.x -= b.x;
    a.y -= b.y;
  },

  multiply(vector, scalar) {
    vector.x *= scalar;
    vector.y *= scalar;
  },

  getLength(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  },
};
