module.exports = {
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.js$': require.resolve('./jest.babelrc.js'),
  },
  testMatch: ['<rootDir>/src/**/*.test.js'],
  moduleFileExtensions: ['js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverageFrom: ['src/**/*.js'],
  testEnvironment: 'jsdom',
  testURL: 'https://localhost',
  transformIgnorePatterns: [
    'node_modules/(?!(babel-plugin-transform-polyfills)/)',
  ],
};
