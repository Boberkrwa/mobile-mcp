import { remote } from "webdriverio";
import { AppConfig } from "../config/app.config";
import { Logger } from "../utils/logger";

export class DriverManager {
	private driver: any;
	private config: AppConfig;
	private logger: Logger;

	constructor(config: AppConfig) {
		this.config = config;
		this.logger = new Logger("DriverManager");
	}

	async initializeDriver(): Promise<any> {
		try {
			this.logger.info("Initializing WebDriver...");

			this.driver = await remote({
				hostname: this.config.appiumServer.hostname,
				port: this.config.appiumServer.port,
				path: this.config.appiumServer.path,
				logLevel: "info",
				capabilities: {
					"platformName": this.config.capabilities.platformName,
					"appium:deviceName": this.config.deviceId,
					"appium:udid": this.config.deviceId,
					"appium:appPackage": this.config.appPackage,
					"appium:appActivity": this.config.appActivity,
					"appium:automationName": this.config.capabilities.automationName,
					"appium:noReset": this.config.capabilities.noReset
				}
			});

			// Set timeouts (only implicit for mobile)
			await this.driver.setTimeout({
				"implicit": this.config.timeouts.implicit
			});

			this.logger.info("WebDriver initialized successfully");
			return this.driver;
		} catch (error) {
			this.logger.error("Failed to initialize WebDriver", error);
			throw error;
		}
	}

	// Added check to verify if the app is already running before activation or starting activity
	async launchApp(): Promise<void> {
		try {
			this.logger.info(`Launching app: ${this.config.appPackage}`);

			// Check if the app is already running
			const currentPackage = await this.driver.getCurrentPackage();
			if (currentPackage === this.config.appPackage) {
				this.logger.info("App is already running, skipping launch.");
				return;
			}

			// First try to activate the app if it's already installed
			try {
				await this.driver.activateApp(this.config.appPackage);
				this.logger.info("App activated successfully");
			} catch (activateError) {
				// If activate fails, try starting the activity
				this.logger.info("Activate failed, trying startActivity...");
				await this.driver.startActivity(this.config.appPackage, this.config.appActivity);
				this.logger.info("App started successfully");
			}

			await this.driver.pause(3000);
			this.logger.info("App launched successfully");
		} catch (error) {
			this.logger.error("Failed to launch app", error);
			throw error;
		}
	}

	async quitDriver(): Promise<void> {
		try {
			if (this.driver) {
				this.logger.info("Closing WebDriver session...");
				await this.driver.deleteSession();
				this.logger.info("WebDriver session closed");
			}
		} catch (error) {
			this.logger.error("Error while closing WebDriver", error);
		}
	}

	getDriver(): any {
		if (!this.driver) {
			throw new Error("Driver not initialized. Call initializeDriver() first.");
		}
		return this.driver;
	}

	async waitForElement(selector: string, timeout: number = this.config.timeouts.explicit): Promise<any> {
		try {
			const element = await this.driver.$(selector);
			await element.waitForExist({ timeout });
			return element;
		} catch (error) {
			this.logger.error(`Element not found: ${selector}`, error);
			throw error;
		}
	}

	async waitForElements(selector: string, timeout: number = this.config.timeouts.explicit): Promise<any[]> {
		try {
			const elements = await this.driver.$$(selector);
			if (elements.length === 0) {
				throw new Error(`No elements found for selector: ${selector}`);
			}
			return elements;
		} catch (error) {
			this.logger.error(`Elements not found: ${selector}`, error);
			throw error;
		}
	}

	async clickElement(selector: string): Promise<void> {
		try {
			const element = await this.waitForElement(selector);
			await element.click();
			this.logger.info(`Clicked element: ${selector}`);
		} catch (error) {
			this.logger.error(`Failed to click element: ${selector}`, error);
			throw error;
		}
	}

	async enterText(selector: string, text: string, clearFirst: boolean = true): Promise<void> {
		try {
			const element = await this.waitForElement(selector);
			if (clearFirst) {
				await element.clearValue();
			}
			await element.setValue(text);
			this.logger.info(`Entered text '${text}' in element: ${selector}`);
		} catch (error) {
			this.logger.error(`Failed to enter text in element: ${selector}`, error);
			throw error;
		}
	}

	async pause(milliseconds: number): Promise<void> {
		await this.driver.pause(milliseconds);
	}

	async pressBackButton(): Promise<void> {
		try {
			await this.driver.pressKeyCode(4); // Android back button
			this.logger.info("Pressed Android back button");
		} catch (error) {
			this.logger.error("Failed to press back button", error);
			throw error;
		}
	}

	async getCurrentPackage(): Promise<string> {
		try {
			return await this.driver.getCurrentPackage();
		} catch (error) {
			this.logger.error("Failed to get current package", error);
			throw error;
		}
	}
}
