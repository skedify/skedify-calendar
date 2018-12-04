import { constrain } from './constrain';

it('should keep the value as is when between boundaries', () => {
  expect(constrain(5, 0, 10)).toEqual(5);
});

it('it should take the lower boundary when the value goes below', () => {
  expect(constrain(2, 5, 10)).toEqual(5);
});

it('it should take the higher boundary when the value goes over', () => {
  expect(constrain(15, 5, 10)).toEqual(10);
});
