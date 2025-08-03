# PowerShell script to run tests with proper Node.js flags for WebDriverIO
$env:NODE_OPTIONS = "--experimental-vm-modules"
npx jest test/maccabi-app-refactored.test.ts --verbose
