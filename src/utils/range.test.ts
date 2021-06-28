import { range } from "./range";

it("should generate an array of a certain size", () => {
  expect(range(10)).toHaveLength(10);
  expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

it("should throw an error when the given input is negative", () => {
  expect(() => range(-10)).toThrowError(
    "You called `range(-10)`, but the input `n` should be greater or equals to 0 and less than or equals to 4294967295."
  );
});

it("should throw an error when the given input is too large", () => {
  expect(() => range(2 ** 33)).toThrowError(
    "You called `range(8589934592)`, but the input `n` should be greater or equals to 0 and less than or equals to 4294967295."
  );
});
