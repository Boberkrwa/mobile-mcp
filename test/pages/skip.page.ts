import { BasePage } from "./base.page";
import { DriverManager } from "../helpers/driver-manager";
import { MaccabiSelectors } from "../config/selectors";
import { appConstants } from "../data/test-data";

export class SkipPage extends BasePage {
	constructor(driverManager: DriverManager) {
		super(driverManager, "Skip");
	}

	async isPageLoaded(): Promise<boolean> {
		const skipButton = await this.findElementByText(MaccabiSelectors.SKIP_BUTTON_TEXT);
		return skipButton !== null;
	}

	async waitForPageToLoad(): Promise<void> {
		this.logger.info("Waiting for skip page to load...");
		await this.waitForPageLoad();
	}

	async findAndClickSkipButton(): Promise<boolean> {
		this.logger.info("Looking for skip button...");

		for (let attempt = 1; attempt <= appConstants.skipButtonMaxAttempts; attempt++) {
			this.logger.info(`Attempt ${attempt}: Looking for skip button...`);

			try {
				const elements = await this.driverManager.getDriver().$$(MaccabiSelectors.TEXT_VIEW);

				for (const element of elements) {
					try {
						const text = await element.getText();
						const contentDesc = await element.getAttribute("content-desc");

						this.logger.debug(`Found element: text="${text}", contentDesc="${contentDesc}"`);

						if (text === MaccabiSelectors.SKIP_BUTTON_TEXT || contentDesc === MaccabiSelectors.SKIP_BUTTON_TEXT) {
							this.logger.action("Found skip button - clicking it...");
							await element.click();
							await this.driverManager.pause(appConstants.longPauseTime);
							this.logger.success("Successfully clicked skip button");
							return true;
						}
					} catch (e) {
						// Continue to next element
					}
				}

				if (attempt < appConstants.skipButtonMaxAttempts) {
					await this.driverManager.pause(appConstants.defaultPauseTime);
				}
			} catch (error) {
				this.logger.error(`Error in attempt ${attempt}`, error);
				await this.driverManager.pause(appConstants.defaultPauseTime);
			}
		}

		this.logger.warning("Skip button not found - continuing anyway...");
		return false;
	}
}
