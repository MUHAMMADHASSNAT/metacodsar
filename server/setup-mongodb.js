const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('');
console.log('========================================');
console.log('🔧 MongoDB Connection Setup');
console.log('========================================');
console.log('');

rl.question('Enter MongoDB Username: ', (username) => {
  rl.question('Enter MongoDB Password: ', (password) => {
    // URL encode password (handle special characters)
    const encodedPassword = encodeURIComponent(password);
    
    const envContent = `MONGODB_URI=mongodb+srv://${username}:${encodedPassword}@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
JWT_SECRET=metacodsar-secret-key-2024-change-in-production
PORT=5001
`;

    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent, 'utf8');
    
    console.log('');
    console.log('✅ .env file updated successfully!');
    console.log('');
    console.log('📝 Connection String:');
    console.log(`   mongodb+srv://${username}:***@cluster0.7r3ulvb.mongodb.net/metacodsar`);
    console.log('');
    console.log('🚀 Now you can start the server:');
    console.log('   npm start');
    console.log('');
    
    rl.close();
  });
});





