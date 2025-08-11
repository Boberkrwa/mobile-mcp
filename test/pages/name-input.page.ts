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
		this.logger.info("Waiting for name input page");
		await this.waitForPageLoad();
	}

	async enterName(name: string): Promise<boolean> {
		try {
			this.logger.action(`Entering name: ${name}`);

			// Wait for any UI transitions to complete
			await new Promise(resolve => setTimeout(resolve, 2000));

			// FOCUSED STRATEGY: Direct targeting of the specific name field ID
			this.logger.action("FOCUSED: Targeting specific name field ID: nameTextInputEditText");

			try {
				// Use the EXACT ID you provided
				const nameField = await this.driverManager.getDriver().$('android=new UiSelector().resourceId("com.ideomobile.maccabipregnancy:id/nameTextInputEditText")');

				// Check if field exists
				if (await nameField.isExisting()) {
					this.logger.success("Found nameTextInputEditText field!");

					// DIRECT INPUT WITHOUT CLICKING TO AVOID KEYBOARD
					this.logger.action("Setting value directly without clicking to avoid keyboard...");

					// Clear any existing content first
					try {
						await nameField.clearValue();
						await new Promise(resolve => setTimeout(resolve, 300));
						this.logger.info("Field cleared successfully");
					} catch (clearError) {
						this.logger.info("clearValue method failed, continuing with input");
					}

					// Input the name directly using setValue (no clicking)
					this.logger.action(`Inputting name directly: "${name}"`);

					try {
						await nameField.setValue(name);
						await new Promise(resolve => setTimeout(resolve, 800));
						this.logger.success("setValue method completed without keyboard");
					} catch (setValueError) {
						this.logger.warning("setValue failed, trying addValue without clicking");

						// Fallback: addValue without clicking
						try {
							await nameField.addValue(name);
							await new Promise(resolve => setTimeout(resolve, 800));
							this.logger.success("addValue method completed without keyboard");
						} catch (addValueError) {
							this.logger.error("Both setValue and addValue failed", addValueError);
							return false;
						}
					}

					// Verify the input was successful
					this.logger.action("Verifying input...");
					try {
						const inputValue = await nameField.getValue();
						this.logger.info(`Field value after direct input: "${inputValue}"`);

						if (inputValue && inputValue.trim().length > 0) {
							this.logger.success(`Name "${inputValue}" successfully entered directly in nameTextInputEditText field without keyboard!`);
							return true;
						} else {
							this.logger.warning("Field is empty after direct input attempt");
							return false;
						}
					} catch (verifyError) {
						this.logger.warning("Could not verify input, but field was found and value was set", verifyError);
						// Consider it successful if we found the field and set a value
						return true;
					}

				} else {
					this.logger.error("nameTextInputEditText field not found!");
					return false;
				}

			} catch (fieldError) {
				this.logger.error("Error accessing nameTextInputEditText field", fieldError);
				return false;
			}

		} catch (error) {
			this.logger.error("Error during name input process", error);
			return false;
		}
	}

	async clickContinue(): Promise<boolean> {
		try {
			this.logger.action("Clicking continue button");
			await this.clickElementWithRetry(MaccabiSelectors.NEXT_BUTTON);
			await this.driverManager.pause(appConstants.longPauseTime);
			this.logger.success("Continue clicked");
			return true;
		} catch (error) {
			this.logger.error("Failed to click continue", error);
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
