import { BasePage } from './base.page';
import { DriverManager } from '../helpers/driver-manager';
import { MaccabiSelectors } from '../config/selectors';
import { appConstants } from '../data/test-data';

export class DateInputPage extends BasePage {
    constructor(driverManager: DriverManager) {
        super(driverManager, 'DateInput');
    }

    async isPageLoaded(): Promise<boolean> {
        return await this.isElementPresent(MaccabiSelectors.DATE_INPUT);
    }

    async waitForPageToLoad(): Promise<void> {
        this.logger.info('Waiting for date input page to load...');
        await this.waitForPageLoad();
    }

    async openDatePicker(): Promise<boolean> {
        try {
            this.logger.info('Looking for date input field...');
            
            const dateInputExists = await this.isElementPresent(MaccabiSelectors.DATE_INPUT);
            
            if (dateInputExists) {
                this.logger.action('Found date input - clicking to open date picker...');
                await this.driverManager.clickElement(MaccabiSelectors.DATE_INPUT);
                await this.driverManager.pause(appConstants.longPauseTime);
                this.logger.success('Date picker opened');
                return true;
            } else {
                this.logger.error('Date input field not found');
                return false;
            }
        } catch (error) {
            this.logger.error('Error opening date picker', error);
            return false;
        }
    }

    async analyzeDatePickerInterface(): Promise<void> {
        this.logger.info('Analyzing date picker interface...');
        
        try {
            // Strategy 1: Look for any clickable elements
            const allClickableElements = await this.driverManager.getDriver().$$(MaccabiSelectors.CLICKABLE_ELEMENTS);
            this.logger.info(`Found ${allClickableElements.length} total clickable elements`);
            
            // Strategy 2: Look for specific date picker patterns
            const datePickerElements = await this.driverManager.getDriver().$$(MaccabiSelectors.DATE_PICKER_ELEMENTS);
            this.logger.info(`Found ${datePickerElements.length} date picker specific elements`);
            
            // Strategy 3: Look for TextView elements
            const textViewElements = await this.driverManager.getDriver().$$(MaccabiSelectors.TEXT_VIEW);
            this.logger.info(`Found ${textViewElements.length} TextView elements`);
            
            // Log sample text content
            for (let i = 0; i < Math.min(textViewElements.length, 3); i++) {
                try {
                    const text = await textViewElements[i].getText();
                    this.logger.debug(`TextView ${i + 1}: "${text}"`);
                } catch (e) {
                    // Continue
                }
            }
        } catch (error) {
            this.logger.error('Error analyzing date picker interface', error);
        }
    }

    async selectAvailableDate(): Promise<boolean> {
        try {
            this.logger.info('Looking for available dates...');
            
            const numberElements = await this.driverManager.getDriver().$$(MaccabiSelectors.TEXT_VIEW);
            const availableDates: Array<{ element: any; dateNumber: number }> = [];
            
            // Collect available dates (numbers between 1-31)
            for (const element of numberElements) {
                try {
                    const text = await element.getText();
                    const dateNumber = parseInt(text.trim());
                    
                    if (!isNaN(dateNumber) && dateNumber >= 1 && dateNumber <= 31) {
                        const isClickable = await element.isClickable();
                        const isEnabled = await element.isEnabled();
                        
                        if (isClickable && isEnabled) {
                            availableDates.push({ element, dateNumber });
                            this.logger.debug(`Found clickable date: ${dateNumber}`);
                        }
                    }
                } catch (e) {
                    // Skip elements we can't read
                }
            }
            
            if (availableDates.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableDates.length);
                const selectedDate = availableDates[randomIndex];
                
                this.logger.action(`Selecting random date: ${selectedDate.dateNumber} from ${availableDates.length} available dates`);
                await selectedDate.element.click();
                await this.driverManager.pause(appConstants.defaultPauseTime);
                this.logger.success(`Successfully clicked date: ${selectedDate.dateNumber}`);
                return true;
            } else {
                this.logger.warning('No clickable date numbers found');
                return false;
            }
        } catch (error) {
            this.logger.error('Error selecting available date', error);
            return false;
        }
    }

    async confirmDateSelection(): Promise<boolean> {
        try {
            this.logger.info('Looking for date confirmation buttons...');
            
            const confirmButtons = await this.driverManager.getDriver().$$(MaccabiSelectors.CONFIRM_BUTTONS);
            
            if (confirmButtons.length > 0) {
                this.logger.action(`Found ${confirmButtons.length} potential confirm buttons`);
                await confirmButtons[0].click();
                await this.driverManager.pause(appConstants.defaultPauseTime);
                this.logger.success('Clicked confirm button to accept date');
                return true;
            } else {
                this.logger.warning('No confirm buttons found');
                return false;
            }
        } catch (error) {
            this.logger.error('Error confirming date selection', error);
            return false;
        }
    }

    async fallbackDateEntry(): Promise<boolean> {
        try {
            this.logger.warning('Trying fallback date entry...');
            
            // Press back to close picker
            await this.driverManager.pressBackButton();
            await this.driverManager.pause(1000);
            
            // Generate a random date in the past
            const today = new Date();
            const daysAgo = Math.floor(Math.random() * 90) + 14; // 14-104 days ago
            const pastDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
            const dateString = pastDate.toLocaleDateString(appConstants.hebrewLocale);
            
            // Enter date directly
            await this.driverManager.enterText(MaccabiSelectors.DATE_INPUT, dateString);
            this.logger.success(`Entered date manually: ${dateString}`);
            return true;
        } catch (error) {
            this.logger.error('Error with fallback date entry', error);
            return false;
        }
    }

    async clickContinue(): Promise<boolean> {
        try {
            this.logger.action('Clicking continue after date selection...');
            await this.clickElementWithRetry(MaccabiSelectors.NEXT_BUTTON);
            await this.driverManager.pause(appConstants.longPauseTime);
            this.logger.success('Successfully clicked continue after date selection');
            return true;
        } catch (error) {
            this.logger.error('Failed to click continue button', error);
            return false;
        }
    }

    async completeDateInput(): Promise<boolean> {
        // Open date picker
        const pickerOpened = await this.openDatePicker();
        if (!pickerOpened) {
            return false;
        }
        
        // Analyze the interface
        await this.analyzeDatePickerInterface();
        
        let dateSelected = false;
        
        // Try to select a clickable date
        dateSelected = await this.selectAvailableDate();
        
        // If no clickable dates, try to confirm current selection
        if (!dateSelected) {
            dateSelected = await this.confirmDateSelection();
        }
        
        // If still no luck, try fallback method
        if (!dateSelected) {
            dateSelected = await this.fallbackDateEntry();
        }
        
        if (dateSelected) {
            return await this.clickContinue();
        }
        
        this.logger.error('Failed to complete date input');
        return false;
    }
}
