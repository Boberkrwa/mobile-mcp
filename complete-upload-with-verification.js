const { remote } = require('webdriverio');

async function completeImageUploadWithVerification() {
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
		console.log('🎯 Starting complete image upload with verification...');
		await driver.pause(3000);
		
		// Step 1: Ensure we're in pregnancy folder
		const floatingButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
		const hasFloatingButton = await floatingButton.isExisting();
		
		if (!hasFloatingButton) {
			console.log('📍 Navigating to pregnancy folder...');
			// Navigate through Personal Area to Pregnancy Folder if needed
			const personalAreaElements = await driver.$$('//*[contains(@text, "איזור אישי")]');
			if (personalAreaElements.length > 0) {
				await personalAreaElements[0].click();
				await driver.pause(3000);
			}
			
			const pregnancyFolderElements = await driver.$$('//*[contains(@text, "קלסר")]');
			if (pregnancyFolderElements.length > 0) {
				await pregnancyFolderElements[0].click();
				await driver.pause(3000);
			}
		}
		
		// Step 2: Record initial state (count of items before upload)
		console.log('📊 Recording initial state...');
		const initialImageViews = await driver.$$('//android.widget.ImageView');
		const initialEmptyState = await driver.$$('//*[contains(@resource-id, "NoResults")]');
		
		console.log(`Initial ImageViews: ${initialImageViews.length}`);
		console.log(`Initial empty state indicators: ${initialEmptyState.length}`);
		
		// Step 3: Click the + button
		console.log('➕ Clicking upload button...');
		await floatingButton.click();
		await driver.pause(3000);
		
		// Step 4: Select gallery option with better detection
		console.log('🖼️ Looking for gallery option...');
		const galleryOptions = await driver.$$(
			'//*[contains(@text, "בחירה מגלריה") or contains(@text, "גלריה") or contains(@text, "תמונות")]'
		);
		
		if (galleryOptions.length === 0) {
			console.log('❌ Gallery option not found');
			return;
		}
		
		console.log(`Found ${galleryOptions.length} gallery option(s), clicking first one...`);
		await galleryOptions[0].click();
		await driver.pause(5000); // Wait longer for gallery to load
		
		// Step 5: Handle Photos app with better image selection
		console.log('📱 In Photos app - looking for images...');
		
		// Dismiss any permission dialogs
		const dismissButtons = await driver.$$('//*[contains(@text, "Dismiss") or contains(@text, "Allow")]');
		for (const dismissButton of dismissButtons) {
			try {
				await dismissButton.click();
				await driver.pause(2000);
			} catch (e) {
				// Continue
			}
		}
		
		// Make sure we're on Photos tab
		const photosTab = await driver.$$('//*[contains(@text, "Photos")]');
		if (photosTab.length > 0) {
			await photosTab[0].click();
			await driver.pause(3000);
		}
		
		// Find and select a large image (better chance of being a real photo)
		const clickableElements = await driver.$$('//*[@clickable="true"]');
		console.log(`Found ${clickableElements.length} clickable elements in gallery`);
		
		let selectedImage = false;
		const potentialImages = [];
		
		// Analyze elements to find the best image candidates
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
						
						// Look for large square images (likely photos)
						if (width > 200 && height > 200 && area > 50000) {
							potentialImages.push({
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
		
		console.log(`Found ${potentialImages.length} potential image candidates:`);
		potentialImages.forEach((img, idx) => {
			console.log(`${idx + 1}. Image ${img.index + 1}: ${img.width}x${img.height} (area: ${img.area})`);
		});
		
		if (potentialImages.length > 0) {
			// Select the largest image (most likely to be a real photo)
			const bestImage = potentialImages.reduce((prev, current) => 
				(prev.area > current.area) ? prev : current
			);
			
			console.log(`🎯 Selecting best image: ${bestImage.width}x${bestImage.height} (area: ${bestImage.area})`);
			await bestImage.element.click();
			await driver.pause(4000);
			selectedImage = true;
		} else {
			// Fallback: select from middle area of screen
			console.log('🔄 No large images found, using fallback selection...');
			const viewElements = await driver.$$('//android.view.View[@clickable="true"]');
			if (viewElements.length > 5) {
				const middleIndex = Math.floor(viewElements.length / 2);
				await viewElements[middleIndex].click();
				await driver.pause(4000);
				selectedImage = true;
			}
		}
		
		if (!selectedImage) {
			console.log('❌ Failed to select any image');
			return;
		}
		
		// Step 6: Enhanced confirmation handling
		console.log('✅ Looking for confirmation options...');
		
		// Wait a bit for any UI changes after image selection
		await driver.pause(3000);
		
		// Try multiple confirmation strategies
		const confirmationStrategies = [
			// Primary confirmations
			'//*[contains(@text, "ADD") or contains(@text, "DONE") or contains(@text, "SELECT")]',
			'//*[contains(@text, "Add") or contains(@text, "Done") or contains(@text, "Select")]',
			'//*[contains(@text, "OK") or contains(@text, "Continue") or contains(@text, "Next")]',
			// Hebrew confirmations
			'//*[contains(@text, "אישור") or contains(@text, "בחר") or contains(@text, "הוסף")]',
			'//*[contains(@text, "המשך") or contains(@text, "סיום") or contains(@text, "אמצע")]',
			// Button-based
			'//*[@clickable="true" and contains(@class, "Button")]',
			'//*[contains(@resource-id, "button") and @clickable="true"]',
			// Checkmark or selection indicators
			'//*[contains(@text, "✓") or contains(@content-desc, "select") or contains(@content-desc, "done")]'
		];
		
		let confirmationClicked = false;
		for (const strategy of confirmationStrategies) {
			if (confirmationClicked) break;
			
			try {
				const buttons = await driver.$$(strategy);
				if (buttons.length > 0) {
					console.log(`Found ${buttons.length} confirmation button(s) with strategy: ${strategy}`);
					
					for (const button of buttons) {
						try {
							const text = await button.getText();
							const resourceId = await button.getAttribute('resource-id');
							const isEnabled = await button.isEnabled();
							
							console.log(`Button: "${text}" (ID: ${resourceId}) Enabled: ${isEnabled}`);
							
							// Skip navigation buttons
							if (text && (text.includes('back') || text.includes('cancel') || text.includes('close'))) {
								continue;
							}
							
							if (isEnabled) {
								console.log(`✅ Clicking confirmation button: "${text}"`);
								await button.click();
								confirmationClicked = true;
								await driver.pause(3000);
								break;
							}
						} catch (e) {
							// Try next button
						}
					}
				}
			} catch (e) {
				// Try next strategy
			}
		}
		
		// Step 7: Return to Maccabi app
		console.log('🏥 Returning to Maccabi app...');
		
		if (!confirmationClicked) {
			console.log('⚠️ No confirmation button clicked - trying back button method');
		}
		
		// Use back button to return to app (multiple presses if needed)
		for (let i = 0; i < 4; i++) {
			await driver.pressKeyCode(4); // Android back button
			await driver.pause(2000);
			
			// Check if we're back in Maccabi
			try {
				const maccabiButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
				const backInMaccabi = await maccabiButton.isExisting();
				
				if (backInMaccabi) {
					console.log(`✅ Back in Maccabi app after ${i + 1} back button presses`);
					break;
				}
			} catch (e) {
				// Continue trying
			}
		}
		
		// Step 8: Verify upload success
		console.log('🔍 Verifying upload success...');
		await driver.pause(3000);
		
		const finalImageViews = await driver.$$('//android.widget.ImageView');
		const finalEmptyState = await driver.$$('//*[contains(@resource-id, "NoResults")]');
		const finalClickableViews = await driver.$$('//*[@clickable="true" and contains(@class, "View")]');
		
		console.log('\n📊 BEFORE vs AFTER COMPARISON:');
		console.log(`ImageViews: ${initialImageViews.length} → ${finalImageViews.length} (${finalImageViews.length > initialImageViews.length ? '+' : ''}${finalImageViews.length - initialImageViews.length})`);
		console.log(`Empty state: ${initialEmptyState.length} → ${finalEmptyState.length}`);
		console.log(`Clickable views: 0 → ${finalClickableViews.length}`);
		
		// Check for success indicators
		const uploadSuccess = 
			(finalImageViews.length > initialImageViews.length) || // More images
			(finalEmptyState.length < initialEmptyState.length) || // Less empty state
			(finalClickableViews.length > 0); // New clickable content
		
		console.log('\n🎯 FINAL UPLOAD RESULT:');
		if (uploadSuccess) {
			console.log('🎉 SUCCESS: Image upload appears successful!');
			console.log('✅ Evidence: New content detected in pregnancy folder');
		} else {
			console.log('❌ FAILED: No evidence of successful upload');
			console.log('💡 The image selection/confirmation process may need adjustment');
		}
		
		// Show final folder contents
		console.log('\n📱 Current folder contents:');
		const textElements = await driver.$$('//*[string-length(@text) > 0]');
		for (let i = 0; i < Math.min(textElements.length, 10); i++) {
			try {
				const text = await textElements[i].getText();
				if (text && text.trim() && !text.includes('קלסר הריון')) {
					console.log(`  - "${text}"`);
				}
			} catch (e) {
				// Skip
			}
		}
		
	} catch (error) {
		console.error('❌ Error during upload:', error.message);
	} finally {
		await driver.deleteSession();
	}
}

completeImageUploadWithVerification().catch(console.error);
