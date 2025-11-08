const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('');
console.log('========================================');
console.log('🚀 MongoDB Setup & Server Start');
console.log('========================================');
console.log('');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  try {
    // Get MongoDB credentials
    const username = await question('Enter MongoDB Atlas Username: ');
    const password = await question('Enter MongoDB Atlas Password: ');
    
    // URL encode password to handle special characters
    const encodedPassword = encodeURIComponent(password);
    
    // Create .env file content
    const envContent = `MONGODB_URI=mongodb+srv://${username}:${encodedPassword}@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
JWT_SECRET=metacodsar-secret-key-2024-change-in-production
PORT=5001
`;

    // Write .env file
    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent, 'utf8');
    
    console.log('');
    console.log('✅ .env file created successfully!');
    console.log('');
    console.log('📝 Connection String:');
    console.log(`   mongodb+srv://${username}:***@cluster0.7r3ulvb.mongodb.net/metacodsar`);
    console.log('');
    console.log('🚀 Starting server...');
    console.log('');
    
    rl.close();
    
    // Start server
    const server = spawn('npm', ['start'], {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    });
    
    server.on('error', (error) => {
      console.error('❌ Error starting server:', error);
      process.exit(1);
    });
    
    // Handle server exit
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Stopping server...');
      server.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Setup error:', error);
    rl.close();
    process.exit(1);
  }
}

setup();



