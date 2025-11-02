const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server connection...');
    const response = await axios.get('http://localhost:5001/api/health');
    console.log('✅ Server is running!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Server connection failed!');
    console.log('Error:', error.message);
    console.log('Make sure server is running on port 5001');
  }
}

testServer();

