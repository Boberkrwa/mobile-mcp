const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running Maccabi App Automation with Professional Framework...\n');

try {
    // Set the working directory
    const testDir = path.join(__dirname, 'test');
    
    // Enable debug mode for detailed logging
    process.env.DEBUG = 'true';
    
    // Run the refactored test
    console.log('📋 Executing refactored test suite...');
    
    const result = execSync('npx jest maccabi-app-refactored.test.ts --verbose --detectOpenHandles', {
        cwd: __dirname,
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'test' }
    });
    
    console.log('\n✅ Test execution completed successfully!');
    
} catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
}
