// Utility script to free port 5001 on Windows
const { exec } = require('child_process');

const PORT = 5001;

console.log(`Checking if port ${PORT} is in use...`);

exec(`netstat -ano | findstr :${PORT}`, (error, stdout, stderr) => {
  if (error) {
    console.log(`✅ Port ${PORT} is free!`);
    process.exit(0);
    return;
  }

  if (stdout) {
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 0) {
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          pids.add(pid);
        }
      }
    });

    if (pids.size > 0) {
      console.log(`⚠️  Port ${PORT} is in use by ${pids.size} process(es)`);
      console.log(`Found PIDs: ${Array.from(pids).join(', ')}`);
      console.log(`\nKilling processes...`);
      
      pids.forEach(pid => {
        exec(`taskkill /F /PID ${pid} /T`, (error) => {
          if (error) {
            console.log(`⚠️  Could not kill PID ${pid}: ${error.message}`);
          } else {
            console.log(`✅ Killed PID ${pid}`);
          }
        });
      });

      setTimeout(() => {
        console.log(`\n✅ Port ${PORT} should now be free!`);
        console.log(`Try starting the server again.`);
      }, 2000);
    }
  } else {
    console.log(`✅ Port ${PORT} is free!`);
  }
});

