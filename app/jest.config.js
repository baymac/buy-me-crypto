module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  // verbose: true,
  // collectCoverage: true,
  coveragePathIgnorePatterns: ["<rootDir>/test/test-utils.js"]
};