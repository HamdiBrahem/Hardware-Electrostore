module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js'],
  testTimeout: 15000,
  maxWorkers: 1,
  collectCoverageFrom: [
    'middleware/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
  ],
  coverageDirectory: 'coverage',
};
