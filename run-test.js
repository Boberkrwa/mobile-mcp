const { execSync } = require('child_process');
const path = require('path');

// Set up paths
const testFile = path.join(__dirname, 'test', 'maccabi-app.test.ts');

console.log('🎯 Running Maccabi App Test...');
console.log('📍 Test file:', testFile);

try {
    // Run with ts-node directly
    const command = `npx ts-node --esm ${testFile}`;
    console.log('🔄 Executing command:', command);
    
    const output = execSync(command, { 
        cwd: __dirname,
        encoding: 'utf8',
        stdio: 'inherit'
    });
    
    console.log('✅ Test completed successfully!');
} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}
