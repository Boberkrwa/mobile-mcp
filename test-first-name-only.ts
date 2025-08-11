import { DriverManager } from "./test/helpers/driver-manager";
import { Logger } from "./test/utils/logger";
import { maccabiConfig } from "./test/config/app.config";

const logger = new Logger("FirstNameTest");
const driverManager = new DriverManager(maccabiConfig);

async function testFirstNameInputOnly() {
	try {
		logger.info("Starting focused first name input test...");

		// Initialize driver
		await driverManager.initializeDriver();
		const driver = driverManager.getDriver();

		// Launch app
		await driverManager.launchApp();
		await new Promise(resolve => setTimeout(resolve, 3000));

		// Skip any intro screens quickly
		const skipSelectors = [
			'android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/tvSkipVideo")',
			'xpath=//*[@text="דלג"]',
			'xpath=//*[@text="Skip"]'
		];

		for (let i = 0; i < 3; i++) {
			for (const selector of skipSelectors) {
				try {
					const skipButton = await driver.$(selector);
					if (await skipButton.isExisting()) {
						await skipButton.click();
						logger.action(`Clicked skip button: ${selector}`);
						await new Promise(resolve => setTimeout(resolve, 1000));
						break;
					}
				} catch (e) {
					// Continue to next selector
				}
			}
			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		// Wait for registration form
		await new Promise(resolve => setTimeout(resolve, 3000));

		// ENHANCED FIRST NAME INPUT TEST
		logger.action("🎯 TESTING ENHANCED FIRST NAME INPUT");

		const firstNameSelectors = [
			// UiAutomator2 native approach
			'android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/editTextFirstName")',
			'android=new UiSelector().className("android.widget.EditText").instance(0)',
			'android=new UiSelector().text("שם פרטי")',

			// Enhanced XPath approaches
			'xpath=//*[@resource-id="com.ideomobile.maccabipregnancy:id/editTextFirstName"]',
			"xpath=//android.widget.EditText[1]",
			'xpath=//*[@text="שם פרטי"]',
			'xpath=//*[contains(@text, "שם")]'
		];

		let fieldFound = false;

		for (const selector of firstNameSelectors) {
			try {
				logger.action(`Trying selector: ${selector}`);
				const field = await driver.$(selector);

				if (await field.isExisting()) {
					logger.success(`✅ FOUND field with: ${selector}`);

					// ENHANCED INPUT PROCESS
					logger.action("Step 1: Multiple clicks for focus");
					await field.click();
					await new Promise(resolve => setTimeout(resolve, 500));
					await field.click();
					await new Promise(resolve => setTimeout(resolve, 500));

					logger.action("Step 2: Clear field");
					await field.clearValue();
					await new Promise(resolve => setTimeout(resolve, 300));

					logger.action("Step 3: Set value with enhanced approach");
					await field.setValue("בובר קורבה");
					await new Promise(resolve => setTimeout(resolve, 1000));

					// Verify input
					const value = await field.getValue();
					logger.info(`Field value after input: "${value}"`);

					if (value && value.includes("בובר")) {
						logger.success("🎉 FIRST NAME INPUT SUCCESSFUL!");
						fieldFound = true;
						break;
					} else {
						logger.warning("Text not properly set, trying alternative method...");

						// Alternative: Send keys directly
						await field.click();
						await new Promise(resolve => setTimeout(resolve, 500));
						await driver.keys("בובר קורבה");
						await new Promise(resolve => setTimeout(resolve, 1000));

						const value2 = await field.getValue();
						logger.info(`Field value after keys method: "${value2}"`);

						if (value2 && value2.includes("בובר")) {
							logger.success("🎉 FIRST NAME INPUT SUCCESSFUL WITH KEYS METHOD!");
							fieldFound = true;
							break;
						}
					}
				}
			} catch (error: any) {
				logger.info(`Selector failed: ${selector} - ${error?.message || "Unknown error"}`);
			}
		}

		if (!fieldFound) {
			logger.error("❌ No first name field found with any selector!");

			// Try screen-wide search
			logger.action("Trying screen-wide EditText search...");
			const allEditTexts = await driver.$$('android=new UiSelector().className("android.widget.EditText")');
			logger.info(`Found ${allEditTexts.length} EditText elements on screen`);

			for (let i = 0; i < allEditTexts.length; i++) {
				try {
					const editText = allEditTexts[i];
					logger.action(`Testing EditText ${i + 1}...`);

					await editText.click();
					await new Promise(resolve => setTimeout(resolve, 500));
					await editText.setValue("בובר קורבה");
					await new Promise(resolve => setTimeout(resolve, 1000));

					const value = await editText.getValue();
					logger.info(`EditText ${i + 1} value: "${value}"`);

					if (value && value.includes("בובר")) {
						logger.success(`🎉 SUCCESS with EditText ${i + 1}!`);
						fieldFound = true;
						break;
					}
				} catch (e: any) {
					logger.info(`EditText ${i + 1} failed: ${e?.message || "Unknown error"}`);
				}
			}
		}

		logger.info("First name input test completed");

	} catch (error) {
		logger.error("Test failed", error);
	} finally {
		try {
			if (driverManager.getDriver()) {
				await driverManager.getDriver().deleteSession();
			}
		} catch (e) {
			logger.info("Driver cleanup completed");
		}
	}
}

// Run the test
testFirstNameInputOnly().then(() => {
	console.log("Test execution completed");
}).catch(error => {
	console.error("Test execution failed:", error);
});
