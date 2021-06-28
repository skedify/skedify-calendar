/**
 * Constrain an input between a lower and an upper boundary
 *
 * @param input The input value to be constrained
 * @param min The lower boundary
 * @param max The upper boundary
 */
export function constrain(input: number, min: number, max: number) {
  return Math.min(max, Math.max(min, input));
}
