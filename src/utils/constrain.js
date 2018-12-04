/**
 * Constrain an input between a lower and an upper boundary
 *
 * @param {number} input The input value to be constrained
 * @param {number} min The lower boundary
 * @param {number} max The upper boundary
 */
export function constrain(input, min, max) {
  return Math.min(max, Math.max(min, input));
}
