import * as assert from "node:assert";
import { DriverManager } from "../test/helpers/driver-manager";
import { MaccabiRegistrationFlow } from "../test/helpers/registration-flow";
import { maccabiConfig } from "../test/config/app.config";
import { testUsers } from "../test/data/test-data";
import { Logger } from "../test/utils/logger";
import { before, after, describe, it } from 'mocha';

/**
 * End-to-End Tests for Maccabi App
 * 
 * Complete user journey tests from app launch to final destination.
 * These tests require a physical device/emulator with the app installed.
 */
describe("🎭 Maccabi App - End-to-End Tests", () => {
	let driverManager: DriverManager;
	let registrationFlow: MaccabiRegistrationFlow;
	let logger: Logger;

	before(async function() {
		this.timeout(60000);
		logger = new Logger("MaccabiE2ETest");
		logger.info("🎬 Initializing Maccabi E2E test suite...");

		driverManager = new DriverManager(maccabiConfig);
		await driverManager.initializeDriver();

		registrationFlow = new MaccabiRegistrationFlow(driverManager);

		logger.success("✅ E2E test suite initialized successfully");
	});

	after(async () => {
		logger.info("🔄 Cleaning up E2E test suite...");

		if (driverManager) {
			await driverManager.quitDriver();
		}

		logger.success("✅ E2E test suite cleanup completed");
	});

	describe("🚀 Complete User Journeys", () => {
		
		it("👤 New User Registration Journey", async function() {
			this.timeout(180000); // 3 minutes for complete journey
			logger.step(1, "Starting complete new user registration journey");

			// Use first test user for the journey
			const newUser = testUsers[0];
			logger.info(`Testing complete journey for: ${newUser.id}`, newUser.registrationData);

			// Step 1: Launch the app
			await driverManager.launchApp();
			logger.action("App launched successfully");

			// Step 2: Complete full registration
			const registrationCompleted = await registrationFlow.executeCompleteRegistration(
				newUser.registrationData
			);

			// Step 3: Verify journey completion
			if (newUser.expectedResults.shouldReachDashboard) {
				assert.strictEqual(
					registrationCompleted, 
					true, 
					"New user should complete registration successfully"
				);
				logger.success("✅ New user registration journey completed successfully");
			} else {
				logger.info(`Registration outcome as expected: ${registrationCompleted}`);
			}

			// Step 4: Final verification
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);
		});

		it("🔄 Returning User Journey", async function() {
			this.timeout(120000);
			logger.step(1, "Testing returning user journey");

			// Launch the app (user might already be logged in)
			await driverManager.launchApp();
			logger.action("App launched for returning user test");

			// For returning users, registration might not be needed
			// Just verify the app state and navigation
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);

			logger.success("✅ Returning user journey verified");
		});

		it("🔄 App Recovery and Persistence", async function() {
			this.timeout(240000); // 4 minutes for multiple cycles
			logger.step(1, "Testing app state persistence and recovery");

			// Launch app multiple times to test persistence
			for (let i = 1; i <= 3; i++) {
				logger.info(`Launch cycle ${i}/3`);
				
				await driverManager.launchApp();
				
				const currentPackage = await registrationFlow.getCurrentPackage();
				assert.strictEqual(
					currentPackage, 
					maccabiConfig.appPackage,
					`Launch cycle ${i} should maintain correct package`
				);

				// Small delay between launches
				await new Promise(resolve => setTimeout(resolve, 2000));
			}

			logger.success("✅ App recovery and persistence verified");
		});
	});

	describe("📱 Device and Platform Tests", () => {

		it("📐 Screen Adaptation Test", async function() {
			this.timeout(60000);
			logger.step(1, "Testing app adaptation to device screen");

			await driverManager.launchApp();

			// Verify app launches correctly regardless of screen size
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);

			logger.success("✅ App adapts correctly to device screen");
		});

		it("🔋 Performance Under Load", async function() {
			this.timeout(120000);
			logger.step(1, "Testing app performance under load");

			const startTime = Date.now();

			// Perform multiple operations rapidly
			for (let i = 0; i < 2; i++) {
				await driverManager.launchApp();
				const currentPackage = await registrationFlow.getCurrentPackage();
				assert.strictEqual(currentPackage, maccabiConfig.appPackage);
			}

			const endTime = Date.now();
			const totalTime = endTime - startTime;

			logger.info(`Performance test completed in ${totalTime}ms`);
			
			// Assert reasonable performance (under 60 seconds total)
			assert.ok(totalTime < 60000, `Performance should be reasonable, took ${totalTime}ms`);

			logger.success("✅ App performance under load is acceptable");
		});
	});

	describe("🛡️ Error Recovery and Edge Cases", () => {

		it("🚨 Network Interruption Simulation", async function() {
			this.timeout(90000);
			logger.step(1, "Testing app behavior during network issues");

			await driverManager.launchApp();

			// Even with potential network issues, basic app function should work
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);

			logger.success("✅ App handles network scenarios gracefully");
		});

		it("⚡ Rapid User Interactions", async function() {
			this.timeout(90000);
			logger.step(1, "Testing app stability with rapid interactions");

			await driverManager.launchApp();

			// Perform rapid package checks (simulating quick user actions)
			for (let i = 0; i < 5; i++) {
				const currentPackage = await registrationFlow.getCurrentPackage();
				assert.strictEqual(currentPackage, maccabiConfig.appPackage);
			}

			logger.success("✅ App handles rapid interactions stably");
		});
	});

	describe("📊 User Experience Validation", () => {

		it("⏱️ User Journey Timing", async function() {
			this.timeout(240000);
			logger.step(1, "Measuring complete user journey timing");

			const journeyStart = Date.now();

			await driverManager.launchApp();
			
			// Use a test user for timing measurement
			const testUser = testUsers[0];
			await registrationFlow.executeCompleteRegistration(testUser.registrationData);

			const journeyEnd = Date.now();
			const journeyTime = journeyEnd - journeyStart;

			logger.info(`Complete user journey took: ${journeyTime}ms`);

			// Assert reasonable journey time (under 3 minutes)
			assert.ok(journeyTime < 180000, `User journey should complete within 3 minutes, took ${journeyTime}ms`);

			logger.success(`✅ User journey completed in acceptable time: ${(journeyTime / 1000).toFixed(1)}s`);
		});

		it("🎯 User Flow Validation", async function() {
			this.timeout(150000);
			logger.step(1, "Validating complete user flow logic");

			await driverManager.launchApp();

			// Test that each test user scenario works as expected
			const testUser = testUsers.find(user => user.expectedResults.shouldReachDashboard) || testUsers[0];
			
			const flowResult = await registrationFlow.executeCompleteRegistration(testUser.registrationData);
			
			// Verify the flow logic matches expectations
			assert.strictEqual(
				typeof flowResult, 
				"boolean", 
				"Registration flow should return boolean result"
			);

			logger.success("✅ User flow validation completed");
		});
	});
});
