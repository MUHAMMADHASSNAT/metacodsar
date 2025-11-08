const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('');
console.log('========================================');
console.log('🔧 MongoDB Credentials Update');
console.log('========================================');
console.log('');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function updateCredentials() {
  try {
    const envPath = path.join(__dirname, '.env');
    
    // Read current .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Get credentials
    const username = await question('Enter MongoDB Atlas Username: ');
    const password = await question('Enter MongoDB Atlas Password: ');
    
    // URL encode password
    const encodedPassword = encodeURIComponent(password);
    
    // Update MONGODB_URI
    const connectionString = `mongodb+srv://${username}:${encodedPassword}@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0`;
    
    // Update or create .env content
    let updatedContent = '';
    if (envContent.includes('MONGODB_URI=')) {
      // Replace existing MONGODB_URI
      updatedContent = envContent.replace(
        /MONGODB_URI=.*/,
        `MONGODB_URI=${connectionString}`
      );
    } else {
      // Add MONGODB_URI if not present
      updatedContent = `MONGODB_URI=${connectionString}\n${envContent}`;
    }
    
    // Ensure other required variables
    if (!updatedContent.includes('JWT_SECRET=')) {
      updatedContent += '\nJWT_SECRET=metacodsar-secret-key-2024-change-in-production';
    }
    if (!updatedContent.includes('PORT=')) {
      updatedContent += '\nPORT=5001';
    }
    if (!updatedContent.includes('NODE_ENV=')) {
      updatedContent += '\nNODE_ENV=development';
    }
    
    // Write updated .env file
    fs.writeFileSync(envPath, updatedContent, 'utf8');
    
    console.log('');
    console.log('✅ .env file updated successfully!');
    console.log('');
    console.log('📝 Updated Connection String:');
    console.log(`   mongodb+srv://${username}:***@cluster0.7r3ulvb.mongodb.net/metacodsar`);
    console.log('');
    console.log('🚀 Now you can start the server:');
    console.log('   npm start');
    console.log('');
    
    rl.close();
  } catch (error) {
    console.error('❌ Error updating credentials:', error);
    rl.close();
    process.exit(1);
  }
}

updateCredentials();



