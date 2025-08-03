# Maccabi App Test Suite

## 📁 Simple Test Structure

```
tests/
├── driver-manager.test.ts           # Unit tests for DriverManager
├── maccabi-app-integration.test.ts  # Comprehensive app integration tests
├── maccabi-complete-journey.test.ts # Complete user journey tests
├── setup.ts                         # Test environment setup
└── index.ts                         # Test suite exports
```

## 🧪 Test Files

### 🔧 driver-manager.test.ts

- **Purpose**: Test DriverManager component in isolation
- **Scope**: Configuration validation, method availability
- **Speed**: Fast (< 30 seconds)
- **Dependencies**: None (no Appium server required)

### 🔗 maccabi-app-integration.test.ts

- **Purpose**: Comprehensive app flow testing
- **Scope**: Registration flows, navigation, app lifecycle, performance
- **Speed**: Medium (1-5 minutes)
- **Dependencies**: Appium server + device/emulator

### 🎭 maccabi-complete-journey.test.ts

- **Purpose**: Complete user journeys from start to finish
- **Scope**: Full user scenarios, error recovery, stress testing
- **Speed**: Slow (5-15 minutes)
- **Dependencies**: Appium server + device/emulator + app installed

## 🚀 Running Tests

### VS Code Tasks

- **"Run All Tests"** - Run all test files (default)

### Command Line

```bash
# All tests
npm run test

# Specific test files
npx jest tests/driver-manager.test.ts
npx jest tests/maccabi-app-integration.test.ts
npx jest tests/maccabi-complete-journey.test.ts
```

## 🛠️ Prerequisites

### For Unit Tests (driver-manager.test.ts)

- Node.js + TypeScript
- No device/emulator required

### For Integration & Journey Tests

- Appium server running on `localhost:4723`
- Android device/emulator connected
- Maccabi app installed on device
- Device ID configured in `test/config/app.config.ts`

## 🐛 Troubleshooting

### Common Issues

1. **Appium Connection**: Ensure server is running on port 4723
2. **Device Detection**: Verify device ID in config matches connected device
3. **App Installation**: Confirm Maccabi app is installed and accessible
4. **Timeouts**: Mobile tests may need longer timeouts for slower devices

### Debug Mode

Enable detailed logging: `DEBUG=true npm run test`
