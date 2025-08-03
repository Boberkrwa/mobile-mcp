const { remote } = require('webdriverio');

async function selectImageFromPhotos() {
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
		console.log('🖼️ Already in Photos app - selecting an image...');
		await driver.pause(2000);
		
		// Step 1: First dismiss the permission dialog if it's there
		const dismissElements = await driver.$$('//*[contains(@text, "Dismiss")]');
		if (dismissElements.length > 0) {
			console.log('✅ Found Dismiss button, clicking to close privacy dialog...');
			await dismissElements[0].click();
			await driver.pause(2000);
		}
		
		// Step 2: Make sure we're on the Photos tab (not Albums)
		const photosElements = await driver.$$('//*[contains(@text, "Photos")]');
		if (photosElements.length > 0) {
			console.log('✅ Clicking Photos tab to ensure we have images...');
			await photosElements[0].click();
			await driver.pause(3000);
		}
		
		// Step 3: Find and select an image
		console.log('\n📸 Looking for images to select...');
		const clickableElements = await driver.$$('//*[@clickable="true"]');
		console.log(`Found ${clickableElements.length} clickable elements`);
		
		// Look for image elements by analyzing their bounds (square-ish shapes in grid)
		let selectedImage = false;
		const imageElements = [];
		
		for (let i = 0; i < clickableElements.length; i++) {
			try {
				const className = await clickableElements[i].getAttribute('class');
				const bounds = await clickableElements[i].getAttribute('bounds');
				
				if (className && className.includes('View') && bounds) {
					const boundsMatch = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
					if (boundsMatch) {
						const [, left, top, right, bottom] = boundsMatch.map(Number);
						const width = right - left;
						const height = bottom - top;
						const area = width * height;
						
						// Look for larger square-ish elements that are likely photos
						if (width > 100 && height > 100 && area > 20000) {
							imageElements.push({
								element: clickableElements[i],
								index: i,
								width,
								height,
								area,
								bounds
							});
						}
					}
				}
			} catch (e) {
				// Skip problematic elements
			}
		}
		
		console.log(`\n🎯 Found ${imageElements.length} potential image elements:`);
		imageElements.forEach((img, idx) => {
			console.log(`${idx + 1}. Image ${img.index + 1}: ${img.width}x${img.height} (area: ${img.area}) ${img.bounds}`);
		});
		
		if (imageElements.length > 0) {
			// Select the first reasonable image (not too small, not likely a navigation element)
			const selectedImg = imageElements[0];
			console.log(`\n✅ Selecting image ${selectedImg.index + 1} (${selectedImg.width}x${selectedImg.height})...`);
			await selectedImg.element.click();
			await driver.pause(3000);
			selectedImage = true;
		} else {
			// Fallback: try to click any View element that might be an image
			console.log('\n🔄 No clear images found, trying fallback selection...');
			const viewElements = await driver.$$('//android.view.View[@clickable="true"]');
			if (viewElements.length > 3) {
				console.log(`Clicking view element 4 out of ${viewElements.length}...`);
				await viewElements[3].click(); // Try 4th element to avoid navigation
				await driver.pause(3000);
				selectedImage = true;
			}
		}
		
		if (selectedImage) {
			console.log('\n🔍 Looking for confirmation/selection buttons...');
			
			// Look for various confirmation patterns
			const confirmationPatterns = [
				'//*[contains(@text, "Add") or contains(@text, "Select") or contains(@text, "Choose")]',
				'//*[contains(@text, "Done") or contains(@text, "OK") or contains(@text, "Continue")]',
				'//*[contains(@text, "אישור") or contains(@text, "בחר") or contains(@text, "הוסף")]',
				'//*[contains(@text, "✓") or contains(@content-desc, "select")]',
				'//*[@clickable="true" and contains(@class, "Button")]'
			];
			
			let confirmationFound = false;
			for (const pattern of confirmationPatterns) {
				try {
					const buttons = await driver.$$(pattern);
					if (buttons.length > 0) {
						console.log(`✅ Found ${buttons.length} confirmation button(s) with pattern: ${pattern}`);
						
						for (const button of buttons) {
							try {
								const text = await button.getText();
								const resourceId = await button.getAttribute('resource-id');
								console.log(`Button: "${text}" (ID: ${resourceId})`);
								
								// Click the first available button
								await button.click();
								console.log('✅ Clicked confirmation button!');
								confirmationFound = true;
								await driver.pause(5000); // Wait for processing
								break;
							} catch (e) {
								// Try next button
							}
						}
						
						if (confirmationFound) break;
					}
				} catch (e) {
					// Try next pattern
				}
			}
			
			if (!confirmationFound) {
				console.log('ℹ️  No explicit confirmation button found - image may be auto-selected');
				
				// Try Android back button or look for app navigation
				console.log('🔄 Trying to return to app...');
				try {
					await driver.pressKeyCode(4); // Android back button
					await driver.pause(3000);
				} catch (e) {
					console.log('Back button failed, trying other methods...');
				}
			}
		}
		
		// Step 4: Check if we're back in the pregnancy app
		console.log('\n🏥 Checking if we\'re back in Maccabi app...');
		await driver.pause(3000);
		
		const currentElements = await driver.$$('//*[string-length(@text) > 0]');
		console.log(`\nCurrent screen analysis (${currentElements.length} text elements):`);
		
		let isBackInApp = false;
		let hasUploadElements = false;
		
		for (let i = 0; i < Math.min(currentElements.length, 10); i++) {
			try {
				const text = await currentElements[i].getText();
				if (text && text.trim()) {
					console.log(`${i+1}. "${text}"`);
					
					// Check for Maccabi app indicators
					if (text.includes('מכבי') || text.includes('הריון') || text.includes('קלסר') || 
						text.includes('העלאת') || text.includes('הוספת')) {
						isBackInApp = true;
					}
					
					// Check for upload-related text
					if (text.includes('העלאת') || text.includes('הוספת') || text.includes('קובץ') || 
						text.includes('תמונה') || text.includes('בחירה מגלריה')) {
						hasUploadElements = true;
					}
				}
			} catch (e) {
				// Skip unreadable elements
			}
		}
		
		// Check for the floating action button (+ button)
		try {
			const floatingButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
			const buttonExists = await floatingButton.isExisting();
			
			if (buttonExists) {
				console.log('✅ Found + button - back in pregnancy folder!');
				isBackInApp = true;
			}
		} catch (e) {
			// Button not found
		}
		
		// Final result
		console.log('\n🎯 UPLOAD RESULT:');
		if (isBackInApp && !hasUploadElements) {
			console.log('🎉 SUCCESS: Image appears to be uploaded! Back in pregnancy folder without upload dialog.');
		} else if (isBackInApp && hasUploadElements) {
			console.log('⚠️  PARTIAL: Back in app but upload dialog still visible - may need retry.');
		} else if (!isBackInApp) {
			console.log('❓ UNCERTAIN: Still in photos app or different screen.');
		} else {
			console.log('ℹ️  STATUS: Upload process completed, current state unclear.');
		}
		
	} catch (error) {
		console.error('❌ Error selecting image:', error.message);
	} finally {
		await driver.deleteSession();
	}
}

selectImageFromPhotos().catch(console.error);
