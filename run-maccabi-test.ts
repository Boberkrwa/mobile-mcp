import { remote } from "webdriverio";
import * as assert from "node:assert";

const deviceId = "b7a325f6"; // Your connected device ID
const maccabiPackage = "com.ideomobile.maccabipregnancy";
const maccabiActivity = ".ui.splash.view.PASplashActivity"; // Splash screen activity

async function runMaccabiTest() {
	console.log("🚀 Starting Maccabi app test...");

	let driver: any;

	try {
		// Initialize WebDriver
		console.log("📱 Connecting to device...");
		driver = await remote({
			hostname: "localhost",
			port: 4723,
			path: "/",
			logLevel: "info",
			capabilities: {
				"platformName": "Android",
				"appium:deviceName": deviceId,
				"appium:udid": deviceId,
				"appium:appPackage": maccabiPackage,
				"appium:appActivity": maccabiActivity,
				"appium:automationName": "UiAutomator2",
				"appium:noReset": true
			}
		});

		// Launch the app
		await driver.startActivity(maccabiPackage, maccabiActivity);
		await driver.pause(3000);

		console.log("🚀 Starting Maccabi app automation...");

		// Step 1: Wait for splash screen to disappear
		console.log("⏳ Waiting for splash screen...");
		let splashScreenAttempts = 0;
		const maxSplashAttempts = 10;

		while (splashScreenAttempts < maxSplashAttempts) {
			splashScreenAttempts++;
			console.log(`Checking for splash screen... attempt ${splashScreenAttempts}`);

			try {
				const textElements = await driver.$$(
					`//*[contains(@class, "android.widget.TextView")]`
				);

				if (textElements.length === 0) {
					console.log("✅ Splash screen disappeared - proceeding to main logic");
					break;
				}

				await driver.pause(2000);
			} catch (e: unknown) {
				console.log("Error checking splash screen:", e instanceof Error ? e.message : String(e));
				break;
			}
		}

		// Step 2: Look for and click skip button
		console.log("🔍 Looking for skip button...");
		let skipButtonFound = false;
		let attempts = 0;
		const maxAttempts = 5;

		while (!skipButtonFound && attempts < maxAttempts) {
			attempts++;
			console.log(`Attempt ${attempts}: Looking for skip button...`);

			try {
				const elements = await driver.$$(
					`//*[contains(@class, "android.widget.EditText") or
                       contains(@class, "android.widget.Button") or
                       contains(@class, "android.widget.TextView") or
                       contains(@class, "android.widget.ImageButton")]`
				);

				for (const element of elements) {
					try {
						const text = await element.getText();
						const contentDesc = await element.getAttribute("content-desc");
						console.log(`Found element: text="${text}", contentDesc="${contentDesc}"`);

						if (text === "דלגי" || contentDesc === "דלגי") {
							console.log("🔄 Found skip button (דלגי) - clicking it...");
							await element.click();
							skipButtonFound = true;
							await driver.pause(3000); // Wait for navigation
							break;
						}
					} catch (e) {
						// Continue to next element
					}
				}

				if (!skipButtonFound) {
					await driver.pause(2000);
				}
			} catch (e) {
				console.log(`Error in attempt ${attempts}:`, e instanceof Error ? e.message : String(e));
				await driver.pause(2000);
			}
		}

		if (!skipButtonFound) {
			console.log("⚠️ Skip button not found - continuing anyway...");
		}

		// Step 3: Enter name
		console.log("📝 Looking for name input field...");
		await driver.pause(2000);

		try {
			const nameInput = await driver.$("id=com.ideomobile.maccabipregnancy:id/nameTextInputEditText");
			const nameInputExists = await nameInput.isExisting();

			if (nameInputExists) {
				console.log("✅ Found name input field - entering name...");
				await nameInput.setValue("מיכאל קורולנקו");
				console.log("✅ Entered name: מיכאל קורולנקו");

				// Click continue
				const continueButton = await driver.$("id=com.ideomobile.maccabipregnancy:id/nextButton");
				await continueButton.click();
				console.log("🔄 Clicked continue after name input");
				await driver.pause(3000);
			} else {
				console.log("❌ Name input field not found");
			}
		} catch (e) {
			console.log("Error with name input:", e instanceof Error ? e.message : String(e));
		}

		// Step 4: Date input and selection
		console.log("📅 Looking for date input field...");
		await driver.pause(2000);

		try {
			const dateInput = await driver.$("id=com.ideomobile.maccabipregnancy:id/textInputEditText");
			const dateInputExists = await dateInput.isExisting();

			if (dateInputExists) {
				console.log("✅ Found date input field - clicking to open date picker...");
				await dateInput.click();
				console.log("🔄 Clicked date input field");
				await driver.pause(3000); // Wait for date picker to open

				// Look for available dates on the calendar
				console.log("📅 Looking for available dates on calendar...");

				// Try multiple strategies to find clickable date elements
				let daySelected = false;
				const availableDates = [];

				// Strategy 1: Look for TextView elements that are clickable and contain numbers
				const dateElements = await driver.$$(
					`//*[contains(@class, "android.widget.TextView") and @clickable="true"]`
				);

				console.log(`Found ${dateElements.length} potential clickable date elements`);

				// Collect available dates (numbers between 1-31)
				for (const element of dateElements) {
					try {
						const text = await element.getText();
						const dateNumber = parseInt(text.trim(), 10);

						if (!isNaN(dateNumber) && dateNumber >= 1 && dateNumber <= 31) {
							// Check if element is enabled and clickable
							const isEnabled = await element.isEnabled();
							const isClickable = await element.isClickable();

							if (isEnabled && isClickable) {
								availableDates.push({ element, dateNumber });
								console.log(`✅ Found available date: ${dateNumber}`);
							}
						}
					} catch (e) {
						// Skip elements we can't read
					}
				}

				// Select a random date from available dates
				if (availableDates.length > 0) {
					const randomIndex = Math.floor(Math.random() * availableDates.length);
					const selectedDate = availableDates[randomIndex];

					console.log(`🎯 Selecting random date: ${selectedDate.dateNumber} from ${availableDates.length} available dates`);
					await selectedDate.element.click();
					daySelected = true;
					console.log(`✅ Successfully clicked date: ${selectedDate.dateNumber}`);
					await driver.pause(2000);
				} else {
					console.log("⚠️ No available dates found, trying direct date input...");

					// Fallback: Try to input a date directly
					const randomDay = Math.floor(Math.random() * 28) + 1; // Safe range 1-28
					const randomMonth = Math.floor(Math.random() * 12) + 1; // 1-12
					const currentYear = new Date().getFullYear();
					const dateString = `${randomDay}/${randomMonth}/${currentYear}`;

					await dateInput.setValue(dateString);
					console.log(`📅 Entered date directly: ${dateString}`);
					daySelected = true;
					await driver.pause(2000);
				}

				if (daySelected) {
					// Click continue button to proceed
					const continueButton = await driver.$("id=com.ideomobile.maccabipregnancy:id/nextButton");
					await continueButton.click();
					console.log("🔄 Clicked continue after date selection");
					await driver.pause(3000);

					// Analyze the next screen
					console.log("🔍 Analyzing next screen after date selection...");
					const nextScreenElements = await driver.$$(
						`//*[contains(@class, "android.widget.EditText") or 
                           contains(@class, "android.widget.Button") or 
                           contains(@class, "android.widget.TextView")]`
					);

					console.log(`Found ${nextScreenElements.length} elements on next screen:`);
					for (let i = 0; i < Math.min(nextScreenElements.length, 8); i++) {
						try {
							const text = await nextScreenElements[i].getText();
							const resourceId = await nextScreenElements[i].getAttribute("resource-id");
							console.log(`${i + 1}. "${text}" (ID: ${resourceId})`);
						} catch (e) {
							console.log(`${i + 1}. Could not read element`);
						}
					}
				} else {
					console.log("❌ Failed to select a date");
				}
			} else {
				console.log("❌ Date input field not found");
			}
		} catch (e) {
			console.log("Error with date input:", e instanceof Error ? e.message : String(e));
		}

		// Verify we're still in the Maccabi app
		const currentPackage = await driver.getCurrentPackage();
		assert.equal(currentPackage, maccabiPackage);

		console.log("✅ Test completed successfully!");
		console.log(`📱 Current package: ${currentPackage}`);

	} catch (error) {
		console.error("❌ Test failed:", error);
		throw error;
	} finally {
		if (driver) {
			await driver.deleteSession();
			console.log("🔚 WebDriver session closed");
		}
	}
}

// Run the test
runMaccabiTest()
	.then(() => {
		console.log("🎉 All tests passed!");
		process.exit(0);
	})
	.catch(error => {
		console.error("💥 Test suite failed:", error);
		process.exit(1);
	});
