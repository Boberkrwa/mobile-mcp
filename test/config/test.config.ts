export const TEST_CONFIG = {
	device: {
		id: "b7a325f6",
		platform: "Android" as const
	},
	app: {
		package: "com.ideomobile.maccabipregnancy",
		activity: ".ui.splash.view.PASplashActivity"
	},
	timeouts: {
		implicit: 10000,
		explicit: 15000,
		splash: 30000,
		element: 5000
	},
	appium: {
		host: "localhost",
		port: 4723,
		path: "/"
	}
};

export const SELECTORS = {
	nameInput: "com.ideomobile.maccabipregnancy:id/nameTextInputEditText",
	dateInput: "com.ideomobile.maccabipregnancy:id/textInputEditText",
	nextButton: "com.ideomobile.maccabipregnancy:id/nextButton",
	skipButton: '//android.widget.TextView[@text="דלגי"]',
	textViews: '//*[contains(@class, "android.widget.TextView")]',
	clickableElements: '//*[contains(@class, "android.widget.EditText") or contains(@class, "android.widget.Button") or contains(@class, "android.widget.TextView") or contains(@class, "android.widget.ImageButton")]',
	clickableDates: '//*[contains(@class, "android.widget.TextView") and @clickable="true"]'
};

export const TEST_DATA = {
	user: {
		name: "מיכאל קורולנקו",
		testId: "TC-120208"
	},
	dateRange: {
		minDay: 1,
		maxDay: 28, // Safe range to avoid month-end issues
		minMonth: 1,
		maxMonth: 12
	}
};
