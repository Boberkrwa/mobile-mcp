const { remote } = require('webdriverio');

async function selectRandomImageFromGallery(driver) {
	try {
		console.log('📸 Looking for images in gallery...');
		await driver.pause(3000); // Wait for gallery to fully load
		
		// Look for image elements in gallery
		const imageElements = await driver.$$('//*[contains(@class, "ImageView") or contains(@resource-id, "image") or contains(@content-desc, "image") or contains(@class, "GridView")]');
		console.log(`Found ${imageElements.length} potential image elements`);
		
		if (imageElements.length === 0) {
			// Try alternative selectors for gallery images - including generic View elements that are clickable
			const alternativeImages = await driver.$$('//*[@clickable="true"]');
			console.log(`Found ${alternativeImages.length} clickable elements in gallery`);
			
			// Filter for elements that look like images (check first 10)
			let selectedImage = null;
			for (let i = 0; i < Math.min(alternativeImages.length, 10); i++) {
				try {
					const className = await alternativeImages[i].getAttribute('class');
					const resourceId = await alternativeImages[i].getAttribute('resource-id');
					const contentDesc = await alternativeImages[i].getAttribute('content-desc');
					console.log(`Gallery element ${i+1}: class="${className}", id="${resourceId}", desc="${contentDesc}"`);
					
					// Since we found android.view.View elements, these are likely gallery images
					// Let's select one that looks like an image container
					if (className && className.includes('View') && !resourceId) {
						console.log(`🎯 Selecting gallery item ${i+1} as an image...`);
						selectedImage = alternativeImages[i];
						break;
					}
				} catch (e) {
					console.log(`Error checking element ${i+1}:`, e.message);
				}
			}
			
			// If we found a potential image, click it
			if (selectedImage) {
				await selectedImage.click();
				console.log('✅ Selected image from gallery!');
				await driver.pause(3000);
				
				// Look for confirm/done button after selecting image
				await confirmImageSelection(driver);
				return;
			} else {
				// Fallback: just click the first clickable element (likely an image)
				console.log('🔄 Using fallback: clicking first gallery element...');
				if (alternativeImages.length > 0) {
					await alternativeImages[0].click();
					console.log('✅ Selected first gallery item!');
					await driver.pause(3000);
					await confirmImageSelection(driver);
					return;
				}
			}
		} else {
			// Select a random image from the found images
			const randomIndex = Math.floor(Math.random() * Math.min(imageElements.length, 5)); // Pick from first 5 images
			console.log(`🎯 Selecting random image at index ${randomIndex}...`);
			await imageElements[randomIndex].click();
			console.log('✅ Selected random image from gallery!');
			await driver.pause(3000);
			
			// Look for confirm/done button after selecting image
			await confirmImageSelection(driver);
		}
		
	} catch (error) {
		console.error('Error selecting image from gallery:', error.message);
	}
}

async function confirmImageSelection(driver) {
	try {
		console.log('🔍 Looking for confirmation buttons...');
		await driver.pause(2000);
		
		// Look for common confirmation buttons
		const confirmButtons = await driver.$$('//*[contains(@text, "OK") or contains(@text, "Done") or contains(@text, "Select") or contains(@text, "Choose") or contains(@text, "אישור") or contains(@text, "בחר") or contains(@text, "סיום")]');
		
		if (confirmButtons.length > 0) {
			console.log(`Found ${confirmButtons.length} potential confirmation buttons`);
			for (const button of confirmButtons) {
				try {
					const text = await button.getText();
					const contentDesc = await button.getAttribute('content-desc');
					console.log(`Confirmation button: "${text}", desc: "${contentDesc}"`);
					
					if (text || contentDesc) {
						console.log('🎯 Clicking confirmation button...');
						await button.click();
						console.log('✅ Confirmed image selection!');
						await driver.pause(5000); // Wait longer for upload to complete
						
						// Check if we're back in the pregnancy folder and verify upload
						await verifyImageUpload(driver);
						return;
					}
				} catch (e) {
					// Continue to next button
				}
			}
		}
		
		// Alternative: look for any button in the top-right area (common for Done/OK buttons)
		const topButtons = await driver.$$('//*[@clickable="true" and contains(@class, "Button")]');
		if (topButtons.length > 0) {
			console.log('🔄 Trying alternative confirmation approach...');
			await topButtons[topButtons.length - 1].click(); // Often the last button is "Done"
			console.log('✅ Clicked potential confirmation button!');
			await driver.pause(5000); // Wait longer for upload to complete
			
			// Check if we're back in the pregnancy folder and verify upload
			await verifyImageUpload(driver);
		}
		
	} catch (error) {
		console.error('Error confirming image selection:', error.message);
	}
}

async function verifyImageUpload(driver) {
	try {
		console.log('🔍 Verifying image upload in pregnancy folder...');
		await driver.pause(3000);
		
		// Look for elements that might indicate we're back in the pregnancy folder
		const screenElements = await driver.$$('//*[contains(@class, "android.widget.TextView") or contains(@class, "android.widget.ImageView")]');
		console.log(`Found ${screenElements.length} elements on current screen`);
		
		// Check for pregnancy folder indicators and uploaded content
		let foundPregnancyFolder = false;
		let foundUploadedContent = false;
		
		for (let i = 0; i < Math.min(screenElements.length, 15); i++) {
			try {
				const text = await screenElements[i].getText();
				const className = await screenElements[i].getAttribute('class');
				const resourceId = await screenElements[i].getAttribute('resource-id');
				
				if (text && text.trim()) {
					console.log(`Element ${i+1}: "${text}" (class: ${className})`);
					
					// Check for pregnancy folder indicators
					if (text.includes('קלסר הריון') || text.includes('הריון') || text.includes('ההפניות') || text.includes('מרשמים')) {
						foundPregnancyFolder = true;
						console.log('✅ Found pregnancy folder indicators!');
					}
					
					// Check for uploaded content indicators
					if (text.includes('העלאת') || text.includes('קובץ') || text.includes('תמונה')) {
						foundUploadedContent = true;
						console.log('✅ Found upload-related content!');
					}
				}
				
				// Check for ImageView elements that might be uploaded images
				if (className && className.includes('ImageView')) {
					console.log(`Found ImageView element: ${resourceId}`);
					foundUploadedContent = true;
				}
			} catch (e) {
				// Skip unreadable elements
			}
		}
		
		// Summary of verification
		if (foundPregnancyFolder && foundUploadedContent) {
			console.log('🎉 SUCCESS: Back in pregnancy folder with uploaded content!');
		} else if (foundPregnancyFolder) {
			console.log('⚠️  PARTIAL: Back in pregnancy folder, but no clear uploaded content visible');
		} else {
			console.log('❌ UNKNOWN: Current screen status unclear');
		}
		
		// Try to look for the floating action button again to confirm we're in the right place
		try {
			const uploadButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
			const uploadButtonExists = await uploadButton.isExisting();
			
			if (uploadButtonExists) {
				console.log('✅ Confirmed: Back in pregnancy folder (+ button available)');
			}
		} catch (e) {
			console.log('ℹ️  + button not found (might be normal after upload)');
		}
		
	} catch (error) {
		console.error('Error verifying upload:', error.message);
	}
}

async function findAndClickPlusButton() {
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
		console.log('🔍 Looking for + (plus) button or upload options...');
		
		// Wait a moment for the app to load
		await driver.pause(2000);
		
		// First check if we're already on the upload options screen
		const elements = await driver.$$('//*[contains(@class, "android.widget.Button") or contains(@class, "android.widget.ImageButton") or contains(@class, "android.widget.TextView")]');
		console.log(`Found ${elements.length} potential button elements`);
		
		// Check if we can find "בחירה מגלריה" option or Photos/Albums options
		let galleryOption = null;
		let plusButton = null;
		let photosOption = null;
		
		for (const element of elements) {
			try {
				const text = await element.getText();
				const contentDesc = await element.getAttribute('content-desc');
				console.log(`Checking element with text: "${text}", contentDesc: "${contentDesc}"`);
				
				// Look for gallery option
				if (text === 'בחירה מגלריה') {
					console.log('✅ Found Gallery option directly!');
					galleryOption = element;
					break;
				}
				
				// Look for Photos option (we're already in gallery)
				if (text === 'Photos') {
					console.log('✅ Found Photos option - we are in gallery!');
					photosOption = element;
					break;
				}
				
				// Look for + button if not on upload screen yet
				if (text === '+' || contentDesc === '+' || text === 'plus' || contentDesc === 'plus' || contentDesc === 'add') {
					console.log('✅ Found + button by text or content description!');
					plusButton = element;
				}
			} catch (e) {
				// Continue to next element
			}
		}
		
		// If we found gallery option directly, click it
		if (galleryOption) {
			console.log('🎯 Clicking "בחירה מגלריה" (Choose from Gallery)...');
			await galleryOption.click();
			console.log('✅ Successfully clicked Gallery option!');
			await driver.pause(4000); // Wait for gallery to load
			
			// Now select a random image from gallery
			await selectRandomImageFromGallery(driver);
		} else if (photosOption) {
			// If we're already in the gallery (Photos option found), click on Photos
			console.log('🎯 Clicking "Photos" to browse photos...');
			await photosOption.click();
			console.log('✅ Successfully clicked Photos option!');
			await driver.pause(4000); // Wait for photos to load
			
			// Now select a random image from photos
			await selectRandomImageFromGallery(driver);
		} else if (plusButton) {
			// If we found + button, click it first
			console.log('🎯 Clicking + button...');
			await plusButton.click();
			console.log('✅ Successfully clicked + button!');
			await driver.pause(3000);
			
			// Then look for gallery option
			await findAndClickGalleryOption(driver);
		} else {
			// Try to find floating action button directly
			try {
				const uploadButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
				const uploadButtonExists = await uploadButton.isExisting();
				
				if (uploadButtonExists) {
					console.log('✅ Found FloatingActionButton (+ button) for file upload!');
					console.log('🎯 Clicking + button (העלאת קובץ למערכת)...');
					await uploadButton.click();
					console.log('✅ Successfully clicked + button!');
					await driver.pause(3000);
					
					await findAndClickGalleryOption(driver);
				} else {
					console.log('❌ Neither + button nor gallery option found');
				}
			} catch (e) {
				console.log('Strategy failed:', e.message);
			}
		}
		
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await driver.deleteSession();
	}
}

async function findAndClickGalleryOption(driver) {
	try {
		console.log('🔍 Looking for gallery option after clicking +...');
		const screenElements = await driver.$$('//*[contains(@class, "android.widget.TextView") or contains(@class, "android.widget.Button")]');
		
		for (const element of screenElements) {
			try {
				const text = await element.getText();
				if (text === 'בחירה מגלריה') {
					console.log('✅ Found Gallery option!');
					console.log('🎯 Clicking "בחירה מגלריה" (Choose from Gallery)...');
					await element.click();
					console.log('✅ Successfully clicked Gallery option!');
					await driver.pause(4000);
					
					await selectRandomImageFromGallery(driver);
					return;
				}
			} catch (e) {
				// Continue
			}
		}
		console.log('❌ Gallery option not found');
	} catch (error) {
		console.error('Error finding gallery option:', error.message);
	}
}

findAndClickPlusButton().catch(console.error);
