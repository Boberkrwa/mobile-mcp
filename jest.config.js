/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 60000,
  // Remove ESM configuration that's causing issues
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      // Use CommonJS instead of ESM for better compatibility
      tsconfig: {
        module: 'CommonJS'
      }
    }],
  },
  // Keep transform ignore patterns for webdriverio
  transformIgnorePatterns: [
    'node_modules/(?!(webdriverio|@wdio)/)'
  ],
  // Add setupFilesAfterEnv if needed for global setup
  setupFilesAfterEnv: [],
};
