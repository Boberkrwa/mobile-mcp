import * as assert from "node:assert";
import { DriverManager } from "../test/helpers/driver-manager";
import { MaccabiRegistrationFlow } from "../test/helpers/registration-flow";
import { maccabiConfig } from "../test/config/app.config";
import { testUsers } from "../test/data/test-data";
import { Logger } from "../test/utils/logger";

/**
 * Maccabi App Tests
 * Core functionality tests for registration and file upload.
 */
describe("Maccabi App Tests", () => {
	let driverManager: DriverManager;
	let registrationFlow: MaccabiRegistrationFlow;
	let logger: Logger;

	beforeAll(async () => {
		logger = new Logger("MaccabiTest");
		logger.info("Initializing Maccabi test suite...");

		driverManager = new DriverManager(maccabiConfig);
		await driverManager.initializeDriver();

		registrationFlow = new MaccabiRegistrationFlow(driverManager);

		logger.success("Test suite initialized successfully");
	}, 120000); // 2 minute timeout

	afterAll(async () => {
		logger.info("Cleaning up test suite...");

		if (driverManager) {
			await driverManager.quitDriver();
		}

		logger.success("Test suite cleanup completed");
	});

	it("Registration", async () => {
		logger.step(1, "Starting registration test");

		// Launch app
		await driverManager.launchApp();
		logger.action("App launched successfully");

		// Check if registration is needed or go to home page
		const testUser = testUsers[0];
		const registrationResult = await registrationFlow.executeCompleteRegistration(
			testUser.registrationData
		);

		if (registrationResult) {
			logger.success("Registration completed successfully");
		} else {
			logger.info("Already registered, proceeded to home page");
		}

		// Verify we're in the correct app
		const currentPackage = await registrationFlow.getCurrentPackage();
		assert.strictEqual(currentPackage, maccabiConfig.appPackage);

		logger.success("Registration test completed");
	});

	it("Add File", async () => {
		logger.step(1, "Starting add file test");

		// Launch app
		await driverManager.launchApp();
		logger.action("App launched for file upload");

		// TODO: Implement file upload functionality
		// This will need to be implemented based on your app's file upload flow
		logger.info("File upload functionality to be implemented");

		// Verify we're still in the correct app
		const currentPackage = await registrationFlow.getCurrentPackage();
		assert.strictEqual(currentPackage, maccabiConfig.appPackage);

		logger.success("Add file test completed");
	});
});
