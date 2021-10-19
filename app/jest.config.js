const path = require('path');

module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^.+\\.module\\.css$': 'identity-obj-proxy',
    '^.+\\.css$': require.resolve('./test/style-mock.js'),
  },
  moduleDirectories: ['node_modules', path.join(__dirname, 'test')],

  testEnvironment: 'jest-environment-jsdom',
  // verbose: true,
  // collectCoverage: true,
  coveragePathIgnorePatterns: ['<rootDir>/test/test-utils.js'],
};
