import { unique } from './unique';

it('should make a list of integers unique', () => {
  expect(unique([1, 2, 3, 4, 4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
});

it('should make a list of objects unique', () => {
  // We are testing references, not actual values
  const a = { value: 1 };
  const b = { value: 1 };
  const c = { value: 1 };

  expect(unique([a, b, c, c, c])).toEqual([a, b, c]);
});
