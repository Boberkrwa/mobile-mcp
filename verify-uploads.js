const { remote } = require('webdriverio');

async function verifyUploadedImages() {
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
		console.log('🔍 Checking for uploaded images in pregnancy folder...');
		await driver.pause(3000);
		
		// First, make sure we're in the pregnancy folder
		const floatingButton = await driver.$('id=com.ideomobile.maccabipregnancy:id/floatingActionButton');
		const hasFloatingButton = await floatingButton.isExisting();
		
		if (!hasFloatingButton) {
			console.log('❌ Not in pregnancy folder - navigating there first...');
			
			// Try to find Personal Area
			const personalAreaElements = await driver.$$('//*[contains(@text, "איזור אישי")]');
			if (personalAreaElements.length > 0) {
				await personalAreaElements[0].click();
				await driver.pause(3000);
			}
			
			// Navigate to pregnancy folder
			const pregnancyFolderElements = await driver.$$('//*[contains(@text, "קלסר ההריון")]');
			if (pregnancyFolderElements.length > 0) {
				await pregnancyFolderElements[0].click();
				await driver.pause(3000);
			}
		}
		
		console.log('📱 Analyzing pregnancy folder content...');
		
		// Get all elements on the screen
		const allElements = await driver.$$('//*');
		console.log(`Total elements found: ${allElements.length}`);
		
		// Specifically look for ImageView elements
		const imageViews = await driver.$$('//android.widget.ImageView');
		console.log(`\n🖼️ ImageView elements found: ${imageViews.length}`);
		
		// Analyze each ImageView
		for (let i = 0; i < imageViews.length; i++) {
			try {
				const imageView = imageViews[i];
				const bounds = await imageView.getAttribute('bounds');
				const resourceId = await imageView.getAttribute('resource-id');
				const contentDesc = await imageView.getAttribute('content-desc');
				const className = await imageView.getAttribute('class');
				const clickable = await imageView.getAttribute('clickable');
				
				console.log(`Image ${i+1}:`);
				console.log(`  - Bounds: ${bounds}`);
				console.log(`  - Resource ID: ${resourceId}`);
				console.log(`  - Content Description: ${contentDesc}`);
				console.log(`  - Class: ${className}`);
				console.log(`  - Clickable: ${clickable}`);
				
				// Try to determine if this is a user-uploaded image vs system UI
				if (bounds) {
					const boundsMatch = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
					if (boundsMatch) {
						const [, left, top, right, bottom] = boundsMatch.map(Number);
						const width = right - left;
						const height = bottom - top;
						const area = width * height;
						
						console.log(`  - Size: ${width}x${height} (area: ${area})`);
						
						// Large images are more likely to be uploaded content
						if (area > 10000) {
							console.log(`  ⭐ POTENTIAL UPLOADED IMAGE: Large size suggests user content`);
						}
					}
				}
				console.log('---');
				
			} catch (e) {
				console.log(`Error analyzing image ${i+1}:`, e);
			}
		}
		
		// Look for RecyclerView or ListView that might contain uploaded files
		const recyclerViews = await driver.$$('//android.support.v7.widget.RecyclerView | //androidx.recyclerview.widget.RecyclerView');
		console.log(`\n📋 RecyclerView elements found: ${recyclerViews.length}`);
		
		// Look for any View elements that might be file items
		const clickableViews = await driver.$$('//*[@clickable="true" and contains(@class, "View")]');
		console.log(`\n🎯 Clickable View elements: ${clickableViews.length}`);
		
		// Look for elements that might indicate file uploads
		const fileIndicators = await driver.$$(
			'//*[contains(@text, "jpg") or contains(@text, "png") or contains(@text, "jpeg") or ' +
			'contains(@text, "תמונה") or contains(@text, "קובץ") or ' +
			'contains(@content-desc, "image") or contains(@content-desc, "file")]'
		);
		console.log(`\n📄 File indicator elements: ${fileIndicators.length}`);
		
		for (let i = 0; i < fileIndicators.length; i++) {
			try {
				const text = await fileIndicators[i].getText();
				const contentDesc = await fileIndicators[i].getAttribute('content-desc');
				console.log(`File indicator ${i+1}: "${text}" (desc: "${contentDesc}")`);
			} catch (e) {
				// Skip
			}
		}
		
		// Check all text elements for any file/image related content
		console.log('\n📝 Checking all text elements for upload evidence...');
		const textElements = await driver.$$('//*[string-length(@text) > 0]');
		
		let uploadEvidenceFound = false;
		for (let i = 0; i < textElements.length; i++) {
			try {
				const text = await textElements[i].getText();
				if (text) {
					// Look for file extensions, dates, or upload-related text
					if (text.includes('.jpg') || text.includes('.png') || text.includes('.jpeg') ||
						text.includes('תמונה') || text.includes('קובץ שהועלה') ||
						text.includes('uploaded') || text.includes('added') ||
						text.match(/\d{1,2}\/\d{1,2}\/\d{4}/) || // Date pattern
						text.match(/\d{1,2}-\d{1,2}-\d{4}/)) { // Another date pattern
						
						console.log(`🎯 UPLOAD EVIDENCE: "${text}"`);
						uploadEvidenceFound = true;
					}
				}
			} catch (e) {
				// Skip
			}
		}
		
		// Look for empty state messages
		const emptyStateMessages = await driver.$$(
			'//*[contains(@text, "אין") or contains(@text, "ריק") or contains(@text, "לא נמצא") or ' +
			'contains(@text, "empty") or contains(@text, "no files") or contains(@text, "nothing")]'
		);
		
		if (emptyStateMessages.length > 0) {
			console.log('\n📭 Empty state indicators found:');
			for (let i = 0; i < emptyStateMessages.length; i++) {
				try {
					const text = await emptyStateMessages[i].getText();
					console.log(`Empty message ${i+1}: "${text}"`);
				} catch (e) {
					// Skip
				}
			}
		}
		
		// Final analysis
		console.log('\n🎯 UPLOAD VERIFICATION SUMMARY:');
		console.log(`- ImageView elements: ${imageViews.length}`);
		console.log(`- Clickable Views: ${clickableViews.length}`);
		console.log(`- File indicators: ${fileIndicators.length}`);
		console.log(`- Upload evidence in text: ${uploadEvidenceFound ? 'YES' : 'NO'}`);
		console.log(`- Empty state messages: ${emptyStateMessages.length}`);
		
		if (uploadEvidenceFound) {
			console.log('✅ CONCLUSION: Evidence of uploaded content found!');
		} else if (imageViews.length > 2) {
			console.log('🤔 CONCLUSION: Multiple images present - possible upload success');
		} else if (emptyStateMessages.length > 0) {
			console.log('❌ CONCLUSION: Empty state detected - no uploads found');
		} else {
			console.log('❓ CONCLUSION: Upload status unclear - no clear evidence either way');
		}
		
		// Test the upload button is still working
		console.log('\n🧪 Testing upload button functionality...');
		if (hasFloatingButton) {
			await floatingButton.click();
			await driver.pause(2000);
			
			const uploadOptions = await driver.$$('//*[contains(@text, "הוספת") or contains(@text, "העלאת")]');
			if (uploadOptions.length > 0) {
				console.log('✅ Upload button works - dialog opened successfully');
				
				// Close the dialog
				await driver.pressKeyCode(4); // Back button
				await driver.pause(1000);
			} else {
				console.log('❌ Upload button clicked but no dialog appeared');
			}
		}
		
	} catch (error) {
		console.error('❌ Error during verification:', error.message);
	} finally {
		await driver.deleteSession();
	}
}

verifyUploadedImages().catch(console.error);
