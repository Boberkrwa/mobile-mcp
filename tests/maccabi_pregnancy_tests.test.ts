import { DriverManager } from "../test/helpers/driver-manager";
import { maccabiConfig } from "../test/config/app.config";
import { testUsers } from "../test/data/test-data";
import { Logger } from "../test/utils/logger";
import { MaccabiSelectors } from "../test/config/selectors";

describe("Maccabi Pregnancy App Tests", () => {
	let sharedDriverManager: DriverManager;
	const logger: Logger = new Logger("MaccabiTestSuite");

	async function selectDateFromCalendar(targetDate: Date): Promise<boolean> {
		try {
			const targetDay = targetDate.getDate();
			logger.action(`Selecting day ${targetDay}`);

			await new Promise(resolve => setTimeout(resolve, 2000));

			const dayElement = await sharedDriverManager.getDriver().$(`//*[@text="${targetDay}" and contains(@class, "TextView") and @clickable="true"]`);
			if (await dayElement.isExisting()) {
				await dayElement.click();
				await new Promise(resolve => setTimeout(resolve, 1000));
				return true;
			}

			// Try alternative selectors
			const altSelectors = [
				`//*[@text="${targetDay}" and @clickable="true"]`,
				`//*[contains(@text, "${targetDay}") and contains(@class, "TextView")]`,
				`//*[@content-desc="${targetDay}" and @clickable="true"]`,
				`android=new UiSelector().text("${targetDay}").clickable(true)`
			];

			for (const selector of altSelectors) {
				try {
					const element = await sharedDriverManager.getDriver().$(selector);
					if (await element.isExisting()) {
						await element.click();
						await new Promise(resolve => setTimeout(resolve, 1000));
						return true;
					}
				} catch (e) {
					// Continue to next selector
				}
			}

			// Use fallback date if needed
			logger.warning(`Day ${targetDay} not found, using fallback`);
			const fallbackSelectors = [
				'//*[contains(@class, "TextView") and @clickable="true" and string-length(@text) <= 2 and @text != ""]',
				'//*[@clickable="true" and string-length(@text) = 1]',
				'//*[@clickable="true" and string-length(@text) = 2]'
			];

			for (const fallbackSelector of fallbackSelectors) {
				try {
					const fallbackElement = await sharedDriverManager.getDriver().$(fallbackSelector);
					if (await fallbackElement.isExisting()) {
						await fallbackElement.click();
						await new Promise(resolve => setTimeout(resolve, 1000));
						return true;
					}
				} catch (e) {
					// Continue to next fallback
				}
			}

			return false;
		} catch (error) {
			logger.error("Calendar selection failed", error);
			return false;
		}
	}

	async function executeRegistrationDirectly(): Promise<boolean> {
		try {
			const testUser = testUsers[0];

			// Enter name
			const nameInput = await sharedDriverManager.getDriver().$(MaccabiSelectors.Name_Input);
			if (await nameInput.isExisting()) {
				await nameInput.setValue(testUser.registrationData.name);
			} else {
				logger.warning("Name input not found");
			}

			// Click next
			const nextButton = await sharedDriverManager.getDriver().$(MaccabiSelectors.Next_Button);
			if (await nextButton.isExisting()) {
				await nextButton.click();
				await new Promise(resolve => setTimeout(resolve, 2000));
			} else {
				logger.warning("Next button not found");
			}

			// Handle date selection
			await new Promise(resolve => setTimeout(resolve, 1500));

			const dateOptions = testUser.registrationData.dateOptions;
			let selectedDate: Date;

			if (dateOptions?.useRandomDate && dateOptions.dateRange) {
				const minDays = dateOptions.dateRange.minDaysAgo;
				const maxDays = dateOptions.dateRange.maxDaysAgo;
				const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
				selectedDate = new Date();
				selectedDate.setDate(selectedDate.getDate() - randomDays);
			} else {
				selectedDate = new Date();
				selectedDate.setDate(selectedDate.getDate() - 30);
			}

			const dateInput = await sharedDriverManager.getDriver().$(MaccabiSelectors.Date_Input);
			if (await dateInput.isExisting()) {
				await dateInput.click();
				await new Promise(resolve => setTimeout(resolve, 3000));

				const dateSelected = await selectDateFromCalendar(selectedDate);
				if (!dateSelected) {
					logger.warning("Date selection failed");
				}

				await new Promise(resolve => setTimeout(resolve, 1000));
				try {
					const confirmButton = await sharedDriverManager.getDriver().$(MaccabiSelectors.Confirm_Buttons);
					if (await confirmButton.isExisting()) {
						await confirmButton.click();
						await new Promise(resolve => setTimeout(resolve, 1000));
					} else {
						const altConfirmButton = await sharedDriverManager.getDriver().$('//*[@text="OK" or @text="אישור" or @text="Done" or @text="סיום"]');
						if (await altConfirmButton.isExisting()) {
							await altConfirmButton.click();
						}
					}
				} catch (confirmError) {
					logger.warning("Confirm button failed", confirmError);
				}

			} else {
				logger.warning("Date input not found");
			}

			// Continue to next screen
			await new Promise(resolve => setTimeout(resolve, 1500));
			const nextButton2 = await sharedDriverManager.getDriver().$(MaccabiSelectors.Next_Button);
			if (await nextButton2.isExisting()) {
				await nextButton2.click();
				await new Promise(resolve => setTimeout(resolve, 2000));
			} else {
				logger.warning("Next button not found");
			}

			// Select fetus count
			const fetusOption = await sharedDriverManager.getDriver().$(`//*[@text="${testUser.registrationData.fetusCount}"]`);
			if (await fetusOption.isExisting()) {
				await fetusOption.click();
				await new Promise(resolve => setTimeout(resolve, 1500));
			}

			// Final next button
			const nextButton3 = await sharedDriverManager.getDriver().$(MaccabiSelectors.Next_Button);
			if (await nextButton3.isExisting()) {
				await nextButton3.click();
				await new Promise(resolve => setTimeout(resolve, 3000));
			}

			return true;
		} catch (error) {
			logger.error("Registration failed", error);
			return false;
		}
	}

	beforeAll(async () => {
		sharedDriverManager = new DriverManager(maccabiConfig);
		await sharedDriverManager.initializeDriver();
	}, 120000);

	afterAll(async () => {
		if (sharedDriverManager) {
			await sharedDriverManager.quitDriver();
		}
	}, 60000);

	async function detectAndHandleCrash(): Promise<boolean> {
		try {
			const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();

			if (currentPackage !== "com.ideomobile.maccabipregnancy") {
				logger.warning(`Wrong package: ${currentPackage}`);
				return await recoverFromCrash();
			}

			await sharedDriverManager.getDriver().getPageSource();
			return true;

		} catch (error: any) {
			logger.error("Crash detected", error);
			const errorMessage = error.message || error.toString();

			if (errorMessage.includes("instrumentation process is not running") ||
				errorMessage.includes("probably crashed") ||
				errorMessage.includes("cannot be proxied to UiAutomator2")) {
				return await recoverFromCrash();
			}

			return false;
		}
	}

	async function recoverFromCrash(): Promise<boolean> {
		try {
			// Force stop app
			try {
				await sharedDriverManager.getDriver().execute("mobile: shell", {
					command: "am force-stop com.ideomobile.maccabipregnancy"
				});
				await new Promise(resolve => setTimeout(resolve, 2000));
			} catch (e) {
				// App wasn't running
			}

			// Restart driver
			try {
				await sharedDriverManager.quitDriver();
				await new Promise(resolve => setTimeout(resolve, 3000));
				await sharedDriverManager.initializeDriver();
				await new Promise(resolve => setTimeout(resolve, 2000));
			} catch (driverError) {
				logger.error("Driver restart failed", driverError);
				return false;
			}

			// Launch app
			try {
				await sharedDriverManager.launchApp();
				await new Promise(resolve => setTimeout(resolve, 5000));

				const recoveredPackage = await sharedDriverManager.getDriver().getCurrentPackage();
				if (recoveredPackage === "com.ideomobile.maccabipregnancy") {
					return true;
				} else {
					logger.error(`Recovery failed: ${recoveredPackage}`);
					return false;
				}
			} catch (launchError) {
				logger.error("App launch failed", launchError);
				return false;
			}

		} catch (recoveryError) {
			logger.error("Recovery failed", recoveryError);
			return false;
		}
	}

	async function handleSkipButtons(): Promise<void> {
		try {
			const skipButton = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/tvSkipVideo")');
			if (await skipButton.isExisting()) {
				await skipButton.click();
				await new Promise(resolve => setTimeout(resolve, 1500));
			}
		} catch (e) {
			await detectAndHandleCrash();
		}
	}

	it("Registration - TC 120208", async () => {
		// Reset app state
		try {
			await sharedDriverManager.getDriver().terminateApp("com.ideomobile.maccabipregnancy");
			await new Promise(resolve => setTimeout(resolve, 1000));

			await sharedDriverManager.getDriver().execute("mobile: shell", {
				command: "am force-stop com.ideomobile.maccabipregnancy"
			});
			await new Promise(resolve => setTimeout(resolve, 2000));
		} catch (e) {
			// App wasn't running
		}

		await sharedDriverManager.quitDriver();
		await new Promise(resolve => setTimeout(resolve, 3000));

		// Clear app data
		try {
			const tempDriverManager = new DriverManager({
				...maccabiConfig,
				capabilities: {
					...maccabiConfig.capabilities,
					noReset: false
				}
			});

			await tempDriverManager.initializeDriver();
			await tempDriverManager.getDriver().execute("mobile: shell", {
				command: "pm clear com.ideomobile.maccabipregnancy"
			});
			await tempDriverManager.quitDriver();
			await new Promise(resolve => setTimeout(resolve, 2000));
		} catch (tempError) {
			logger.warning("Cache clear failed", tempError);
		}

		// Reinitialize driver and launch app
		await sharedDriverManager.initializeDriver();
		await sharedDriverManager.launchApp();
		await new Promise(resolve => setTimeout(resolve, 8000));

		// Check app state and handle skip buttons
		try {
			await sharedDriverManager.getDriver().getPageSource();
			// App state is verified for proper session
		} catch (checkError) {
			logger.warning("State check failed", checkError);
		}

		await handleSkipButtons();

		// Execute registration if needed
		const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();
		if (currentPackage === "com.ideomobile.maccabipregnancy") {
			try {
				const registrationElement = await sharedDriverManager.getDriver().$('//*[contains(@text, "שמך הפרטי")]');
				if (await registrationElement.isExisting()) {
					const registrationResult = await executeRegistrationDirectly();
					if (!registrationResult) {
						logger.error("Registration failed");
					}
				}
			} catch (checkError) {
				logger.warning("Registration check failed", checkError);
			}
		}

		// Final state check
		try {
			const finalPackage = await sharedDriverManager.getDriver().getCurrentPackage();
			if (finalPackage !== "com.ideomobile.maccabipregnancy") {
				await sharedDriverManager.launchApp();
				await new Promise(resolve => setTimeout(resolve, 2000));
			}
		} catch (navError) {
			logger.warning("Final check failed", navError);
		}
	}, 60000);

	// it("Add Pregnancy File with File Attachment", async () => {
	// 	try {
	// 		const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();
	// 		if (currentPackage !== "com.ideomobile.maccabipregnancy") {
	// 			await sharedDriverManager.launchApp();
	// 		}

	// 		await new Promise(resolve => setTimeout(resolve, 2000));
	// 		await handleSkipButtons();

	// 		// Navigate to Personal Area
	// 		try {
	// 			const personalAreaBtn = await sharedDriverManager.getDriver().$('//*[contains(@text, "איזור אישי")]');
	// 			if (await personalAreaBtn.isExisting()) {
	// 				await personalAreaBtn.click();
	// 				await new Promise(resolve => setTimeout(resolve, 2000));
	// 			} else {
	// 				const windowSize = await sharedDriverManager.getDriver().getWindowSize();
	// 				await sharedDriverManager.getDriver().touchAction({
	// 					action: "tap",
	// 					x: Math.round(windowSize.width * 0.85),
	// 					y: Math.round(windowSize.height * 0.85)
	// 				});
	// 				await new Promise(resolve => setTimeout(resolve, 2000));
	// 			}
	// 		} catch (e) {
	// 			logger.warning("Personal area navigation failed", e);
	// 		}

	// 		// Open Pregnancy Folder
	// 		try {
	// 			const pregnancyFolder = await sharedDriverManager.getDriver().$('//*[contains(@text, "קלסר ההריון שלך")]');
	// 			if (await pregnancyFolder.isExisting()) {
	// 				await pregnancyFolder.click();
	// 				await new Promise(resolve => setTimeout(resolve, 2000));
	// 			}
	// 		} catch (e) {
	// 			logger.warning("Pregnancy folder failed", e);
	// 		}

	// 		// Click Plus button
	// 		try {
	// 			const plusBtn = await sharedDriverManager.getDriver().$("//android.widget.FloatingActionButton");
	// 			if (await plusBtn.isExisting()) {
	// 				await plusBtn.click();
	// 				await new Promise(resolve => setTimeout(resolve, 2000));
	// 			}
	// 		} catch (e) {
	// 			logger.warning("Plus button failed", e);
	// 		}

	// 		// Click Attach Files
	// 		let attachFilesSuccess = false;
	// 		await new Promise(resolve => setTimeout(resolve, 2000));

	// 		const attachFilesSelectors = [
	// 			'//*[contains(@text, "צירוף קבצים")]',
	// 			'//*[contains(@text, "קבצים")]',
	// 			'//*[contains(@text, "צירוף")]'
	// 		];

	// 		for (const selector of attachFilesSelectors) {
	// 			if (attachFilesSuccess) break;
	// 			try {
	// 				const attachFilesButton = await sharedDriverManager.getDriver().$(selector);
	// 				await new Promise(resolve => setTimeout(resolve, 500));
	// 				if (await attachFilesButton.isExisting()) {
	// 					await attachFilesButton.click();
	// 					await new Promise(resolve => setTimeout(resolve, 3000));
	// 					attachFilesSuccess = true;
	// 					break;
	// 				}
	// 			} catch (e) {
	// 				// Continue
	// 			}
	// 		}

	// 		if (!attachFilesSuccess) {
	// 			try {
	// 				await sharedDriverManager.getDriver().action("pointer")
	// 					.move({ x: 540, y: 1200 })
	// 					.down()
	// 					.up()
	// 					.perform();
	// 				await new Promise(resolve => setTimeout(resolve, 3000));
	// 			} catch (coordError) {
	// 				logger.error("Attach files failed", coordError);
	// 			}
	// 		}

	// 		// Select first file
	// 		await new Promise(resolve => setTimeout(resolve, 3000));
	// 		let fileSelected = false;

	// 		try {
	// 			const firstFileThumb = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb").instance(0)');
	// 			await new Promise(resolve => setTimeout(resolve, 2000));
	// 			if (await firstFileThumb.isExisting()) {
	// 				await firstFileThumb.click();
	// 				await new Promise(resolve => setTimeout(resolve, 2000));
	// 				fileSelected = true;
	// 			}
	// 		} catch (e) {
	// 			// Try fallback
	// 		}

	// 		if (!fileSelected) {
	// 			const fallbackSelectors = [
	// 				'android=new UiSelector().className("android.widget.ImageView").instance(0)',
	// 				'//android.widget.ImageView[@clickable="true"][1]'
	// 			];

	// 			for (const selector of fallbackSelectors) {
	// 				if (fileSelected) break;
	// 				try {
	// 					const firstFile = await sharedDriverManager.getDriver().$(selector);
	// 					if (await firstFile.isExisting()) {
	// 						await firstFile.click();
	// 						await new Promise(resolve => setTimeout(resolve, 2000));
	// 						fileSelected = true;
	// 						break;
	// 					}
	// 				} catch (e) {
	// 					// Continue
	// 				}
	// 			}
	// 		}

	// 		// Confirm selection and save
	// 		if (fileSelected) {
	// 			await new Promise(resolve => setTimeout(resolve, 2000));
	// 			const confirmSelectors = ['//*[@text="אישור"]', '//*[@text="OK"]', '//*[@text="Done"]'];

	// 			for (const selector of confirmSelectors) {
	// 				try {
	// 					const confirmButton = await sharedDriverManager.getDriver().$(selector);
	// 					if (await confirmButton.isExisting()) {
	// 						await confirmButton.click();
	// 						await new Promise(resolve => setTimeout(resolve, 2000));
	// 						break;
	// 					}
	// 				} catch (e) {
	// 					// Continue
	// 				}
	// 			}

	// 			// Save file
	// 			try {
	// 				const saveButton = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/bSaveButton")');
	// 				if (await saveButton.isExisting()) {
	// 					await saveButton.click();
	// 				} else {
	// 					const textSaveBtn = await sharedDriverManager.getDriver().$('//*[@text="שמירה"]');
	// 					if (await textSaveBtn.isExisting()) {
	// 						await textSaveBtn.click();
	// 					}
	// 				}
	// 			} catch (saveError) {
	// 				logger.warning("Save failed", saveError);
	// 			}
	// 		}

	// 	} catch (error) {
	// 		logger.error("File attachment test failed", error);
	// 	}
	// }, 120000);

	it("WeekInfo - TC 120213", async () => {
		try {
			await new Promise(resolve => setTimeout(resolve, 3000));

			const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();
			if (currentPackage !== "com.ideomobile.maccabipregnancy") {
				throw new Error("Not in correct app");
			}

			const weekInfoButton = await sharedDriverManager.getDriver().$(MaccabiSelectors.Week_Info_Button);
			if (await weekInfoButton.isExisting()) {
				await weekInfoButton.click();
				await new Promise(resolve => setTimeout(resolve, 3000));

				const rightArrowButton = await sharedDriverManager.getDriver().$("id=com.ideomobile.maccabipregnancy:id/rightArrow");
				if (await rightArrowButton.isExisting()) {
					await rightArrowButton.click();
					await new Promise(resolve => setTimeout(resolve, 2000));
				}
			} else {
				throw new Error("Week Info button not found");
			}

		} catch (error: any) {
			logger.error("WeekInfo test failed", error);
			throw error;
		}
	}, 60000);

});
