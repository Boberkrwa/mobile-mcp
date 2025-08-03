import { BasePage } from "./base.page";
import { DriverManager } from "../helpers/driver-manager";
import { MaccabiSelectors } from "../config/selectors";

export class DashboardPage extends BasePage {
	constructor(driverManager: DriverManager) {
		super(driverManager, "Dashboard");
	}

	async isPageLoaded(): Promise<boolean> {
		// Dashboard is loaded when we see pregnancy-related elements
		const dashboardElements = [
			MaccabiSelectors.WEEKS_COUNTER,
			MaccabiSelectors.WEEK_INFO_BUTTON,
			MaccabiSelectors.ALL_TESTS_TEXT
		];

		for (const selector of dashboardElements) {
			if (await this.isElementPresent(selector)) {
				return true;
			}
		}
		return false;
	}

	async waitForPageToLoad(): Promise<void> {
		this.logger.info("Waiting for dashboard page to load...");
		await this.waitForPageLoad();
	}

	async getPregnancyStage(): Promise<string> {
		try {
			const weeksElement = await this.driverManager.getDriver().$(MaccabiSelectors.WEEKS_COUNTER);
			if (await weeksElement.isExisting()) {
				const stageText = await weeksElement.getText();
				this.logger.info(`Current pregnancy stage: ${stageText}`);
				return stageText;
			}
			return "";
		} catch (error) {
			this.logger.error("Failed to get pregnancy stage", error);
			return "";
		}
	}

	async getRecommendedTests(): Promise<string[]> {
		try {
			const tests: string[] = [];
			const testElements = await this.driverManager.getDriver().$$(MaccabiSelectors.TEST_NAME_TEXT);

			for (const element of testElements) {
				try {
					const testName = await element.getText();
					if (testName.trim()) {
						tests.push(testName);
					}
				} catch (e) {
					continue;
				}
			}

			this.logger.info(`Found ${tests.length} recommended tests`);
			return tests;
		} catch (error) {
			this.logger.error("Failed to get recommended tests", error);
			return [];
		}
	}

	async analyzeDashboard(): Promise<{
        pregnancyStage: string;
        recommendedTests: string[];
        elementsCount: number;
    }> {
		this.logger.info("Analyzing dashboard content...");

		const pregnancyStage = await this.getPregnancyStage();
		const recommendedTests = await this.getRecommendedTests();

		// Analyze all elements on the dashboard
		await this.analyzeScreenElements(6);

		const elements = await this.driverManager.getDriver().$$(MaccabiSelectors.ALL_INTERACTIVE_ELEMENTS);
		const elementsCount = elements.length;

		this.logger.success(`Dashboard analysis complete: Stage="${pregnancyStage}", Tests=${recommendedTests.length}, Elements=${elementsCount}`);

		return {
			pregnancyStage,
			recommendedTests,
			elementsCount
		};
	}

	async verifySuccessfulRegistration(): Promise<boolean> {
		try {
			this.logger.info("Verifying successful registration...");

			const dashboardData = await this.analyzeDashboard();

			// Check if we have essential dashboard elements
			const hasPregnancyStage = dashboardData.pregnancyStage.length > 0;
			const hasDashboardElements = dashboardData.elementsCount > 5;

			const isSuccessful = hasPregnancyStage && hasDashboardElements;

			if (isSuccessful) {
				this.logger.success("✅ Registration completed successfully - reached main dashboard!");
			} else {
				this.logger.error("❌ Registration verification failed");
			}

			return isSuccessful;
		} catch (error) {
			this.logger.error("Error verifying registration", error);
			return false;
		}
	}
}
