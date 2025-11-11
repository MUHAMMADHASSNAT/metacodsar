// Quick script to set MongoDB credentials
const fs = require('fs');
const path = require('path');

const username = 'metacodsar';
const password = 'metacodsars';
const database = 'metacodsar';
const cluster = 'cluster0.7r3ulvb.mongodb.net';

// Create connection string
const connectionString = `mongodb+srv://${username}:${password}@${cluster}/${database}?appName=Cluster0`;

// .env file content
const envContent = `# MongoDB Connection String
# Username: ${username}
# Password: ${password}
MONGODB_URI=${connectionString}

# Server Port
PORT=5001

# JWT Secret (for production, use a strong random string)
JWT_SECRET=metacodsar-secret-key-2024

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
`;

// Write .env file
const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('');
console.log('========================================');
console.log('✅ MongoDB Credentials Set Successfully!');
console.log('========================================');
console.log('');
console.log('📝 Connection String:');
console.log(`   ${connectionString.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
console.log('');
console.log('📁 .env file created at:');
console.log(`   ${envPath}`);
console.log('');
console.log('🚀 Ab server start karein:');
console.log('   cd server');
console.log('   npm start');
console.log('');
console.log('========================================');
console.log('');




