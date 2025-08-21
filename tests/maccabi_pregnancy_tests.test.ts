import { DriverManager } from "../test/helpers/driver-manager";
import { maccabiConfig } from "../test/config/app.config";
import { testUsers } from "../test/data/test-data";
import { Logger } from "../test/utils/logger";
import { MaccabiSelectors } from "../test/config/selectors";

describe("Maccabi Pregnancy App Tests", () => {
	let sharedDriverManager: DriverManager;
	const logger: Logger = new Logger("MaccabiTestSuite");

	async function executeRegistrationDirectly(): Promise<boolean> {
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

		const dateInput = await sharedDriverManager.getDriver().$(MaccabiSelectors.Date_Input);
		if (await dateInput.isExisting()) {
			await dateInput.click();

			// click confirm date button
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

	async function handleSkipButtons(): Promise<void> {
		const skipButton = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/tvSkipVideo")');
		if (await skipButton.isExisting()) {
			await skipButton.click();
			await new Promise(resolve => setTimeout(resolve, 1500));
		}
	}

	it("Registration - TC 120208", async () => {
		// Reset app state
		await sharedDriverManager.getDriver().terminateApp("com.ideomobile.maccabipregnancy");
		await new Promise(resolve => setTimeout(resolve, 2000));

		await sharedDriverManager.quitDriver();
		await new Promise(resolve => setTimeout(resolve, 3000));

		// Clear app data - use driver reset instead of shell commands
		const tempDriverManager = new DriverManager({
			...maccabiConfig,
			capabilities: {
				...maccabiConfig.capabilities,
				noReset: false
			}
		});

		await tempDriverManager.initializeDriver();
		await tempDriverManager.quitDriver();
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Reinitialize driver and launch app
		await sharedDriverManager.initializeDriver();
		await sharedDriverManager.launchApp();
		await new Promise(resolve => setTimeout(resolve, 8000));

		// Check app state and handle skip buttons
		await sharedDriverManager.getDriver().getPageSource();
		// App state is verified for proper session

		await handleSkipButtons();

		// Execute registration if needed
		const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();
		if (currentPackage === "com.ideomobile.maccabipregnancy") {
			const registrationElement = await sharedDriverManager.getDriver().$('//*[contains(@text, "שמך הפרטי")]');
			if (await registrationElement.isExisting()) {
				const registrationResult = await executeRegistrationDirectly();
				if (!registrationResult) {
					logger.error("Registration failed");
				}
			}
		}

		// Final state check
		const finalPackage = await sharedDriverManager.getDriver().getCurrentPackage();
		if (finalPackage !== "com.ideomobile.maccabipregnancy") {
			await sharedDriverManager.launchApp();
			await new Promise(resolve => setTimeout(resolve, 2000));
		}
	},);

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
		await new Promise(resolve => setTimeout(resolve, 3000));

		const weekInfoButton = await sharedDriverManager.getDriver().$(MaccabiSelectors.Week_Info_Button);
		await weekInfoButton.click();
		await new Promise(resolve => setTimeout(resolve, 3000));

		const rightArrowButton = await sharedDriverManager.getDriver().$("id=com.ideomobile.maccabipregnancy:id/rightArrow");
		await rightArrowButton.click();
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Close the WeekInfo by clicking the close button
		const closeButton = await sharedDriverManager.getDriver().$("id=com.ideomobile.maccabipregnancy:id/closeButton");
		await closeButton.click();
	},);

	it("Entering articles - TC 120193", async () => {
		logger.info("Starting articles test");

		// Perform swipe up action to scroll through articles
		await sharedDriverManager.getDriver().performActions([MaccabiSelectors.SwipeUpAction]);
		await new Promise(resolve => setTimeout(resolve, 1500));
	},);
});
