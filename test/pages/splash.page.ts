import { BasePage } from "./base.page";
import { DriverManager } from "../helpers/driver-manager";
import { MaccabiSelectors } from "../config/selectors";
import { appConstants } from "../data/test-data";

export class SplashPage extends BasePage {
	constructor(driverManager: DriverManager) {
		super(driverManager, "Splash");
	}

	async isPageLoaded(): Promise<boolean> {
		// Splash page is loaded when there are TextView elements present
		const elements = await this.driverManager.getDriver().$$(MaccabiSelectors.TEXT_VIEW);
		return elements.length > 0;
	}

	async waitForPageToLoad(): Promise<void> {
		this.logger.info("Waiting for splash screen to appear...");
		await this.waitForPageLoad();
	}

	async waitForSplashToDisappear(): Promise<boolean> {
		this.logger.info("Waiting for splash screen to disappear...");

		for (let attempt = 1; attempt <= appConstants.splashScreenMaxAttempts; attempt++) {
			this.logger.info(`Checking for splash screen... attempt ${attempt}`);

			try {
				const textElements = await this.driverManager.getDriver().$$(MaccabiSelectors.TEXT_VIEW);

				if (textElements.length === 0) {
					this.logger.success("Splash screen disappeared");
					return true;
				}

				await this.driverManager.pause(appConstants.defaultPauseTime);
			} catch (error) {
				this.logger.error("Error checking splash screen", error);
				break;
			}
		}

		this.logger.warning("Splash screen did not disappear within expected time");
		return false;
	}
}
