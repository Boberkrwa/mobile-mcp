// Jest setup file for mobile test environment
import { Logger } from '../test/utils/logger';

// Enable debug mode for tests
Logger.enableDebug();

// Global test setup
beforeAll(() => {
  console.log('🧪 Setting up Maccabi mobile test environment...');
  
  // Set longer timeouts for mobile tests
  jest.setTimeout(300000); // 5 minutes
});

afterAll(() => {
  console.log('🧹 Cleaning up Maccabi mobile test environment...');
});

// Global error handler for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Extend Jest matchers for mobile testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidPackageName(): R;
    }
  }
}

expect.extend({
  toBeValidPackageName(received: string) {
    const isValid = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(received);
    if (isValid) {
      return {
        message: () => `expected ${received} not to be a valid package name`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid package name`,
        pass: false,
      };
    }
  },
});
