const { remote } = require('webdriverio');

async function checkCurrentScreen() {
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
		console.log('🔍 Checking current screen state...');
		await driver.pause(3000);
		
		// Get all text elements
		const allElements = await driver.$$('//*');
		console.log(`Found ${allElements.length} total elements`);
		
		// Get readable text elements
		const textElements = await driver.$$('//*[string-length(@text) > 0]');
		console.log(`\n📱 Current screen content (${textElements.length} text elements):`);
		
		for (let i = 0; i < Math.min(textElements.length, 20); i++) {
			try {
				const text = await textElements[i].getText();
				const className = await textElements[i].getAttribute('class');
				const resourceId = await textElements[i].getAttribute('resource-id');
				
				if (text && text.trim()) {
					console.log(`${i+1}. "${text}" (${className}) [${resourceId}]`);
				}
			} catch (e) {
				// Skip unreadable elements
			}
		}
		
		// Check for clickable elements
		console.log('\n🎯 Clickable elements:');
		const clickableElements = await driver.$$('//*[@clickable="true"]');
		console.log(`Found ${clickableElements.length} clickable elements`);
		
		for (let i = 0; i < Math.min(clickableElements.length, 15); i++) {
			try {
				const text = await clickableElements[i].getText();
				const className = await clickableElements[i].getAttribute('class');
				const resourceId = await clickableElements[i].getAttribute('resource-id');
				const bounds = await clickableElements[i].getAttribute('bounds');
				
				if (text && text.trim()) {
					console.log(`${i+1}. CLICKABLE: "${text}" (${className}) [${resourceId}] ${bounds}`);
				} else if (resourceId && resourceId.includes('button')) {
					console.log(`${i+1}. CLICKABLE BUTTON: [${resourceId}] (${className}) ${bounds}`);
				}
			} catch (e) {
				// Skip unreadable elements
			}
		}
		
		// Look specifically for navigation or key elements
		console.log('\n🔍 Looking for key navigation elements...');
		
		const keyElementSelectors = [
			'*[contains(@text, "איזור אישי")]', // Personal Area
			'*[contains(@text, "קלסר")]', // Folder
			'*[contains(@text, "הריון")]', // Pregnancy
			'*[contains(@text, "עמוד הבית")]', // Home Page
			'*[contains(@text, "תפריט")]', // Menu
			'*[contains(@text, "חזור")]', // Back
			'*[contains(@resource-id, "menu")]',
			'*[contains(@resource-id, "home")]',
			'*[contains(@resource-id, "back")]',
			'*[contains(@resource-id, "navigation")]'
		];
		
		for (const selector of keyElementSelectors) {
			try {
				const elements = await driver.$$(`//${selector}`);
				if (elements.length > 0) {
					console.log(`✅ Found ${elements.length} element(s) matching: ${selector}`);
					for (const el of elements) {
						const text = await el.getText().catch(() => '');
						const resourceId = await el.getAttribute('resource-id').catch(() => '');
						console.log(`   - "${text}" [${resourceId}]`);
					}
				}
			} catch (e) {
				// Skip if selector fails
			}
		}
		
	} catch (error) {
		console.error('❌ Error checking screen:', error.message);
	} finally {
		await driver.deleteSession();
	}
}

checkCurrentScreen().catch(console.error);
