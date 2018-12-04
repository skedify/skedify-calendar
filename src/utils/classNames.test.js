import { classNames } from './classNames';

it('should concatenate all given classes', () => {
  const expected = 'a b c';
  expect(classNames('a', 'b', 'c')).toEqual(expected);
});

it('should filter out falsy values', () => {
  const expected = 'a b c';
  expect(classNames('a', undefined, 'b', false, 0, 'c', null)).toEqual(
    expected
  );
});
