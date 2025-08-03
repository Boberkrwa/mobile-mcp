module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'test/**/*.ts',
    '!test/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 300000, // 5 minutes default timeout for mobile tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true
};
