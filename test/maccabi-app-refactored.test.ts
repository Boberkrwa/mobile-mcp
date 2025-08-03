import * as assert from "node:assert";
import { DriverManager } from "./helpers/driver-manager";
import { MaccabiRegistrationFlow } from "./helpers/registration-flow";
import { maccabiConfig } from "./config/app.config";
import { testUsers, TestUser } from "./data/test-data";
import { Logger } from "./utils/logger";

describe("Maccabi App Tests - Refactored", () => {
	let driverManager: DriverManager;
	let registrationFlow: MaccabiRegistrationFlow;
	let logger: Logger;

	beforeAll(async () => {
		logger = new Logger("MaccabiAppTest");
		logger.info("🧪 Initializing Maccabi app test suite...");

		driverManager = new DriverManager(maccabiConfig);
		await driverManager.initializeDriver();

		registrationFlow = new MaccabiRegistrationFlow(driverManager);

		logger.success("Test suite initialized successfully");
	});

	describe("Registration Flow Tests", () => {
		testUsers.forEach((testUser: TestUser) => {
			it(`✅ Complete Registration Flow: ${testUser.id} (${testUser.registrationData.name}) - ${testUser.registrationData.fetusCount} fetus(es)`, async () => {
				logger.info(`🚀 Starting test for user: ${testUser.id}`);

				// Launch the app
				await driverManager.launchApp();

				// Execute complete registration flow
				const registrationSuccess = await registrationFlow.executeCompleteRegistration(
					testUser.registrationData
				);

				// Assert the registration was successful
				assert.strictEqual(
					registrationSuccess,
					testUser.expectedResults.shouldReachDashboard,
					`Registration should ${testUser.expectedResults.shouldReachDashboard ? "succeed" : "fail"} for ${testUser.id}`
				);

				// Verify we're still in the Maccabi app
				const currentPackage = await registrationFlow.getCurrentPackage();
				assert.strictEqual(currentPackage, maccabiConfig.appPackage);

				logger.success(`✅ Test completed successfully for user: ${testUser.id}`);
			}, 120000); // 2 minute timeout for each test
		});
	});

	describe("Single User Registration Test", () => {
		it("🎯 Quick Registration Test - Default User Flow Validation", async () => {
			logger.info("🚀 Starting single user registration test...");

			// Use the first test user
			const defaultUser = testUsers[0];

			// Launch the app
			await driverManager.launchApp();

			// Execute complete registration flow
			const registrationSuccess = await registrationFlow.executeCompleteRegistration(
				defaultUser.registrationData
			);

			// Assert the registration was successful
			assert.strictEqual(
				registrationSuccess,
				true,
				"Registration should complete successfully"
			);

			// Verify we're still in the Maccabi app
			const currentPackage = await registrationFlow.getCurrentPackage();
			assert.strictEqual(currentPackage, maccabiConfig.appPackage);

			logger.success("✅ Single user registration test completed successfully");
		}, 120000); // 2 minute timeout
	});

	afterAll(async () => {
		logger.info("🔄 Cleaning up test suite...");

		if (driverManager) {
			await driverManager.quitDriver();
		}

		logger.success("✅ Test suite cleanup completed");
	});
});
