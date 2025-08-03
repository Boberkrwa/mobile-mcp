const { remote } = require('webdriverio');

async function returnToMaccabiApp() {
	const driver = await remote({
		hostname: 'localhost',
		port: 4723,
		path: '/',
		logLevel: 'info',
		capabilities: {
			platformName: 'Android',
			'appium:deviceName': 'b7a325f6',
			'appium:udid': 'b7a325f6',
			'appium:appPackage': 'com.ideomobile.maccabipregnancy',
			'appium:appActivity': '.ui.splash.view.PASplashActivity',
			'appium:automationName': 'UiAutomator2',
			'appium:noReset': true
		}
	});

	try {
		console.log('🔄 Attempting to return to Maccabi app...');
		await driver.pause(2000);
		
		// Check current state
		const textElements = await driver.$$('//*[string-length(@text) > 0]');
		console.log(`Current screen has ${textElements.length} text elements`);
		
		let currentTexts = [];
		for (let i = 0; i < Math.min(textElements.length, 10); i++) {
			try {
				const text = await textElements[i].getText();
				if (text && text.trim()) {
					currentTexts.push(text);
					console.log(`${i+1}. "${text}"`);
				}
			} catch (e) {
				// Skip
			}
		}
		
		// Check if we're still in Photos app
		const inPhotosApp = currentTexts.some(text => 
			text.includes('Photos') || text.includes('Albums') || text.includes('Choose cloud')
		);
		
		if (inPhotosApp) {
			console.log('\n📱 Still in Photos app, using back button to return to Maccabi...');
			
			// Try multiple back button presses to get back to Maccabi
			for (let i = 0; i < 3; i++) {
				console.log(`Back button press ${i + 1}...`);
				await driver.pressKeyCode(4); // Android back button
				await driver.pause(2000);
				
				// Check if we're back in Maccabi app
				try {
					const floatingButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
					const buttonExists = await floatingButton.isExisting();
					
					if (buttonExists) {
						console.log('✅ Found + button - successfully returned to Maccabi pregnancy folder!');
						break;
					}
				} catch (e) {
					// Continue trying
				}
				
				// Check for Maccabi app content
				const newTextElements = await driver.$$('//*[string-length(@text) > 0]');
				let foundMaccabiContent = false;
				
				for (let j = 0; j < Math.min(newTextElements.length, 5); j++) {
					try {
						const text = await newTextElements[j].getText();
						if (text && (text.includes('מכבי') || text.includes('הריון') || text.includes('קלסר'))) {
							console.log(`✅ Found Maccabi content: "${text}"`);
							foundMaccabiContent = true;
							break;
						}
					} catch (e) {
						// Skip
					}
				}
				
				if (foundMaccabiContent) {
					console.log('✅ Successfully returned to Maccabi app!');
					break;
				}
			}
		}
		
		// Final verification
		console.log('\n🔍 Final verification of current state...');
		await driver.pause(2000);
		
		const finalTextElements = await driver.$$('//*[string-length(@text) > 0]');
		console.log(`\nFinal screen analysis (${finalTextElements.length} text elements):`);
		
		let isInMaccabi = false;
		let hasPregnancyFolder = false;
		let hasFloatingButton = false;
		
		// Check text content
		for (let i = 0; i < Math.min(finalTextElements.length, 15); i++) {
			try {
				const text = await finalTextElements[i].getText();
				if (text && text.trim()) {
					console.log(`${i+1}. "${text}"`);
					
					if (text.includes('מכבי') || text.includes('הריון')) {
						isInMaccabi = true;
					}
					
					if (text.includes('קלסר') || text.includes('ההפניות') || text.includes('מרשמים')) {
						hasPregnancyFolder = true;
					}
				}
			} catch (e) {
				// Skip
			}
		}
		
		// Check for floating action button
		try {
			const floatingButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
			hasFloatingButton = await floatingButton.isExisting();
			
			if (hasFloatingButton) {
				console.log('✅ + button found - in pregnancy folder');
			}
		} catch (e) {
			// No floating button
		}
		
		// Check for any uploaded content (images/files)
		const imageViews = await driver.$$('//android.widget.ImageView');
		console.log(`\nFound ${imageViews.length} ImageView elements (potential uploaded images)`);
		
		// Also check for any View elements that might represent uploaded content
		const contentViews = await driver.$$('//*[contains(@class, "View") and @clickable="true"]');
		console.log(`Found ${contentViews.length} clickable View elements (potential content)`);
		
		// Final result
		console.log('\n🎯 FINAL STATUS:');
		if (hasFloatingButton) {
			console.log('🎉 SUCCESS: Back in pregnancy folder with + button available!');
			
			if (imageViews.length > 2) {
				console.log(`✨ BONUS: Found ${imageViews.length} ImageView elements - image may have been uploaded!`);
			} else {
				console.log('ℹ️  Upload status: Unclear if image was successfully added');
			}
		} else if (isInMaccabi) {
			console.log('⚠️  PARTIAL SUCCESS: In Maccabi app but not in pregnancy folder');
		} else {
			console.log('❌ ISSUE: Not clearly back in Maccabi app');
		}
		
		// Provide next steps if needed
		if (!hasFloatingButton && isInMaccabi) {
			console.log('\n💡 Recommendation: Navigate back to pregnancy folder manually to check upload result');
		}
		
	} catch (error) {
		console.error('❌ Error returning to app:', error.message);
	} finally {
		await driver.deleteSession();
	}
}

returnToMaccabiApp().catch(console.error);
