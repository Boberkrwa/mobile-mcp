/**
 * Maccabi App Test Suite Index
 * 
 * Simplified test structure:
 * - All test files directly in /tests/ folder
 */

export * from './driver-manager.test';
export * from './maccabi-app-integration.test';
export * from './maccabi-complete-journey.test';

// Test configuration and utilities
export { Logger } from '../test/utils/logger';
export { TestUtils } from '../test/utils/test-utils';
export { maccabiConfig } from '../test/config/app.config';
export { testUsers } from '../test/data/test-data';
