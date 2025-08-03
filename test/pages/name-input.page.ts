import { BasePage } from "./base.page";
import { DriverManager } from "../helpers/driver-manager";
import { MaccabiSelectors } from "../config/selectors";
import { appConstants } from "../data/test-data";

export class NameInputPage extends BasePage {
	constructor(driverManager: DriverManager) {
		super(driverManager, "NameInput");
	}

	async isPageLoaded(): Promise<boolean> {
		return await this.isElementPresent(MaccabiSelectors.NAME_INPUT);
	}

	async waitForPageToLoad(): Promise<void> {
		this.logger.info("Waiting for name input page to load...");
		await this.waitForPageLoad();
	}

	async enterName(name: string): Promise<boolean> {
		try {
			this.logger.info("Looking for name input field...");

			const nameInputExists = await this.isElementPresent(MaccabiSelectors.NAME_INPUT);

			if (nameInputExists) {
				this.logger.action("Found name input field - entering name...");
				await this.driverManager.enterText(MaccabiSelectors.NAME_INPUT, name);
				this.logger.success(`Name entered: ${name}`);
				return true;
			} else {
				this.logger.error("Name input field not found");
				return false;
			}
		} catch (error) {
			this.logger.error("Error with name input", error);
			return false;
		}
	}

	async clickContinue(): Promise<boolean> {
		try {
			this.logger.action("Clicking continue button...");
			await this.clickElementWithRetry(MaccabiSelectors.NEXT_BUTTON);
			await this.driverManager.pause(appConstants.longPauseTime);
			this.logger.success("Successfully clicked continue after name input");
			return true;
		} catch (error) {
			this.logger.error("Failed to click continue button", error);
			return false;
		}
	}

	async completeNameInput(name: string): Promise<boolean> {
		const nameEntered = await this.enterName(name);
		if (!nameEntered) {
			return false;
		}

		return await this.clickContinue();
	}
}
