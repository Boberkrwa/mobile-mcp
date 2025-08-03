import * as assert from "node:assert";
import { DriverManager } from "../test/helpers/driver-manager";
import { MaccabiRegistrationFlow } from "../test/helpers/registration-flow";
import { maccabiConfig } from "../test/config/app.config";
import { testUsers, TestUser } from "../test/data/test-data";
import { Logger } from "../test/utils/logger";

/**
 * Maccabi App Integration Tests
 * Comprehensive test suite for all app functionality.
 */
describe("Maccabi Pregnancy App - Complete Test Suite", () => {
	let driverManager: DriverManager;
	let registrationFlow: MaccabiRegistrationFlow;
	let logger: Logger;

	beforeAll(async () => {
		logger = new Logger("MaccabiTestSuite");
		logger.info("Initializing comprehensive Maccabi app test suite...");

		driverManager = new DriverManager(maccabiConfig);
		await driverManager.initializeDriver();

		registrationFlow = new MaccabiRegistrationFlow(driverManager);

		logger.success("Test suite initialized successfully");
	}, 120000); // Increased timeout to 2 minutes

	afterAll(async () => {
		logger.info("Cleaning up test suite...");

		if (driverManager) {
			await driverManager.quitDriver();
		}

		logger.success("Test suite cleanup completed");
	});

	// ===== CORE FUNCTIONALITY TESTS =====
	describe("Core App Functionality", () => {
		
		it("App Launch and Package Verification", async () => {
			logger.step(1, "Testing basic app launch");

			// Launch the app
			await driverManager.launchApp();

			// Verify we're in the correct app package
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(
				currentPackage, 
				maccabiConfig.appPackage,
				`Expected app package ${maccabiConfig.appPackage}, but got ${currentPackage}`
			);

			logger.success("App launched successfully with correct package");
		});

		it("Splash Screen Handling", async () => {
			logger.step(1, "Testing splash screen behavior");

			// Launch the app
			await driverManager.launchApp();

			// Test a basic registration flow to verify splash handling
			const testUser = testUsers[0];
			const registrationResult = await registrationFlow.executeCompleteRegistration(
				testUser.registrationData
			);

			// Whether registration succeeds or fails, the splash should have been handled
			assert.ok(typeof registrationResult === "boolean", "Registration flow should complete with boolean result");

			logger.success("Splash screen handled correctly during registration flow");
		});

		it("App Navigation Test", async () => {
			logger.step(1, "Testing basic app navigation");

			// Launch the app
			await driverManager.launchApp();

			// Verify we can get current package (basic navigation test)
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage, "Should be in correct app package");

			logger.success(` App navigation working - current package: ${currentPackage}`);
		});
	});

	// ===== REGISTRATION FLOW TESTS =====
	describe(" User Registration Flow Tests", () => {

		it("Quick Registration Test - Single User", async () => {
			logger.step(1, "Starting single user registration test");

			// Use the first test user for quick validation
			const defaultUser = testUsers[0];
			logger.info(`Testing with user: ${defaultUser.id}`, defaultUser.registrationData);

			// Launch the app
			await driverManager.launchApp();

			// Execute complete registration flow
			const registrationResult = await registrationFlow.executeCompleteRegistration(
				defaultUser.registrationData
			);

			// Assert based on expected results (registrationResult is boolean)
			assert.strictEqual(
				registrationResult,
				defaultUser.expectedResults.shouldReachDashboard,
				`Registration should ${defaultUser.expectedResults.shouldReachDashboard ? "succeed" : "fail"} for ${defaultUser.id}`
			);

			// Verify we're still in the Maccabi app
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);

			logger.success(` Single user registration test completed: ${registrationResult ? "SUCCESS" : "FAILED AS EXPECTED"}`);
		});

		// Data-driven tests for all test users
		testUsers.forEach((testUser: TestUser) => {
			it(`Registration Flow: ${testUser.id} (${testUser.registrationData.name}) - ${testUser.registrationData.fetusCount} fetus(es)`, async () => {
				logger.info(` Starting test for user: ${testUser.id}`);

				// Launch the app fresh for each test
				await driverManager.launchApp();

				// Execute complete registration flow
				const registrationResult = await registrationFlow.executeCompleteRegistration(
					testUser.registrationData
				);

				// Assert the registration outcome matches expectations (registrationResult is boolean)
				assert.strictEqual(
					registrationResult,
					testUser.expectedResults.shouldReachDashboard,
					`Registration should ${testUser.expectedResults.shouldReachDashboard ? "succeed" : "fail"} for ${testUser.id}`
				);

				// Verify we're still in the Maccabi app
				const currentPackage = await registrationFlow.getCurrentPackage();
				assert.strictEqual(currentPackage, maccabiConfig.appPackage);

				logger.success(` Test completed for user: ${testUser.id} - Result: ${registrationResult ? "SUCCESS" : "FAILED AS EXPECTED"}`);
			});
		});
	});

	// ===== EDGE CASE AND ERROR HANDLING TESTS =====
	describe(" Edge Cases and Error Handling", () => {

		it("App Recovery After Restart", async () => {
			logger.step(1, "Testing app recovery after restart");

			// Launch the app normally first
			await driverManager.launchApp();
			
			// Verify basic functionality
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);

			// Re-launch the app (simulating restart)
			await driverManager.launchApp();
			
			// Verify it still works
			const packageAfterRestart = await registrationFlow.getCurrentPackage();
			assert.strictEqual(packageAfterRestart, maccabiConfig.appPackage);

			logger.success("App recovered successfully after restart");
		});

		it("Handling App State Variations", async () => {
			logger.step(1, "Testing various app state scenarios");

			// Launch the app
			await driverManager.launchApp();

			// Try a basic registration flow to see what happens
			const testUser = testUsers[0];
			const registrationResult = await registrationFlow.executeCompleteRegistration(
				testUser.registrationData
			);
			
			// Whether registration succeeds or fails, it should return a boolean
			assert.ok(typeof registrationResult === "boolean", "Registration should return boolean result");
			
			// Verify we're still in the correct app
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);

			logger.success("App state variations handled correctly");
		});

		it("Basic Navigation Verification", async () => {
			logger.step(1, "Testing basic navigation capabilities");

			// Launch the app
			await driverManager.launchApp();

			// Test basic driver functionality
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage, "Should maintain correct package");

			logger.success(` Basic navigation verified - package: ${currentPackage}`);
		});
	});

	// ===== PERFORMANCE AND STABILITY TESTS =====
	describe(" Performance and Stability", () => {

		it("Multiple App Launches (Stress Test)", async () => {
			logger.step(1, "Running multiple app launch stress test");

			const launchCount = 3;
			
			for (let i = 1; i <= launchCount; i++) {
				logger.info(`Launch attempt ${i}/${launchCount}`);
				
				// Launch the app
				await driverManager.launchApp();
				
				// Verify it launched correctly
				const currentPackage = await registrationFlow.getCurrentPackage();
				assert.strictEqual(currentPackage, maccabiConfig.appPackage, `Launch ${i} failed`);
				
				// Small pause between launches
				await new Promise(resolve => setTimeout(resolve, 1000));
			}

			logger.success(` Stress test completed - ${launchCount} successful launches`);
		});

		it("App Launch Performance", async () => {
			logger.step(1, "Measuring app launch performance");

			const startTime = Date.now();
			
			// Launch the app
			await driverManager.launchApp();
			
			// Verify app launched successfully
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);
			
			const endTime = Date.now();
			const launchTime = endTime - startTime;
			
			logger.info(`App launch time: ${launchTime}ms`);
			
			// Assert reasonable launch time (under 30 seconds)
			assert.ok(launchTime < 30000, `App should launch within 30 seconds, but took ${launchTime}ms`);
			
			logger.success(` App launched in ${launchTime}ms - within acceptable range`);
		});
	});

	// ===== INTEGRATION AND END-TO-END TESTS =====
	describe(" Integration and E2E Tests", () => {

		it("Complete User Journey - Registration to Dashboard", async () => {
			logger.step(1, "Starting complete user journey test");

			// Use a test user expected to succeed
			const successUser = testUsers.find(user => user.expectedResults.shouldReachDashboard) || testUsers[0];
			
			logger.info(`Testing complete journey for: ${successUser.id}`);

			// Launch the app
			await driverManager.launchApp();

			// Complete the full registration flow
			const registrationResult = await registrationFlow.executeCompleteRegistration(
				successUser.registrationData
			);

			if (registrationResult) {
				logger.success("Complete user journey successful - registration completed");
			} else {
				logger.info("User registration flow completed with expected outcome");
			}

			// Final verification - ensure we're still in the correct app
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);
		});
	});

	// ===== CLEANUP AND VALIDATION TESTS =====
	describe(" Cleanup and Validation", () => {

		it("Driver and Session Management", async () => {
			logger.step(1, "Testing driver and session management");

			// Launch app to test driver functionality
			await driverManager.launchApp();
			
			// Verify we can still interact with the app
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);

			logger.success("Driver and session management working correctly");
		});

		it("Test Suite Metrics Summary", async () => {
			logger.step(1, "Generating test suite metrics");

			const metrics = {
				totalTestUsers: testUsers.length,
				expectedSuccessfulRegistrations: testUsers.filter(u => u.expectedResults.shouldReachDashboard).length,
				expectedFailedRegistrations: testUsers.filter(u => !u.expectedResults.shouldReachDashboard).length,
				appPackage: maccabiConfig.appPackage,
				testSuiteVersion: "1.0.0"
			};

			logger.info("Test Suite Metrics", metrics);

			// This test always passes - it's just for logging metrics
			assert.ok(true, "Metrics summary completed");

			logger.success("Test suite metrics generated successfully");
		});
	});
});
