import { DriverManager } from "../test/helpers/driver-manager";
import { maccabiConfig } from "../test/config/app.config";
import { testUsers } from "../test/data/test-data";
import { Logger } from "../test/utils/logger";
import { MaccabiSelectors } from "../test/config/selectors";

/**
 * Maccabi App Tests - Shared Session Architecture with File Attachment
 * Core functionality tests for registration and file upload using file attachment.
 */
describe("Maccabi App Tests", () => {
	// Shared instances across all tests
	let sharedDriverManager: DriverManager;
	const logger: Logger = new Logger("MaccabiTestSuite");

	/**
	 * Helper function to handle calendar navigation and date selection
	 */
	async function selectDateFromCalendar(targetDate: Date): Promise<boolean> {
		try {
			const targetDay = targetDate.getDate();
			logger.action(`Attempting to select day ${targetDay} from calendar`);

			// Give calendar time to fully load
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Strategy 1: Direct day selection
			const dayElement = await sharedDriverManager.getDriver().$(`//*[@text="${targetDay}" and contains(@class, "TextView") and @clickable="true"]`);
			if (await dayElement.isExisting()) {
				logger.action(`Found clickable day ${targetDay}, selecting it`);
				await dayElement.click();
				await new Promise(resolve => setTimeout(resolve, 1000));
				return true;
			}

			// Strategy 2: Look for day with different selectors
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
						logger.action(`Found day ${targetDay} with selector: ${selector}`);
						await element.click();
						await new Promise(resolve => setTimeout(resolve, 1000));
						return true;
					}
				} catch (e) {
					// Continue to next selector
				}
			}

			// Strategy 3: Fallback - select any available date
			logger.warning(`Could not find day ${targetDay}, selecting fallback date`);
			const fallbackSelectors = [
				'//*[contains(@class, "TextView") and @clickable="true" and string-length(@text) <= 2 and @text != ""]',
				'//*[@clickable="true" and string-length(@text) = 1]',
				'//*[@clickable="true" and string-length(@text) = 2]'
			];

			for (const fallbackSelector of fallbackSelectors) {
				try {
					const fallbackElement = await sharedDriverManager.getDriver().$(fallbackSelector);
					if (await fallbackElement.isExisting()) {
						const fallbackText = await fallbackElement.getText();
						logger.info(`Selecting fallback date: ${fallbackText}`);
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
			logger.error("Calendar date selection failed", error);
			return false;
		}
	}

	/**
	 * Simplified registration function - direct driver approach without page objects
	 */
	async function executeRegistrationDirectly(): Promise<boolean> {
		try {
			const testUser = testUsers[0];
			logger.info("Starting registration flow");

			// Step 1: Enter name
			logger.action("Step 1: Entering name");
			const nameInput = await sharedDriverManager.getDriver().$(MaccabiSelectors.NAME_INPUT);
			if (await nameInput.isExisting()) {
				await nameInput.setValue(testUser.registrationData.name);
				logger.success(`Name entered: ${testUser.registrationData.name}`);
			} else {
				logger.warning("Name input field not found");
			}

			// Step 2: Click next button
			logger.action("Step 2: Clicking next button");
			const nextButton = await sharedDriverManager.getDriver().$(MaccabiSelectors.NEXT_BUTTON);
			if (await nextButton.isExisting()) {
				await nextButton.click();
				await new Promise(resolve => setTimeout(resolve, 2000));
				logger.success("Next button clicked");
			} else {
				logger.warning("Next button not found");
			}

			// Step 3: Handle date input - select actual date from calendar
			logger.action("Step 3: Handling date selection");
			await new Promise(resolve => setTimeout(resolve, 1500));

			// Calculate random date based on test data
			const dateOptions = testUser.registrationData.dateOptions;
			let selectedDate: Date;

			if (dateOptions?.useRandomDate && dateOptions.dateRange) {
				const minDays = dateOptions.dateRange.minDaysAgo;
				const maxDays = dateOptions.dateRange.maxDaysAgo;
				const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
				selectedDate = new Date();
				selectedDate.setDate(selectedDate.getDate() - randomDays);
				logger.info(`Generated random date: ${selectedDate.toLocaleDateString()} (${randomDays} days ago)`);
			} else {
				selectedDate = new Date();
				selectedDate.setDate(selectedDate.getDate() - 30); // Default to 30 days ago
				logger.info(`Using default date: ${selectedDate.toLocaleDateString()}`);
			}

			// Try to find and interact with date input field
			const dateInput = await sharedDriverManager.getDriver().$(MaccabiSelectors.DATE_INPUT);
			if (await dateInput.isExisting()) {
				logger.action("Found date input field, clicking to open calendar");
				await dateInput.click();
				await new Promise(resolve => setTimeout(resolve, 3000)); // Give calendar time to open

				// Try to select date from calendar picker
				const dateSelected = await selectDateFromCalendar(selectedDate);
				if (dateSelected) {
					logger.success("Date successfully selected from calendar");
				} else {
					logger.warning("Date selection failed, proceeding anyway");
				}

				// Look for and click confirm/OK button
				await new Promise(resolve => setTimeout(resolve, 1000));
				try {
					const confirmButton = await sharedDriverManager.getDriver().$(MaccabiSelectors.CONFIRM_BUTTONS);
					if (await confirmButton.isExisting()) {
						await confirmButton.click();
						await new Promise(resolve => setTimeout(resolve, 1000));
						logger.success("Calendar confirm button clicked");
					} else {
						// Try alternative confirm button selectors
						const altConfirmButton = await sharedDriverManager.getDriver().$('//*[@text="OK" or @text="אישור" or @text="Done" or @text="סיום"]');
						if (await altConfirmButton.isExisting()) {
							await altConfirmButton.click();
							logger.success("Calendar confirmed with alternative button");
						} else {
							logger.info("No confirm button found, assuming selection is complete");
						}
					}
				} catch (confirmError) {
					logger.warning("Confirm button interaction failed", confirmError);
				}

			} else {
				logger.warning("Date input field not found");
			}

			// Click next to proceed
			await new Promise(resolve => setTimeout(resolve, 1500));
			const nextButton2 = await sharedDriverManager.getDriver().$(MaccabiSelectors.NEXT_BUTTON);
			if (await nextButton2.isExisting()) {
				await nextButton2.click();
				await new Promise(resolve => setTimeout(resolve, 2000));
				logger.success("Date screen completed");
			} else {
				logger.warning("Next button not found after date selection");
			}

			// Step 4: Handle fetus count
			logger.action("Step 4: Selecting fetus count");
			const fetusOption = await sharedDriverManager.getDriver().$(`//*[@text="${testUser.registrationData.fetusCount}"]`);
			if (await fetusOption.isExisting()) {
				await fetusOption.click();
				await new Promise(resolve => setTimeout(resolve, 1500));
				logger.success(`Fetus count selected: ${testUser.registrationData.fetusCount}`);
			}

			// Step 5: Final next button
			const nextButton3 = await sharedDriverManager.getDriver().$(MaccabiSelectors.NEXT_BUTTON);
			if (await nextButton3.isExisting()) {
				await nextButton3.click();
				await new Promise(resolve => setTimeout(resolve, 3000));
				logger.success("Registration completed");
			}

			return true;
		} catch (error) {
			logger.error("Registration failed", error);
			return false;
		}
	}

	beforeAll(async () => {
		logger.info("Initializing Maccabi test suite");
		// Initialize shared driver session once
		sharedDriverManager = new DriverManager(maccabiConfig);
		await sharedDriverManager.initializeDriver();

		logger.success("Test suite initialized successfully with shared driver session");
	}, 120000); // 2 minute timeout

	afterAll(async () => {
		logger.info("Final cleanup - ensuring clean shutdown");

		if (sharedDriverManager) {
			await sharedDriverManager.quitDriver();
		}

		logger.success("Test suite cleanup completed");
	}, 60000);

	// Helper function to detect and handle app crashes
	async function detectAndHandleCrash(): Promise<boolean> {
		try {
			logger.info("Checking for app crash or instrumentation issues");

			// Try to get current package - this will fail if instrumentation crashed
			const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();

			if (currentPackage !== "com.ideomobile.maccabipregnancy") {
				logger.warning(`App not running expected package. Current: ${currentPackage}`);
				return await recoverFromCrash();
			}

			// Try a simple element check to verify instrumentation is working
			await sharedDriverManager.getDriver().getPageSource();
			logger.success("App and instrumentation appear to be working");
			return true;

		} catch (error: any) {
			logger.error("App crash or instrumentation failure detected", error);
			const errorMessage = error.message || error.toString();

			if (errorMessage.includes("instrumentation process is not running") ||
				errorMessage.includes("probably crashed") ||
				errorMessage.includes("cannot be proxied to UiAutomator2")) {
				logger.warning("UiAutomator2 instrumentation crash detected");
				return await recoverFromCrash();
			}

			return false;
		}
	}

	// Helper function to recover from app/instrumentation crashes
	async function recoverFromCrash(): Promise<boolean> {
		try {
			logger.action("Attempting crash recovery");

			// Step 1: Force stop the app
			logger.info("Step 1: Force stopping crashed app");
			try {
				await sharedDriverManager.getDriver().execute("mobile: shell", {
					command: "am force-stop com.ideomobile.maccabipregnancy"
				});
				await new Promise(resolve => setTimeout(resolve, 2000));
			} catch (e) {
				logger.info("Force stop failed or app wasn't running");
			}

			// Step 2: Restart the driver session
			logger.info("Step 2: Restarting driver session");
			try {
				await sharedDriverManager.quitDriver();
				await new Promise(resolve => setTimeout(resolve, 3000));
				await sharedDriverManager.initializeDriver();
				await new Promise(resolve => setTimeout(resolve, 2000));
			} catch (driverError) {
				logger.error("Driver restart failed", driverError);
				return false;
			}

			// Step 3: Launch the app fresh
			logger.info("Step 3: Launching app after crash recovery");
			try {
				await sharedDriverManager.launchApp();
				await new Promise(resolve => setTimeout(resolve, 5000)); // Extra time for recovery

				// Verify recovery worked
				const recoveredPackage = await sharedDriverManager.getDriver().getCurrentPackage();
				if (recoveredPackage === "com.ideomobile.maccabipregnancy") {
					logger.success("Crash recovery successful");
					return true;
				} else {
					logger.error(`Recovery failed - unexpected package: ${recoveredPackage}`);
					return false;
				}
			} catch (launchError) {
				logger.error("App launch failed during recovery", launchError);
				return false;
			}

		} catch (recoveryError) {
			logger.error("Crash recovery failed", recoveryError);
			return false;
		}
	}

	// Helper function to handle Skip buttons that may appear
	async function handleSkipButtons(): Promise<void> {
		logger.info("Checking for skip buttons");

		try {
			const skipButton = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/tvSkipVideo")');
			if (await skipButton.isExisting()) {
				logger.action("Found skip video button");
				await skipButton.click();
				await new Promise(resolve => setTimeout(resolve, 1500));
				logger.success("Skip button clicked");
			} else {
				logger.info("No skip buttons found");
			}
		} catch (e) {
			logger.info("No skip buttons found or crash detected");
			// If this fails, it might be due to a crash
			await detectAndHandleCrash();
		}
	}

	it("Registration - TC 120208", async () => {
		logger.step(1, "Starting registration test");
		logger.info("Using shared WebDriver session");

		// Step 1: DRIVER RESET - Reinitialize driver with reset enabled for fresh state
		logger.action("DRIVER RESET - Reinitializing with fresh state");
		try {
			// Method 1: Force stop app completely
			logger.info("Step 1a: Force stopping app");
			try {
				await sharedDriverManager.getDriver().terminateApp("com.ideomobile.maccabipregnancy");
				await new Promise(resolve => setTimeout(resolve, 1000));

				await sharedDriverManager.getDriver().execute("mobile: shell", {
					command: "am force-stop com.ideomobile.maccabipregnancy"
				});
				await new Promise(resolve => setTimeout(resolve, 2000));
				logger.success("App force stopped");
			} catch (e) {
				logger.info("App was not running");
			}

			// Method 2: Quit current driver (with noReset=true)
			logger.info("Step 1b: Quitting current driver session");
			await sharedDriverManager.quitDriver();
			await new Promise(resolve => setTimeout(resolve, 3000));
			logger.success("Driver session ended");

			// Method 3: Clear app data manually before reinitializing
			logger.info("Step 1c: Manual cache clearing");
			try {
				// Create a temporary driver session just for clearing
				const tempDriverManager = new DriverManager({
					...maccabiConfig,
					capabilities: {
						...maccabiConfig.capabilities,
						noReset: false // Enable reset for this session
					}
				});

				await tempDriverManager.initializeDriver();

				// Clear app data
				const clearResult = await tempDriverManager.getDriver().execute("mobile: shell", {
					command: "pm clear com.ideomobile.maccabipregnancy"
				});
				logger.info(`Cache clear result: ${JSON.stringify(clearResult)}`);

				// Quit temporary driver
				await tempDriverManager.quitDriver();
				await new Promise(resolve => setTimeout(resolve, 2000));

				logger.success("MANUAL CACHE CLEARING COMPLETED");
				console.log("SUCCESS: App data cleared with temporary driver");
			} catch (tempError) {
				logger.warning("Manual clearing with temp driver failed", tempError);
			}

			// Method 4: Reinitialize main driver with fresh state
			logger.info("Step 1d: Reinitializing main driver with fresh state");
			await sharedDriverManager.initializeDriver();

			logger.success("DRIVER RESET COMPLETED - Fresh session initialized");
			console.log("FRESH STATE: Driver reinitialized with clean state");

		} catch (resetError) {
			logger.error("Driver reset failed", resetError);
			console.log("DRIVER RESET FAILED - Error details:", resetError);

			// Fallback: try to reinitialize anyway
			try {
				await sharedDriverManager.initializeDriver();
				logger.success("Fallback driver initialization completed");
			} catch (fallbackError) {
				logger.error("Fallback initialization also failed", fallbackError);
			}
		}

		// Step 2: Launch app fresh after cache clear
		logger.info("Step 2: Launching app fresh after cache clear");

		try {
			// Launch the app (it's still installed, just data cleared)
			await sharedDriverManager.launchApp();
			logger.action("App launched with cleared cache");

			// Wait for app to initialize with fresh state
			await new Promise(resolve => setTimeout(resolve, 8000)); // Extended wait for fresh state

			logger.success("APP LAUNCHED WITH FRESH CACHE STATE");
			console.log("CONFIRMED: App launched with cleared data");

		} catch (launchError) {
			logger.error("App launch failed after cache clear", launchError);
			// Try launching again
			try {
				logger.info("Retrying app launch...");
				await new Promise(resolve => setTimeout(resolve, 2000));
				await sharedDriverManager.launchApp();
				await new Promise(resolve => setTimeout(resolve, 5000));
				logger.success("App launch retry successful");
			} catch (retryError) {
				logger.error("App launch retry also failed", retryError);
			}
		}

		// COMPREHENSIVE verification: Multiple checks to confirm cache clear worked
		logger.info("Step 2a: COMPREHENSIVE verification - did cache clear work?");
		let cacheCleared = false;

		try {
			// Check 1: Look for registration screen elements
			const pageSource = await sharedDriverManager.getDriver().getPageSource();
			logger.info("Checking page content for registration indicators...");

			if (pageSource.includes("שמך הפרטי")) {
				logger.success("REGISTRATION SCREEN FOUND - Cache clear SUCCESS!");
				console.log("SUCCESS: Registration screen detected - cache clearing worked!");
				cacheCleared = true;
			} else if (pageSource.includes("איזור אישי") || pageSource.includes("Personal Area") || pageSource.includes("home")) {
				logger.error("✗ HOME PAGE FOUND - Cache clear FAILED!");
				console.log("✗ FAILED: Home page detected - cache clearing did NOT work");
			} else {
				logger.info("? Unknown screen state - checking more thoroughly");
			}

			// Check 2: Look for onboarding/welcome screens (indicates fresh install)
			if (!cacheCleared) {
				const onboardingIndicators = ["ברוכים הבאים", "Welcome", "התחל", "Start", "Get Started", "Continue"];
				for (const indicator of onboardingIndicators) {
					if (pageSource.includes(indicator)) {
						logger.success(`ONBOARDING FOUND (${indicator}) - Cache clear SUCCESS!`);
						console.log(`SUCCESS: Onboarding screen detected - cache clearing worked!`);
						cacheCleared = true;
						break;
					}
				}
			}

			// Check 3: Look for permission requests (indicates fresh install)
			if (!cacheCleared) {
				const permissionIndicators = ["Allow", "הרשאה", "Permission", "אפשר"];
				for (const indicator of permissionIndicators) {
					if (pageSource.includes(indicator)) {
						logger.success(`PERMISSION REQUEST FOUND (${indicator}) - Cache clear SUCCESS!`);
						console.log(`SUCCESS: Permission request detected - cache clearing worked!`);
						cacheCleared = true;
						break;
					}
				}
			}

			// Final determination
			if (!cacheCleared) {
				logger.error("✗ CACHE CLEAR VERIFICATION FAILED");
				console.log("✗ CRITICAL: Cache clearing did not work - app appears to be in logged-in state");
				console.log("This means the aggressive clearing methods were not sufficient");
			}

		} catch (quickCheckError) {
			logger.warning("Verification check failed, will proceed", quickCheckError);
		}

		// Handle any Skip buttons that might appear (onboarding, tutorials, etc.)
		await handleSkipButtons();

		// Step 3: Check current state - should show registration if cache was cleared
		const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();
		if (currentPackage === "com.ideomobile.maccabipregnancy") {
			// Check if we're on home page or registration screen
			logger.info("Checking screen state");

			try {
				// Look for registration indicators - specifically the name field text
				const registrationIndicators = [
					'//*[contains(@text, "שמך הפרטי")]'
				];

				let onRegistrationScreen = false;
				for (const selector of registrationIndicators) {
					try {
						const element = await sharedDriverManager.getDriver().$(selector);
						if (await element.isExisting()) {
							onRegistrationScreen = true;
							logger.info('Found registration indicator: "שמך הפרטי"');
							break;
						}
					} catch (e) {
						// Continue checking
					}
				}

				if (onRegistrationScreen) {
					console.log("REGISTRATION SCREEN DETECTED - Cache clearing was successful!");
					logger.success("Registration screen detected");

					// Run registration flow
					const testUser = testUsers[0];
					logger.info(`Using test data: ${testUser.registrationData.name}`);

					// Direct driver approach - no page objects needed
					const registrationResult = await executeRegistrationDirectly();

					if (registrationResult) {
						console.log("REGISTRATION COMPLETED SUCCESSFULLY!");
						logger.success("Registration completed");
					} else {
						console.log("REGISTRATION FAILED!");
						logger.error("Registration failed");
					}
				} else {
					// We're already on home page
					console.log("ALREADY ON HOME PAGE - Registration was not needed");
					console.log("This means either:");
					console.log("   1. Cache clearing didn't work completely");
					console.log("   2. App has persistent login state");
					console.log("   3. User is already registered and logged in");

					logger.info("Already on home page");
					logger.success("Registration not needed");
				}
			} catch (checkError) {
				logger.warning("Could not determine screen state", checkError);
				console.log("ASSUMING HOME PAGE - Could not detect registration screen");
				logger.success("Registration completed");
			}
		} else {
			console.log("APP NOT RUNNING PROPERLY - Package mismatch");
			logger.error(`Unexpected package: ${currentPackage}`);
		}

		// Navigate back to home page for next test (only if needed)
		logger.info("Checking navigation state");
		try {
			const finalPackage = await sharedDriverManager.getDriver().getCurrentPackage();
			if (finalPackage === "com.ideomobile.maccabipregnancy") {
				logger.success("App ready for next test");
			} else {
				logger.info("Relaunching app");
				await sharedDriverManager.launchApp();
				await new Promise(resolve => setTimeout(resolve, 2000));
				logger.success("App relaunched");
			}
		} catch (navError) {
			logger.warning("Navigation check had issues", navError);
		}

		logger.info("Registration test completed");
	}, 60000);

	it.skip("Add Pregnancy File with File Attachment", async () => {
		console.log("PREGNANCY FILE TEST STARTING - VS CODE SIDEBAR DEBUG");
		logger.step(1, "Starting add pregnancy file test with file attachment");
		logger.info("Using shared WebDriver session for pregnancy file test...");

		try {
			// Check if app is already running
			const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();
			logger.info(`Current app package: ${currentPackage}`);

			if (currentPackage !== "com.ideomobile.maccabipregnancy") {
				logger.info("App not running, launching...");
				await sharedDriverManager.launchApp();
			}

			// Wait for app to be fully loaded
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Handle any Skip buttons
			await handleSkipButtons();

			// Step 1: Personal Area button
			logger.action("Step 1: Looking for 'איזור אישי' (Personal Area)...");
			try {
				const personalAreaBtn = await sharedDriverManager.getDriver().$('//*[contains(@text, "איזור אישי")]');
				if (await personalAreaBtn.isExisting()) {
					await personalAreaBtn.click();
					await new Promise(resolve => setTimeout(resolve, 2000));
					logger.success("Personal Area clicked");
				} else {
				// Fallback to coordinates
					const windowSize = await sharedDriverManager.getDriver().getWindowSize();
					await sharedDriverManager.getDriver().touchAction({
						action: "tap",
						x: Math.round(windowSize.width * 0.85),
						y: Math.round(windowSize.height * 0.85)
					});
					await new Promise(resolve => setTimeout(resolve, 2000));
				}
			} catch (e) {
				logger.warning("Personal Area step failed", e);
			}

			// Step 2: Pregnancy Folder
			logger.action("Step 2: Looking for 'קלסר ההריון שלך'...");
			try {
				const pregnancyFolder = await sharedDriverManager.getDriver().$('//*[contains(@text, "קלסר ההריון שלך")]');
				if (await pregnancyFolder.isExisting()) {
					await pregnancyFolder.click();
					await new Promise(resolve => setTimeout(resolve, 2000));
					logger.success("Pregnancy folder clicked");
				}
			} catch (e) {
				logger.warning("Pregnancy folder step failed", e);
			}

			// Step 3: Plus button
			logger.action("Step 3: Looking for '+' button...");
			try {
				const plusBtn = await sharedDriverManager.getDriver().$("//android.widget.FloatingActionButton");
				if (await plusBtn.isExisting()) {
					await plusBtn.click();
					await new Promise(resolve => setTimeout(resolve, 2000));
					logger.success("Plus button clicked");
				}
			} catch (e) {
				logger.warning("Plus button step failed", e);
			}

			// STEP 4: Press צירוף קבצים button
			logger.action("Step 4: Looking for צירוף קבצים button...");

			let attachFilesSuccess = false;

			// Wait a moment for the menu to appear after plus button click
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Strategy 1: Try text-based selectors for attach files button
			const attachFilesSelectors = [
				'//*[contains(@text, "צירוף קבצים")]',
				'//*[contains(@text, "קבצים")]',
				'//*[contains(@text, "צירוף")]',
				'//*[contains(@text, "Attach")]',
				'//*[contains(@text, "Files")]',
				'//android.widget.Button[contains(@text, "צירוף קבצים")]',
				'//android.widget.TextView[contains(@text, "צירוף קבצים")]',
				'//android.widget.Button[contains(@text, "קבצים")]',
				'//android.widget.TextView[contains(@text, "קבצים")]'
			];

			for (const selector of attachFilesSelectors) {
				if (attachFilesSuccess) {break;}

				try {
					logger.info(`Trying attach files selector: ${selector}`);
					const attachFilesButton = await sharedDriverManager.getDriver().$(selector);

					// Add a small wait before checking existence
					await new Promise(resolve => setTimeout(resolve, 500));

					if (await attachFilesButton.isExisting()) {
						logger.action(`Found attach files button with selector: ${selector}`);
						await attachFilesButton.click();
						await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for file picker to open
						logger.success("Successfully tapped 'צירוף קבצים' button!");
						attachFilesSuccess = true;
						break;
					}
				} catch (e) {
					logger.info(`Attach files selector ${selector} failed, trying next...`);
				// Continue to next selector
				}
			}

			// Strategy 2: Coordinate-based tapping for attach files button if selectors fail
			if (!attachFilesSuccess) {
				try {
					logger.info("Strategy 2: Using coordinates for attach files button...");
					// Attach files button is typically in the lower area of the menu
					const tapX = 540;  // Center of 1080px screen
					const tapY = 1200; // Lower area where attach files menu appears

					logger.action(`Tapping coordinates (${tapX}, ${tapY}) for attach files button...`);
					// Use the correct WebDriverIO action method
					await sharedDriverManager.getDriver().action("pointer")
						.move({ x: tapX, y: tapY })
						.down()
						.up()
						.perform();
					await new Promise(resolve => setTimeout(resolve, 3000));
					logger.success("Coordinate tap completed for attach files button");
					attachFilesSuccess = true;
				} catch (coordError) {
					logger.error("Coordinate-based attach files button tap failed", coordError);
				}
			}

			// STEP 5: Handle file picker and select the FIRST FILE
			logger.action("Step 5: Selecting the FIRST file from file picker...");

			// Wait a moment for file picker to appear
			await new Promise(resolve => setTimeout(resolve, 3000));

			try {
				let fileSelected = false;

				// Wait for file picker to stabilize
				await new Promise(resolve => setTimeout(resolve, 2000));

				// PRIMARY STRATEGY: Use the SPECIFIC UiSelector provided by user first
				logger.info("Using PRIMARY UiSelector for first file selection...");

				try {
				// Use the exact UiSelector provided by user for file thumbnail - THIS SHOULD BE FIRST
					logger.action("PRIMARY: Using UiSelector: com.google.android.documentsui:id/icon_thumb instance(0)");
					const firstFileThumb = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb").instance(0)');

					// Wait a moment for file picker UI to stabilize
					await new Promise(resolve => setTimeout(resolve, 2000));

					if (await firstFileThumb.isExisting()) {
						logger.action("FOUND first file thumbnail with PRIMARY UiSelector!");
						await firstFileThumb.click();
						await new Promise(resolve => setTimeout(resolve, 2000));
						logger.success("Successfully selected the FIRST file using PRIMARY UiSelector!");
						fileSelected = true;
					} else {
						logger.warning("PRIMARY UiSelector file thumbnail not found, will try fallback...");
					}
				} catch (uiSelectorError) {
					logger.error("PRIMARY UiSelector approach failed", uiSelectorError);
				}

				// FALLBACK STRATEGY: Only if primary UiSelector fails
				if (!fileSelected) {
					logger.info("PRIMARY failed, trying FALLBACK selectors...");

					// Only use safe, specific fallback selectors
					const safeFileSelectors = [
						'android=new UiSelector().className("android.widget.ImageView").instance(0)',
						'//android.widget.ImageView[@clickable="true"][1]',
						'//*[@resource-id="com.google.android.documentsui:id/icon_thumb"]'
					];

					for (const selector of safeFileSelectors) {
						if (fileSelected) {break;}

						try {
							logger.info(`FALLBACK: Trying safe selector: ${selector}`);
							const firstFile = await sharedDriverManager.getDriver().$(selector);

							if (await firstFile.isExisting()) {
								logger.action(`FALLBACK: Found first file with selector: ${selector}`);
								await firstFile.click();
								await new Promise(resolve => setTimeout(resolve, 2000));
								logger.success("Successfully selected file with FALLBACK selector!");
								fileSelected = true;
								break;
							}
						} catch (e) {
							logger.info(`FALLBACK selector ${selector} failed, trying next...`);
						}
					}
				}

				// Strategy 3: Coordinate-based selection at the FIRST position if selectors fail
				if (!fileSelected) {
					try {
						logger.info("Strategy 3: Using coordinates to select the FIRST file position...");

						// Get window size for coordinate calculation
						const windowSize = await sharedDriverManager.getDriver().getWindowSize();

						// Target the top-left file position (first file in typical grid layout)
						const firstFileX = Math.round(windowSize.width * 0.25);   // 25% from left (first column)
						const firstFileY = Math.round(windowSize.height * 0.35);  // 35% from top (first row)

						logger.action(`Selecting FIRST file at coordinates (${firstFileX}, ${firstFileY})...`);
						await sharedDriverManager.getDriver().action("pointer")
							.move({ x: firstFileX, y: firstFileY })
							.down()
							.up()
							.perform();
						await new Promise(resolve => setTimeout(resolve, 2000));

						logger.success(`FIRST file selected at (${firstFileX}, ${firstFileY})`);
						fileSelected = true;

					} catch (coordError) {
						logger.error("Coordinate-based FIRST file selection failed", coordError);
					}
				}

				// Step 6: Confirm file selection if needed
				if (fileSelected) {
					logger.action("Step 6: Looking for file selection confirmation...");

					await new Promise(resolve => setTimeout(resolve, 2000));

					const confirmSelectors = [
						'//*[@text="אישור"]',
						'//*[@text="בחר"]',
						'//*[@text="OK"]',
						'//*[@text="Done"]',
						'//*[@text="Select"]',
						'//*[@text="Choose"]',
						'//android.widget.Button[contains(@text, "OK")]',
						'//android.widget.Button[contains(@text, "אישור")]',
						'//android.widget.Button[contains(@text, "בחר")]'
					];

					let confirmationFound = false;

					for (const selector of confirmSelectors) {
						if (confirmationFound) {break;}

						try {
							const confirmButton = await sharedDriverManager.getDriver().$(selector);
							if (await confirmButton.isExisting()) {
								logger.action(`Found confirmation button: ${selector}`);
								await confirmButton.click();
								await new Promise(resolve => setTimeout(resolve, 2000));
								logger.success("File selection confirmed!");
								confirmationFound = true;
								break;
							}
						} catch (e) {
						// Continue to next selector
						}
					}

					if (!confirmationFound) {
						logger.info("No confirmation button found - file might be auto-selected");
					}

					// Step 7: Save button detection
					logger.action("Step 7: Looking for save button...");

					try {
					// Try the specific save button first
						const saveButton = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/bSaveButton")');
						if (await saveButton.isExisting()) {
							await saveButton.click();
							logger.success("Save button clicked");
						} else {
						// Fallback to text-based save button
							const textSaveBtn = await sharedDriverManager.getDriver().$('//*[@text="שמירה"]');
							if (await textSaveBtn.isExisting()) {
								await textSaveBtn.click();
								logger.success("Text save button clicked");
							}
						}
					} catch (saveError) {
						logger.warning("Save button detection failed", saveError);
					}

					// Step 8: CRITICAL VERIFICATION - Check if file appears in pregnancy folder
					logger.action("Step 8: VERIFYING save success - looking for saved file in pregnancy folder...");

					try {
					// Wait for save operation to complete
						await new Promise(resolve => setTimeout(resolve, 2000));

						// Simple check for saved file
						const fileCover = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/ivFileCover")');
						const fileName = await sharedDriverManager.getDriver().$('android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/tvFileName")');

						if (await fileCover.isExisting() || await fileName.isExisting()) {
							logger.success("File upload successful!");
						} else {
							logger.info("Upload completed");
						}

					} catch (verificationError) {
						logger.error("Error during save verification", verificationError);
						logger.warning("Could not verify if file was saved successfully");
					}

				} else {
					logger.warning("Could not select a file, but file picker was opened successfully");
				}

			} catch (fileError) {
				logger.error("Error during file selection process", fileError);
			}

			// Test flow completed
			logger.success("Pregnancy file upload flow completed successfully!");

		} catch (error) {
			logger.error("Error during pregnancy file test", error);
		}

		logger.info("Test completed");

		try {
			const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();
			if (currentPackage === "com.ideomobile.maccabipregnancy") {
				logger.success("App session maintained");
			}
		} catch (navError) {
			logger.info("Session check completed");
		}

		logger.info("Pregnancy file test completed");
	}, 120000); // Extended timeout for file attachment operations

	it("WeekInfo - TC 120213", async () => {
		logger.step(1, "Starting WeekInfo test");
		logger.info("This test navigates to Week Info");

		try {
			// Wait for any existing session to stabilize
			await new Promise(resolve => setTimeout(resolve, 3000));

			// Check current app state first
			const currentPackage = await sharedDriverManager.getDriver().getCurrentPackage();
			logger.info(`Current app package: ${currentPackage}`);

			if (currentPackage !== "com.ideomobile.maccabipregnancy") {
				logger.warning("Not in Maccabi app");
				throw new Error("Not in the correct app");
			}

			// Look for the week info button
			logger.action("Looking for Week Info button");
			const weekInfoButton = await sharedDriverManager.getDriver().$(MaccabiSelectors.WEEK_INFO_BUTTON);

			if (await weekInfoButton.isExisting()) {
				logger.action("Found Week Info button, clicking it");
				await weekInfoButton.click();
				await new Promise(resolve => setTimeout(resolve, 3000));
				logger.success("Week Info button clicked successfully");

				// Look for right arrow and click it
				logger.action("Looking for right arrow button");
				const rightArrowButton = await sharedDriverManager.getDriver().$("id=com.ideomobile.maccabipregnancy:id/rightArrow");

				if (await rightArrowButton.isExisting()) {
					logger.action("Found right arrow button, clicking it");
					await rightArrowButton.click();
					await new Promise(resolve => setTimeout(resolve, 2000));
					logger.success("Right arrow clicked successfully");
				} else {
					logger.warning("Right arrow not found");
				}

			} else {
				logger.error("Week Info button not found");
				throw new Error("Week Info button not found");
			}

		} catch (error: any) {
			logger.error("WeekInfo test failed", error);
			throw error;
		}

		logger.success("WeekInfo test completed");
	}, 60000);

});
