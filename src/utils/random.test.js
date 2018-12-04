import { range } from './range';
import { random } from './random';

it('should generate a random whole number (integer)', () => {
  expect(random(0, 10)).toBeGreaterThanOrEqual(0);
  expect(random(0, 10)).toBeLessThanOrEqual(10);
});

it('should generate a random whole number (integer) between the lower (inclusive) and upper bound (inclusive)', () => {
  range(100).forEach(() => {
    const value = random(5, 10);

    expect(value).toBeGreaterThanOrEqual(5);
    expect(value).toBeLessThanOrEqual(10);
  });
});
