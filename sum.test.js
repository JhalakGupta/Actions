const sum = require('./sum');

test('adds 1 + 5 to equal 6', () => {
  expect(sum(1, 5)).toBe(3);
});