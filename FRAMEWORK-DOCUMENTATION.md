# Professional Mobile Automation Framework

## Overview

This is a complete refactoring of the mobile automation code to follow industry best practices and professional standards. The framework now includes proper Page Object Model (POM), helper classes, configuration management, and comprehensive error handling.

## Framework Architecture

### 📁 Directory Structure

```
test/
├── config/           # Configuration files
│   ├── app.config.ts      # App-specific configuration
│   └── selectors.ts       # Centralized element selectors
├── data/             # Test data management
│   └── test-data.ts       # Test users and constants
├── helpers/          # Helper classes and utilities
│   ├── driver-manager.ts  # WebDriver management
│   └── registration-flow.ts # Main flow orchestration
├── pages/            # Page Object Model
│   ├── base.page.ts       # Base page with common functionality
│   ├── splash.page.ts     # Splash screen page
│   ├── skip.page.ts       # Skip button page
│   ├── name-input.page.ts # Name input page
│   ├── date-input.page.ts # Date selection page
│   ├── fetus-count.page.ts # Fetus count selection page
│   └── dashboard.page.ts  # Final dashboard page
└── utils/            # Utility classes
    ├── logger.ts          # Professional logging system
    └── test-utils.ts      # Common test utilities
```

## ✨ Key Improvements

### 1. **Page Object Model (POM)**

- Each screen is represented by a dedicated page class
- Encapsulates element selectors and page-specific actions
- Promotes code reusability and maintainability

### 2. **Configuration Management**

- Centralized app configuration in `app.config.ts`
- Environment-specific settings
- Easy to modify for different test environments

### 3. **Professional Logging**

- Structured logging with timestamps and context
- Different log levels (info, success, warning, error, debug)
- Visual indicators for better readability

### 4. **Error Handling & Resilience**

- Retry mechanisms for flaky operations
- Graceful error recovery
- Comprehensive error reporting

### 5. **Test Data Management**

- Externalized test data in dedicated files
- Support for multiple test users
- Configurable test scenarios

### 6. **Helper Classes**

- `DriverManager`: Centralized WebDriver management
- `RegistrationFlow`: Orchestrates the complete flow
- Utility classes for common operations

### 7. **Element Management**

- Centralized selector definitions
- Consistent element interaction patterns
- Better element waiting strategies

## 🚀 Usage

### Running the Professional Framework

```bash
# Run the new professional test framework
node run-professional-tests.js

# Or run with Jest directly
npx jest maccabi-app-refactored.test.ts --verbose
```

### Running Individual Components

```typescript
// Example: Using the framework programmatically
import { DriverManager } from "./test/helpers/driver-manager";
import { MaccabiRegistrationFlow } from "./test/helpers/registration-flow";
import { maccabiConfig } from "./test/config/app.config";
import { testUsers } from "./test/data/test-data";

async function runAutomation() {
	const driverManager = new DriverManager(maccabiConfig);
	await driverManager.initializeDriver();

	const registrationFlow = new MaccabiRegistrationFlow(driverManager);

	const success = await registrationFlow.executeCompleteRegistration(testUsers[0].registrationData);

	console.log("Registration result:", success);

	await driverManager.quitDriver();
}
```

## 📋 Configuration

### App Configuration (`config/app.config.ts`)

```typescript
export const maccabiConfig: AppConfig = {
	deviceId: "b7a325f6",
	appPackage: "com.ideomobile.maccabipregnancy",
	appActivity: ".ui.splash.view.PASplashActivity",
	appiumServer: {
		hostname: "localhost",
		port: 4723,
		path: "/",
	},
	timeouts: {
		implicit: 10000,
		explicit: 30000,
		pageLoad: 60000,
	},
	capabilities: {
		platformName: "Android",
		automationName: "UiAutomator2",
		noReset: true,
	},
};
```

### Test Data (`data/test-data.ts`)

```typescript
export const testUsers: TestUser[] = [
	{
		id: "user_001",
		registrationData: {
			name: "מיכאל קורולנקו",
			fetusCount: 1,
			dateOptions: {
				useRandomDate: true,
				dateRange: {
					minDaysAgo: 14,
					maxDaysAgo: 104,
				},
			},
		},
		expectedResults: {
			shouldReachDashboard: true,
			expectedScreens: ["splash", "skip", "name", "date", "fetus", "dashboard"],
		},
	},
];
```

## 🔧 Key Features

### 1. **Intelligent Element Detection**

- Multiple strategies for finding elements
- Fallback mechanisms for different UI states
- Robust element interaction methods

### 2. **Hebrew Text Support**

- Proper Unicode handling
- Locale-specific date formatting
- Hebrew text input validation

### 3. **Date Picker Handling**

- Multiple date picker interface support
- Random date selection within valid ranges
- Fallback to manual date entry

### 4. **Flow Orchestration**

- Step-by-step execution with detailed logging
- Conditional flow handling
- Comprehensive error recovery

### 5. **Professional Logging**

```typescript
// Example logging output
[2025-07-31T11:00:00.000Z] [INFO] [RegistrationFlow] 🚀 Starting Maccabi app registration flow...
[2025-07-31T11:00:01.000Z] [SUCCESS] [NameInputPage] ✅ Name entered: מיכאל קורולנקו
[2025-07-31T11:00:05.000Z] [ACTION] [DateInputPage] 🎯 Selecting random date: 15 from 20 available dates
[2025-07-31T11:00:10.000Z] [SUCCESS] [RegistrationFlow] 🎉 Complete registration flow executed successfully!
```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Individual page object functionality
- **Integration Tests**: Complete flow testing
- **Data-Driven Tests**: Multiple user scenarios

### Test Execution

```bash
# Run all tests
npm test

# Run specific test file
npx jest maccabi-app-refactored.test.ts

# Run with coverage
npx jest --coverage

# Run in watch mode
npx jest --watch
```

## 📈 Benefits of This Approach

### **Maintainability**

- Clear separation of concerns
- Easy to update selectors in one place
- Modular architecture

### **Reliability**

- Robust error handling
- Retry mechanisms
- Multiple fallback strategies

### **Scalability**

- Easy to add new test scenarios
- Reusable components
- Framework-agnostic design

### **Readability**

- Professional logging
- Clear method names
- Comprehensive documentation

### **Debugging**

- Detailed error reporting
- Step-by-step execution tracking
- Debug mode for detailed logging

## 🔄 Migration from Old Code

The old code in `maccabi-app.test.ts` and `run-maccabi.js` has been completely refactored:

### Before (Issues):

- ❌ Monolithic code structure
- ❌ Hard-coded selectors
- ❌ Basic error handling
- ❌ No configuration management
- ❌ Limited reusability

### After (Solutions):

- ✅ Modular Page Object Model
- ✅ Centralized configuration
- ✅ Professional error handling
- ✅ Comprehensive logging
- ✅ Highly reusable components

## 🚀 Next Steps

1. **Run the professional framework**: `node run-professional-tests.js`
2. **Customize configuration**: Modify `config/app.config.ts` for your environment
3. **Add test scenarios**: Update `data/test-data.ts` with new test cases
4. **Extend functionality**: Add new page objects for additional screens

This framework now follows all professional automation testing protocols and industry best practices!
