import { isFunction } from './isFunction';

it('should tell that a function is a function', () => {
  const argument = () => null;

  expect(isFunction(argument)).toBe(true);
});

it('should tell that a function with other properties is a function', () => {
  const argument = Object.assign(() => null, { otherKey: true });

  expect(isFunction(argument)).toBe(true);
});

it('should tell that a jest mock is a function', () => {
  const argument = jest.fn();

  expect(isFunction(argument)).toBe(true);
});

it('should tell that an object is not a function', () => {
  const argument = {};

  expect(isFunction(argument)).toBe(false);
});

it('should tell that an array is not a function', () => {
  const argument = [];

  expect(isFunction(argument)).toBe(false);
});

it('should tell that null is not a function', () => {
  const argument = null;

  expect(isFunction(argument)).toBe(false);
});

it('should tell that undefined is not a function', () => {
  const argument = undefined;

  expect(isFunction(argument)).toBe(false);
});

it('should tell that a number is not a function', () => {
  const argument = 5;

  expect(isFunction(argument)).toBe(false);
});

it('should tell that a boolean is not a function', () => {
  const argument = true;

  expect(isFunction(argument)).toBe(false);
});

it('should tell that a string is not a function', () => {
  const argument = 'string';

  expect(isFunction(argument)).toBe(false);
});
