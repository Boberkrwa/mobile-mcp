import { DriverManager } from "./test/helpers/driver-manager";
import { maccabiConfig } from "./test/config/app.config";
import { Logger } from "./test/utils/logger";

const logger = new Logger("UiSelectorTest");

(async () => {
	logger.info("Testing your UiSelector directly on the current file picker...");

	const driver = new DriverManager(maccabiConfig);
	await driver.initializeDriver();

	try {
		// Test your specific UiSelector - this should work since file picker is already open
		logger.action("Using your exact UiSelector: com.google.android.documentsui:id/icon_thumb instance(0)");

		const firstFileThumb = await driver.getDriver().$('android=new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb").instance(0)');

		const exists = await firstFileThumb.isExisting();
		logger.info(`UiSelector file thumbnail exists: ${exists}`);

		if (exists) {
			logger.success("SUCCESS: Your UiSelector found the file thumbnail!");
			await firstFileThumb.click();
			logger.success("Successfully clicked on the first file thumbnail using your UiSelector!");

			// Wait a moment
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Check for confirmation buttons
			logger.info("Looking for confirmation buttons...");
			const confirmSelectors = [
				'//*[@text="בחר"]', // Hebrew "Select"
				'//*[@text="OK"]',
				'//*[@text="Done"]',
				'//android.widget.Button[contains(@text, "בחר")]'
			];

			for (const selector of confirmSelectors) {
				try {
					const confirmButton = await driver.getDriver().$(selector);
					if (await confirmButton.isExisting()) {
						logger.action(`Found confirmation button: ${selector}`);
						await confirmButton.click();
						logger.success("Clicked confirmation button!");
						break;
					}
				} catch (e) {
					// Continue to next selector
				}
			}

		} else {
			logger.warning("File thumbnail not found with your UiSelector");

			// Let's see what elements are available
			logger.info("Checking available elements...");
			const allElements = await driver.getDriver().$$("//*[@resource-id]");
			logger.info(`Found ${allElements.length} elements with resource-id`);

			// Check for any icon_thumb elements
			const iconThumbs = await driver.getDriver().$$('//*[@resource-id="com.google.android.documentsui:id/icon_thumb"]');
			logger.info(`Found ${iconThumbs.length} icon_thumb elements`);
		}

	} catch (error) {
		logger.error("Error during UiSelector test:", error);
	}

	await driver.quitDriver();
	logger.info("Test completed");
})();
