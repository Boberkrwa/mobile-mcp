import { remote } from 'webdriverio';
import * as assert from "node:assert";
import { TEST_CONFIG, SELECTORS, TEST_DATA } from './config/test.config';

let driver: any;

// Simple Page Object Model for Maccabi App
class MaccabiAppPage {
    constructor(private driver: any) {}

    async waitForSplashToDisappear(): Promise<boolean> {
        console.log('⏳ Waiting for splash screen...');
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            attempts++;
            console.log(`Checking for splash screen... attempt ${attempts}`);
            
            try {
                const textElements = await this.driver.$$(
                    `//*[contains(@class, "android.widget.TextView")]`
                );
                
                if (textElements.length === 0) {
                    console.log('✅ Splash screen disappeared - proceeding to main logic');
                    return true;
                }
                
                await this.driver.pause(2000);
            } catch (e: unknown) {
                console.log('Error checking splash screen:', e instanceof Error ? e.message : String(e));
                break;
            }
        }
        return false;
    }

    async findAndClickSkipButton(): Promise<boolean> {
        console.log('🔍 Looking for skip button...');
        let skipButtonFound = false;
        let attempts = 0;
        const maxAttempts = 5;
        
        while (!skipButtonFound && attempts < maxAttempts) {
            attempts++;
            console.log(`Attempt ${attempts}: Looking for skip button...`);
            
            try {
                const elements = await this.driver.$$(
                    `//*[contains(@class, "android.widget.EditText") or
                       contains(@class, "android.widget.Button") or
                       contains(@class, "android.widget.TextView") or
                       contains(@class, "android.widget.ImageButton")]`
                );
                
                for (const element of elements) {
                    try {
                        const text = await element.getText();
                        const contentDesc = await element.getAttribute('content-desc');
                        console.log(`Found element: text="${text}", contentDesc="${contentDesc}"`);
                        
                        if (text === 'דלגי' || contentDesc === 'דלגי') {
                            console.log(`🔄 Found skip button (דלגי) - clicking it...`);
                            await element.click();
                            skipButtonFound = true;
                            await this.driver.pause(TEST_CONFIG.timeouts.implicit);
                            break;
                        }
                    } catch (e) {
                        // Continue to next element
                    }
                }
                
                if (!skipButtonFound) {
                    await this.driver.pause(2000);
                }
            } catch (e) {
                console.log(`Error in attempt ${attempts}:`, e instanceof Error ? e.message : String(e));
                await this.driver.pause(2000);
            }
        }

        if (!skipButtonFound) {
            console.log('⚠️ Skip button not found - continuing anyway...');
        }
        
        return skipButtonFound;
    }

    async enterName(): Promise<boolean> {
        console.log('📝 Looking for name input field...');
        await this.driver.pause(2000);
        
        try {
            const nameInput = await this.driver.$(`id=${SELECTORS.nameInput}`);
            const nameInputExists = await nameInput.isExisting();
            
            if (nameInputExists) {
                console.log('✅ Found name input field - entering name...');
                await nameInput.setValue(TEST_DATA.user.name);
                console.log(`✅ Entered name: ${TEST_DATA.user.name}`);
                
                // Click continue
                const continueButton = await this.driver.$(`id=${SELECTORS.nextButton}`);
                await continueButton.click();
                console.log('🔄 Clicked continue after name input');
                await this.driver.pause(TEST_CONFIG.timeouts.implicit);
                return true;
            } else {
                console.log('❌ Name input field not found');
                return false;
            }
        } catch (e) {
            console.log('Error with name input:', e instanceof Error ? e.message : String(e));
            return false;
        }
    }

    async selectDate(): Promise<boolean> {
        console.log('📅 Looking for date input field...');
        await this.driver.pause(2000);
        
        try {
            const dateInput = await this.driver.$(`id=${SELECTORS.dateInput}`);
            const dateInputExists = await dateInput.isExisting();
            
            if (dateInputExists) {
                console.log('✅ Found date input field - clicking to open date picker...');
                await dateInput.click();
                console.log('🔄 Clicked date input field');
                await this.driver.pause(TEST_CONFIG.timeouts.implicit);
                
                // Look for available dates on the calendar
                console.log('📅 Looking for available dates on calendar...');
                
                let daySelected = false;
                let availableDates = [];
                
                const dateElements = await this.driver.$$(
                    `//*[contains(@class, "android.widget.TextView") and @clickable="true"]`
                );
                
                console.log(`Found ${dateElements.length} potential clickable date elements`);
                
                // Collect available dates (numbers between 1-31)
                for (const element of dateElements) {
                    try {
                        const text = await element.getText();
                        const dateNumber = parseInt(text.trim());
                        
                        if (!isNaN(dateNumber) && dateNumber >= TEST_DATA.dateRange.minDay && dateNumber <= TEST_DATA.dateRange.maxDay) {
                            const isEnabled = await element.isEnabled();
                            const isClickable = await element.isClickable();
                            
                            if (isEnabled && isClickable) {
                                availableDates.push({ element, dateNumber });
                                console.log(`✅ Found available date: ${dateNumber}`);
                            }
                        }
                    } catch (e) {
                        // Skip elements we can't read
                    }
                }
                
                // Select a random date from available dates
                if (availableDates.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableDates.length);
                    const selectedDate = availableDates[randomIndex];
                    
                    console.log(`🎯 Selecting random date: ${selectedDate.dateNumber} from ${availableDates.length} available dates`);
                    await selectedDate.element.click();
                    daySelected = true;
                    console.log(`✅ Successfully clicked date: ${selectedDate.dateNumber}`);
                    await this.driver.pause(2000);
                } else {
                    console.log('⚠️ No available dates found, trying direct date input...');
                    
                    // Fallback: Try to input a date directly
                    const randomDay = Math.floor(Math.random() * 28) + 1;
                    const randomMonth = Math.floor(Math.random() * 12) + 1;
                    const currentYear = new Date().getFullYear();
                    const dateString = `${randomDay}/${randomMonth}/${currentYear}`;
                    
                    await dateInput.setValue(dateString);
                    console.log(`📅 Entered date directly: ${dateString}`);
                    daySelected = true;
                    await this.driver.pause(2000);
                }
                
                if (daySelected) {
                    // Click continue button to proceed
                    const continueButton = await this.driver.$(`id=${SELECTORS.nextButton}`);
                    await continueButton.click();
                    console.log('🔄 Clicked continue after date selection');
                    await this.driver.pause(TEST_CONFIG.timeouts.implicit);
                    return true;
                }
            } else {
                console.log('❌ Date input field not found');
            }
        } catch (e) {
            console.log('Error with date input:', e instanceof Error ? e.message : String(e));
        }
        
        return false;
    }

    async analyzeNextScreen(): Promise<void> {
        console.log('🔍 Analyzing next screen after date selection...');
        const nextScreenElements = await this.driver.$$(
            `//*[contains(@class, "android.widget.EditText") or 
               contains(@class, "android.widget.Button") or 
               contains(@class, "android.widget.TextView")]`
        );
        
        console.log(`Found ${nextScreenElements.length} elements on next screen:`);
        for (let i = 0; i < Math.min(nextScreenElements.length, 8); i++) {
            try {
                const text = await nextScreenElements[i].getText();
                const resourceId = await nextScreenElements[i].getAttribute('resource-id');
                console.log(`${i+1}. "${text}" (ID: ${resourceId})`);
            } catch (e) {
                console.log(`${i+1}. Could not read element`);
            }
        }
    }
}

describe('Maccabi App Tests', () => {
    let maccabiPage: MaccabiAppPage;

    beforeAll(async () => {
        driver = await remote({
            hostname: TEST_CONFIG.appium.host,
            port: TEST_CONFIG.appium.port,
            path: '/',
            logLevel: 'info',
            capabilities: {
                platformName: TEST_CONFIG.device.platform,
                'appium:deviceName': TEST_CONFIG.device.id,
                'appium:udid': TEST_CONFIG.device.id,
                'appium:appPackage': TEST_CONFIG.app.package,
                'appium:appActivity': TEST_CONFIG.app.activity,
                'appium:automationName': 'UiAutomator2',
                'appium:noReset': true
            }
        });
        
        maccabiPage = new MaccabiAppPage(driver);
    });

    it('[TC-120208] Registration', async () => {
        // Launch the app
        await driver.startActivity(TEST_CONFIG.app.package, TEST_CONFIG.app.activity);
        await driver.pause(TEST_CONFIG.timeouts.implicit);

        console.log('🚀 Starting Maccabi app automation...');

        // Step 1: Wait for splash screen to disappear
        const splashDisappeared = await maccabiPage.waitForSplashToDisappear();
        assert.ok(splashDisappeared, 'Splash screen should disappear');

        // Step 2: Look for and click skip button
        await maccabiPage.findAndClickSkipButton();

        // Step 3: Enter name
        const nameEntered = await maccabiPage.enterName();
        assert.ok(nameEntered, 'Name should be entered successfully');

        // Step 4: Date input and selection
        const dateSelected = await maccabiPage.selectDate();
        assert.ok(dateSelected, 'Date should be selected successfully');

        // Step 5: Analyze next screen
        await maccabiPage.analyzeNextScreen();

        // Verify we're still in the Maccabi app
        const currentPackage = await driver.getCurrentPackage();
        assert.equal(currentPackage, TEST_CONFIG.app.package);
    });

    afterAll(async () => {
        if (driver) {
            await driver.deleteSession();
        }
    });
});
