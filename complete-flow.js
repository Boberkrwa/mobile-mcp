const { remote } = require('webdriverio');

async function completeFileUploadFlow() {
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
		console.log('🚀 Starting complete file upload flow...');
		
		// Step 1: Find and click "איזור אישי" (Personal Area)
		console.log('\n📍 Step 1: Looking for Personal Area...');
		await driver.pause(3000);
		
		const personalAreaElements = await driver.$$('//*[contains(@text, "איזור אישי") or contains(@content-desc, "איזור אישי")]');
		if (personalAreaElements.length > 0) {
			console.log('✅ Found Personal Area, clicking...');
			await personalAreaElements[0].click();
			await driver.pause(4000);
		} else {
			console.log('ℹ️  Already in Personal Area or not found');
		}
		
		// Step 2: Find and click "קלסר ההריון שלך" (Your Pregnancy Folder)
		console.log('\n📍 Step 2: Looking for Pregnancy Folder...');
		const pregnancyFolderElements = await driver.$$('//*[contains(@text, "קלסר ההריון שלך") or contains(@content-desc, "קלסר ההריון שלך")]');
		if (pregnancyFolderElements.length > 0) {
			console.log('✅ Found Pregnancy Folder, clicking...');
			await pregnancyFolderElements[0].click();
			await driver.pause(4000);
		} else {
			console.log('ℹ️  Pregnancy Folder not found or already in it');
		}
		
		// Step 3: Find and click the "+" FloatingActionButton
		console.log('\n📍 Step 3: Looking for + button...');
		try {
			const uploadButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
			const uploadButtonExists = await uploadButton.isExisting();
			
			if (uploadButtonExists) {
				console.log('✅ Found + button, clicking...');
				await uploadButton.click();
				await driver.pause(3000);
			} else {
				console.log('❌ + button not found');
				return;
			}
		} catch (e) {
			console.log('❌ Error finding + button:', e.message);
			return;
		}
		
		// Step 4: Find and click "בחירה מגלריה" (Choose from Gallery)
		console.log('\n📍 Step 4: Looking for Gallery option...');
		const galleryElements = await driver.$$('//*[contains(@text, "בחירה מגלריה")]');
		if (galleryElements.length > 0) {
			console.log('✅ Found Gallery option, clicking...');
			await galleryElements[0].click();
			await driver.pause(5000); // Wait longer for gallery to load
		} else {
			console.log('❌ Gallery option not found');
			return;
		}
		
		// Step 5: Navigate through Photos if needed
		console.log('\n📍 Step 5: Checking if we need to select Photos...');
		const photosElements = await driver.$$('//*[contains(@text, "Photos")]');
		if (photosElements.length > 0) {
			console.log('✅ Found Photos option, clicking...');
			await photosElements[0].click();
			await driver.pause(4000);
		}
		
		// Step 6: Select an image from gallery
		console.log('\n📍 Step 6: Selecting image from gallery...');
		const clickableElements = await driver.$$('//*[@clickable="true"]');
		console.log(`Found ${clickableElements.length} clickable elements`);
		
		// Look for image elements (skip navigation elements by checking position)
		let imageSelected = false;
		for (let i = 0; i < Math.min(clickableElements.length, 20); i++) {
			try {
				const className = await clickableElements[i].getAttribute('class');
				const bounds = await clickableElements[i].getAttribute('bounds');
				
				// Check if it's a View element that could be an image
				if (className && className.includes('View') && bounds) {
					// Parse bounds to check if it's in the main content area (not navigation)
					const boundsMatch = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
					if (boundsMatch) {
						const [, left, top, right, bottom] = boundsMatch.map(Number);
						const width = right - left;
						const height = bottom - top;
						
						// Look for square-ish elements (likely images) that aren't too small
						if (width > 100 && height > 100 && Math.abs(width - height) < 50) {
							console.log(`🎯 Selecting image candidate ${i+1} (${width}x${height})...`);
							await clickableElements[i].click();
							await driver.pause(3000);
							imageSelected = true;
							break;
						}
					}
				}
			} catch (e) {
				// Continue to next element
			}
		}
		
		if (!imageSelected) {
			// Fallback: just click a likely image element
			console.log('🔄 Using fallback image selection...');
			const viewElements = await driver.$$('//android.view.View[@clickable="true"]');
			if (viewElements.length > 0) {
				await viewElements[Math.min(2, viewElements.length - 1)].click(); // Try 3rd element to avoid navigation
				await driver.pause(3000);
			}
		}
		
		// Step 7: Look for and click any confirmation/upload buttons
		console.log('\n📍 Step 7: Looking for confirmation/upload buttons...');
		await driver.pause(2000);
		
		// Try multiple strategies to find confirmation buttons
		const confirmationStrategies = [
			'//*[contains(@text, "Select") or contains(@text, "Choose") or contains(@text, "Done") or contains(@text, "OK")]',
			'//*[contains(@text, "Upload") or contains(@text, "Add") or contains(@text, "Save")]',
			'//*[contains(@text, "אישור") or contains(@text, "בחר") or contains(@text, "הוסף")]',
			'//*[@clickable="true" and contains(@class, "Button")]',
			'//*[@resource-id and contains(@resource-id, "button") and @clickable="true"]'
		];
		
		let confirmationClicked = false;
		for (const strategy of confirmationStrategies) {
			try {
				const buttons = await driver.$$(strategy);
				if (buttons.length > 0) {
					console.log(`✅ Found ${buttons.length} potential confirmation button(s) with strategy: ${strategy}`);
					
					for (const button of buttons) {
						try {
							const text = await button.getText();
							const resourceId = await button.getAttribute('resource-id');
							console.log(`Button: "${text}" (ID: ${resourceId})`);
							
							// Click the first reasonable button
							await button.click();
							console.log('✅ Clicked confirmation button!');
							confirmationClicked = true;
							await driver.pause(5000); // Wait for upload to process
							break;
						} catch (e) {
							// Try next button
						}
					}
					
					if (confirmationClicked) break;
				}
			} catch (e) {
				// Try next strategy
			}
		}
		
		if (!confirmationClicked) {
			console.log('⚠️  No confirmation button found or clicked');
		}
		
		// Step 8: Verify we're back in pregnancy folder and check for uploaded content
		console.log('\n📍 Step 8: Verifying upload completion...');
		await driver.pause(3000);
		
		const finalElements = await driver.$$('//*[contains(@class, "TextView") or contains(@class, "ImageView")]');
		console.log(`\nFinal screen analysis (${finalElements.length} elements):`);
		
		let isInPregnancyFolder = false;
		let hasUploadedContent = false;
		
		for (let i = 0; i < Math.min(finalElements.length, 15); i++) {
			try {
				const text = await finalElements[i].getText();
				const className = await finalElements[i].getAttribute('class');
				
				if (text && text.trim()) {
					console.log(`${i+1}. "${text}" (${className})`);
					
					if (text.includes('קלסר הריון') || text.includes('ההפניות') || text.includes('מרשמים')) {
						isInPregnancyFolder = true;
					}
					
					if (text.includes('העלאת') || text.includes('תמונה') || text.includes('קובץ')) {
						hasUploadedContent = true;
					}
				} else if (className && className.includes('ImageView')) {
					console.log(`${i+1}. [ImageView element - potential uploaded image]`);
					hasUploadedContent = true;
				}
			} catch (e) {
				// Skip unreadable elements
			}
		}
		
		// Check for the + button again
		try {
			const uploadButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
			const uploadButtonExists = await uploadButton.isExisting();
			
			if (uploadButtonExists) {
				console.log('✅ + button still available (back in pregnancy folder)');
				isInPregnancyFolder = true;
			}
		} catch (e) {
			// Button might not be visible if upload dialog is still open
		}
		
		// Final result
		console.log('\n🎯 FINAL RESULT:');
		if (isInPregnancyFolder && hasUploadedContent) {
			console.log('🎉 SUCCESS: Image appears to be uploaded to pregnancy folder!');
		} else if (isInPregnancyFolder) {
			console.log('⚠️  PARTIAL SUCCESS: Back in pregnancy folder, but uploaded content not clearly visible');
		} else {
			console.log('❌ UNCLEAR: Upload status uncertain');
		}
		
	} catch (error) {
		console.error('❌ Error in complete flow:', error.message);
	} finally {
		await driver.deleteSession();
	}
}

completeFileUploadFlow().catch(console.error);
