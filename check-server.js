// Quick script to check if server is running on port 5001
const http = require('http');

const PORT = 5001;
const URL = `http://localhost:${PORT}/api/health`;

console.log(`🔍 Checking server on port ${PORT}...\n`);

const req = http.get(URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Server is RUNNING! ✅\n');
      console.log('Response:', data);
      console.log(`\n🔗 Server URL: http://localhost:${PORT}`);
      console.log(`📱 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`\n✅ Ab aap login kar sakte hain!\n`);
    } else {
      console.log(`❌ Server responded with status ${res.statusCode}`);
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.log('❌ Server is NOT running! ❌\n');
    console.log('🔧 Server start karne ke liye:\n');
    console.log('1️⃣  Root folder se "start-app.bat" run karein');
    console.log('   Ya manually:\n');
    console.log('2️⃣  Terminal khol kar:');
    console.log('   cd server');
    console.log('   npm start\n');
    console.log('3️⃣  Agar port 5001 busy hai:');
    console.log('   cd server');
    console.log('   node free-port.js');
    console.log('   npm start\n');
  } else {
    console.log('❌ Error:', error.message);
  }
});

req.setTimeout(5000, () => {
  req.destroy();
  console.log('⏱️  Connection timeout!');
  console.log('Server respond nahi kar raha. Check karein ki server start hua hai ya nahi.');
});

