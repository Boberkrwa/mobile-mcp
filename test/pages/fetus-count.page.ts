import { BasePage } from "./base.page";
import { DriverManager } from "../helpers/driver-manager";
import { MaccabiSelectors } from "../config/selectors";
import { appConstants } from "../data/test-data";

export class FetusCountPage extends BasePage {
	constructor(driverManager: DriverManager) {
		super(driverManager, "FetusCount");
	}

	async isPageLoaded(): Promise<boolean> {
		try {
			const titleElement = await this.driverManager.getDriver().$(MaccabiSelectors.TITLE);
			if (await titleElement.isExisting()) {
				const titleText = await titleElement.getText();
				return titleText.includes(MaccabiSelectors.FETUS_TITLE_TEXT);
			}
			return false;
		} catch (error) {
			return false;
		}
	}

	async waitForPageToLoad(): Promise<void> {
		this.logger.info("Waiting for fetus count page to load...");
		await this.waitForPageLoad();
	}

	async getPageTitle(): Promise<string> {
		try {
			const titleElement = await this.driverManager.waitForElement(MaccabiSelectors.TITLE);
			const titleText = await titleElement.getText();
			this.logger.info(`Screen title: ${titleText}`);
			return titleText;
		} catch (error) {
			this.logger.error("Failed to get page title", error);
			return "";
		}
	}

	async selectFetusCount(count: number): Promise<boolean> {
		try {
			this.logger.info("Looking for fetus count selection...");

			const titleText = await this.getPageTitle();

			if (titleText.includes(MaccabiSelectors.FETUS_TITLE_TEXT) || titleText.includes("fetus")) {
				this.logger.success("Found fetus selection screen");

				// Look for number options (1, 2, 3)
				const numberElements = await this.driverManager.getDriver().$$(MaccabiSelectors.FETUS_COUNT_OPTIONS);

				if (numberElements.length > 0) {
					this.logger.info(`Found ${numberElements.length} fetus count options`);

					// Find the element with the desired count
					for (const element of numberElements) {
						try {
							const text = await element.getText();
							const optionNumber = parseInt(text, 10);

							if (optionNumber === count) {
								this.logger.action(`Selecting ${count} fetus(es)`);
								await element.click();
								await this.driverManager.pause(appConstants.defaultPauseTime);
								this.logger.success(`Selected ${count} fetus count`);
								return true;
							}
						} catch (e) {
							continue;
						}
					}

					// If specific count not found, select the first option as fallback
					this.logger.warning(`Count ${count} not found, selecting first available option`);
					const firstOption = numberElements[0];
					const optionText = await firstOption.getText();

					this.logger.action(`Selecting ${optionText} fetus(es) as fallback`);
					await firstOption.click();
					await this.driverManager.pause(appConstants.defaultPauseTime);
					this.logger.success(`Selected ${optionText} fetus count`);
					return true;
				} else {
					this.logger.error("No fetus count options found");
					return false;
				}
			} else {
				this.logger.info("Not on fetus selection screen, skipping...");
				return false;
			}
		} catch (error) {
			this.logger.error("Error with fetus selection", error);
			return false;
		}
	}

	async clickContinue(): Promise<boolean> {
		try {
			this.logger.action("Clicking continue after fetus selection...");

			const continueExists = await this.isElementPresent(MaccabiSelectors.NEXT_BUTTON);

			if (continueExists) {
				await this.clickElementWithRetry(MaccabiSelectors.NEXT_BUTTON);
				await this.driverManager.pause(appConstants.longPauseTime);
				this.logger.success("Successfully clicked continue after fetus selection");
				return true;
			} else {
				this.logger.error("Continue button not found after fetus selection");
				return false;
			}
		} catch (error) {
			this.logger.error("Failed to click continue button", error);
			return false;
		}
	}

	async completeFetusSelection(count: number): Promise<boolean> {
		const fetusSelected = await this.selectFetusCount(count);
		if (!fetusSelected) {
			return false;
		}

		return await this.clickContinue();
	}
}
