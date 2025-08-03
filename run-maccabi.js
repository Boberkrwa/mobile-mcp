const { remote } = require('webdriverio');

const deviceId = 'b7a325f6';
const maccabiPackage = 'com.ideomobile.maccabipregnancy';
const maccabiActivity = '.ui.splash.view.PASplashActivity';

async function runMaccabiAutomation() {
    const driver = await remote({
        hostname: 'localhost',
        port: 4723,
        path: '/',
        logLevel: 'info',
        capabilities: {
            platformName: 'Android',
            'appium:deviceName': deviceId,
            'appium:udid': deviceId,
            'appium:appPackage': maccabiPackage,
            'appium:appActivity': maccabiActivity,
            'appium:automationName': 'UiAutomator2',
            'appium:noReset': true
        }
    });

    try {
        await driver.startActivity(maccabiPackage, maccabiActivity);
        await driver.pause(3000);

        console.log('🚀 Starting Maccabi app automation...');

        // Wait for splash screen to disappear
        let attempts = 0;
        while (attempts < 5) {
            attempts++;
            console.log(`Checking for splash screen... attempt ${attempts}`);
            const textElements = await driver.$$(`//*[contains(@class, "android.widget.TextView")]`);
            if (textElements.length === 0) {
                console.log('✅ Splash screen disappeared');
                break;
            }
            await driver.pause(2000);
        }

        // Look for skip button
        let skipFound = false;
        attempts = 0;
        while (!skipFound && attempts < 5) {
            attempts++;
            console.log(`Looking for skip button... attempt ${attempts}`);
            
            const elements = await driver.$$(`//*[contains(@class, "android.widget.TextView")]`);
            for (const element of elements) {
                try {
                    const text = await element.getText();
                    console.log(`Found text: "${text}"`);
                    if (text === 'דלגי') {
                        console.log('🔄 Found skip button - clicking it...');
                        await element.click();
                        skipFound = true;
                        await driver.pause(3000);
                        break;
                    }
                } catch (e) {
                    // Continue
                }
            }
            if (!skipFound) await driver.pause(2000);
        }

        // Enter name
        console.log('📝 Looking for name input...');
        await driver.pause(2000);
        
        const nameInput = await driver.$('id=com.ideomobile.maccabipregnancy:id/nameTextInputEditText');
        const exists = await nameInput.isExisting();
        if (exists) {
            console.log('✅ Found name input - entering name...');
            await nameInput.setValue('מיכאל קורולנקו');
            console.log('✅ Name entered: מיכאל קורולנקו');
            
            const continueButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/nextButton');
            await continueButton.click();
            console.log('🔄 Clicked continue');
            await driver.pause(3000);
        }

        // Check if we're on date screen and handle date selection
        console.log('📅 Looking for date input field...');
        const dateInput = await driver.$('id=com.ideomobile.maccabipregnancy:id/textInputEditText');
        const dateExists = await dateInput.isExisting();
        
        if (dateExists) {
            console.log('✅ Found date input - clicking to open date picker...');
            await dateInput.click();
            await driver.pause(3000);
            
            // Look for date picker elements - try multiple strategies
            console.log('📅 Analyzing date picker interface...');
            
            // Strategy 1: Look for any clickable elements in the date picker
            let allClickableElements = await driver.$$(`//*[@clickable="true"]`);
            console.log(`Found ${allClickableElements.length} total clickable elements`);
            
            // Strategy 2: Look for specific date picker patterns
            let datePickerElements = await driver.$$(`//*[contains(@resource-id, "date") or contains(@resource-id, "picker") or contains(@resource-id, "calendar")]`);
            console.log(`Found ${datePickerElements.length} date picker specific elements`);
            
            // Strategy 3: Look for number patterns (days)
            let numberElements = await driver.$$(`//*[contains(@class, "TextView")]`);
            console.log(`Found ${numberElements.length} TextView elements`);
            
            let availableDates = [];
            let daySelected = false;
            
            // Check all TextView elements for selectable dates
            for (const element of numberElements) {
                try {
                    const text = await element.getText();
                    const dateNumber = parseInt(text.trim());
                    
                    if (!isNaN(dateNumber) && dateNumber >= 1 && dateNumber <= 31) {
                        const isClickable = await element.isClickable();
                        const isEnabled = await element.isEnabled();
                        
                        if (isClickable && isEnabled) {
                            availableDates.push({ element, dateNumber });
                            console.log(`✅ Found clickable date: ${dateNumber}`);
                        } else {
                            console.log(`📅 Found date ${dateNumber} but not clickable/enabled`);
                        }
                    }
                } catch (e) {
                    // Skip elements we can't read
                }
            }
            
            if (availableDates.length > 0) {
                // Select a random available date
                const randomIndex = Math.floor(Math.random() * availableDates.length);
                const selectedDate = availableDates[randomIndex];
                
                console.log(`🎯 Selecting random date: ${selectedDate.dateNumber} from ${availableDates.length} available dates`);
                await selectedDate.element.click();
                daySelected = true;
                console.log(`✅ Successfully clicked date: ${selectedDate.dateNumber}`);
                await driver.pause(2000);
            } else {
                console.log('⚠️ No clickable date numbers found. Looking for OK/Done buttons...');
                
                // Look for OK, Done, or similar buttons to accept current date
                const confirmButtons = await driver.$$(`//*[contains(@text, "OK") or contains(@text, "Done") or contains(@text, "אישור") or contains(@text, "סיום")]`);
                
                if (confirmButtons.length > 0) {
                    console.log(`Found ${confirmButtons.length} potential confirm buttons`);
                    await confirmButtons[0].click();
                    console.log('✅ Clicked confirm button to accept date');
                    daySelected = true;
                    await driver.pause(2000);
                } else {
                    console.log('⚠️ No confirm buttons found, trying direct date entry...');
                    
                    // Try pressing back to close picker and enter date manually
                    await driver.pressKeyCode(4); // Android back button
                    await driver.pause(1000);
                    
                    // Generate a random date in the past (for last menstrual period)
                    const today = new Date();
                    const daysAgo = Math.floor(Math.random() * 90) + 14; // 14-104 days ago
                    const pastDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
                    const dateString = pastDate.toLocaleDateString('he-IL'); // Hebrew locale format
                    
                    // Find date input again and enter date
                    const dateInputAgain = await driver.$('id=com.ideomobile.maccabipregnancy:id/textInputEditText');
                    const inputExists = await dateInputAgain.isExisting();
                    if (inputExists) {
                        await dateInputAgain.setValue(dateString);
                        console.log(`📅 Entered date manually: ${dateString}`);
                        daySelected = true;
                        await driver.pause(2000);
                    }
                }
            }
            
            if (daySelected) {
                // Click continue button to proceed
                const continueButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/nextButton');
                const continueExists = await continueButton.isExisting();
                if (continueExists) {
                    await continueButton.click();
                    console.log('🔄 Clicked continue after date selection');
                    await driver.pause(3000);
                } else {
                    console.log('⚠️ Continue button not found after date selection');
                }
            }
        }

        // Analyze current screen elements
        console.log('🔍 Final screen analysis:');
        const elements = await driver.$$(`//*[contains(@class, "android.widget.EditText") or contains(@class, "android.widget.Button") or contains(@class, "android.widget.TextView")]`);
        console.log(`Found ${elements.length} elements on current screen`);
        
        for (let i = 0; i < Math.min(elements.length, 10); i++) {
            try {
                const text = await elements[i].getText();
                const resourceId = await elements[i].getAttribute('resource-id');
                const contentDesc = await elements[i].getAttribute('content-desc');
                console.log(`${i+1}. Text: "${text}" | ID: ${resourceId} | Desc: "${contentDesc}"`);
            } catch (e) {
                console.log(`${i+1}. Could not read element`);
            }
        }

        // Step 5: Select number of fetuses
        console.log('👶 Looking for fetus count selection...');
        await driver.pause(3000);
        
        try {
            // Check if we're on the fetus selection screen
            const titleElement = await driver.$('id=com.ideomobile.maccabipregnancy:id/title');
            const titleExists = await titleElement.isExisting();
            
            if (titleExists) {
                const titleText = await titleElement.getText();
                console.log(`📋 Screen title: ${titleText}`);
                
                if (titleText.includes('עוברים') || titleText.includes('fetus')) {
                    console.log('✅ Found fetus selection screen');
                    
                    // Look for number options (1, 2, 3)
                    const numberElements = await driver.$$(`//*[contains(@class, "android.widget.TextView") and (@text="1" or @text="2" or @text="3")]`);
                    
                    if (numberElements.length > 0) {
                        console.log(`Found ${numberElements.length} fetus count options`);
                        
                        // Select option 1 (single pregnancy is most common)
                        const selectedOption = numberElements[0]; // Select "1"
                        const optionText = await selectedOption.getText();
                        
                        console.log(`🎯 Selecting ${optionText} fetus(es)`);
                        await selectedOption.click();
                        console.log(`✅ Selected ${optionText} fetus count`);
                        await driver.pause(2000);
                        
                        // Click continue button
                        const continueButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/nextButton');
                        const continueExists = await continueButton.isExisting();
                        
                        if (continueExists) {
                            await continueButton.click();
                            console.log('🔄 Clicked continue after fetus selection');
                            await driver.pause(3000);
                            
                            // Analyze final screen
                            console.log('🔍 Final registration screen:');
                            const finalElements = await driver.$$(`//*[contains(@class, "android.widget.EditText") or contains(@class, "android.widget.Button") or contains(@class, "android.widget.TextView")]`);
                            
                            console.log(`Found ${finalElements.length} elements on final screen`);
                            for (let i = 0; i < Math.min(finalElements.length, 6); i++) {
                                try {
                                    const text = await finalElements[i].getText();
                                    const resourceId = await finalElements[i].getAttribute('resource-id');
                                    const contentDesc = await finalElements[i].getAttribute('content-desc');
                                    console.log(`${i+1}. Text: "${text}" | ID: ${resourceId} | Desc: "${contentDesc}"`);
                                } catch (e) {
                                    console.log(`${i+1}. Could not read element`);
                                }
                            }
                        } else {
                            console.log('❌ Continue button not found after fetus selection');
                        }
                    } else {
                        console.log('❌ No fetus count options found');
                    }
                } else {
                    console.log('ℹ️ Not on fetus selection screen, skipping...');
                }
            } else {
                console.log('❌ Title element not found');
            }
        } catch (e) {
            console.log('Error with fetus selection:', e.message);
        }

        console.log('✅ Registration automation completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await driver.deleteSession();
    }
}

runMaccabiAutomation().catch(console.error);
