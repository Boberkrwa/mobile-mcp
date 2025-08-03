import { DriverManager } from '../helpers/driver-manager';
import { Logger } from '../utils/logger';
import { appConstants } from '../data/test-data';

export abstract class BasePage {
    protected driverManager: DriverManager;
    protected logger: Logger;
    protected pageName: string;

    constructor(driverManager: DriverManager, pageName: string) {
        this.driverManager = driverManager;
        this.pageName = pageName;
        this.logger = new Logger(`${pageName}Page`);
    }

    protected async waitForPageLoad(): Promise<void> {
        this.logger.info(`Waiting for ${this.pageName} page to load...`);
        await this.driverManager.pause(appConstants.defaultPauseTime);
    }

    protected async isElementPresent(selector: string): Promise<boolean> {
        try {
            const element = await this.driverManager.getDriver().$(selector);
            return await element.isExisting();
        } catch (error) {
            this.logger.debug(`Element not present: ${selector}`);
            return false;
        }
    }

    protected async isElementClickable(selector: string): Promise<boolean> {
        try {
            const element = await this.driverManager.getDriver().$(selector);
            if (await element.isExisting()) {
                return await element.isClickable();
            }
            return false;
        } catch (error) {
            this.logger.debug(`Element not clickable: ${selector}`);
            return false;
        }
    }

    protected async getElementText(selector: string): Promise<string> {
        try {
            const element = await this.driverManager.waitForElement(selector);
            return await element.getText();
        } catch (error) {
            this.logger.error(`Failed to get text from element: ${selector}`, error);
            throw error;
        }
    }

    protected async clickElementWithRetry(selector: string, maxRetries: number = 3): Promise<void> {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await this.driverManager.clickElement(selector);
                this.logger.success(`Successfully clicked element: ${selector}`);
                return;
            } catch (error) {
                this.logger.warning(`Click attempt ${attempt} failed for element: ${selector}`);
                if (attempt === maxRetries) {
                    throw error;
                }
                await this.driverManager.pause(1000);
            }
        }
    }

    protected async findElementByText(text: string, elementType: string = 'TextView'): Promise<any | null> {
        try {
            const elements = await this.driverManager.getDriver().$$(`//*[contains(@class, "android.widget.${elementType}")]`);
            
            for (const element of elements) {
                try {
                    const elementText = await element.getText();
                    if (elementText === text) {
                        return element;
                    }
                } catch (e) {
                    // Continue to next element
                }
            }
            return null;
        } catch (error) {
            this.logger.error(`Failed to find element by text: ${text}`, error);
            return null;
        }
    }

    protected async analyzeScreenElements(maxElements: number = 10): Promise<void> {
        try {
            this.logger.info(`Analyzing ${this.pageName} screen elements...`);
            const elements = await this.driverManager.getDriver().$$(`//*[contains(@class, "android.widget.EditText") or contains(@class, "android.widget.Button") or contains(@class, "android.widget.TextView")]`);
            
            this.logger.info(`Found ${elements.length} elements on ${this.pageName} screen`);
            
            for (let i = 0; i < Math.min(elements.length, maxElements); i++) {
                try {
                    const text = await elements[i].getText();
                    const resourceId = await elements[i].getAttribute('resource-id');
                    const contentDesc = await elements[i].getAttribute('content-desc');
                    
                    this.logger.debug(`Element ${i + 1}: Text="${text}" | ID="${resourceId}" | Desc="${contentDesc}"`);
                } catch (e) {
                    this.logger.debug(`Element ${i + 1}: Could not read element details`);
                }
            }
        } catch (error) {
            this.logger.error(`Failed to analyze screen elements`, error);
        }
    }

    abstract isPageLoaded(): Promise<boolean>;
    abstract waitForPageToLoad(): Promise<void>;
}
