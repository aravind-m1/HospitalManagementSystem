// restart.js
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Print welcome message
console.log('='.repeat(80));
console.log('Hospital Management System - Server Restart Script');
console.log('='.repeat(80));
console.log('This script will restart your backend and frontend servers with the new changes.\n');

// Function to kill processes on specific ports
function killProcessOnPort(port, callback) {
  const command = process.platform === 'win32'
    ? `netstat -ano | findstr :${port}`
    : `lsof -i :${port} | grep LISTEN`;
  
  exec(command, (error, stdout, stderr) => {
    if (error || !stdout) {
      console.log(`No process found on port ${port}`);
      callback();
      return;
    }
    
    console.log(`Found process running on port ${port}, stopping it...`);
    
    try {
      if (process.platform === 'win32') {
        const pidMatch = stdout.match(/\s+(\d+)\s*$/m);
        if (pidMatch && pidMatch[1]) {
          const pid = pidMatch[1];
          exec(`taskkill /F /PID ${pid}`, (err) => {
            if (err) {
              console.log(`Error stopping process: ${err.message}`);
            } else {
              console.log(`Successfully stopped process with PID ${pid}`);
            }
            callback();
          });
        } else {
          console.log('Could not extract PID from netstat output');
          callback();
        }
      } else {
        const pidMatch = stdout.match(/\s+(\d+)\s+/);
        if (pidMatch && pidMatch[1]) {
          const pid = pidMatch[1];
          exec(`kill -9 ${pid}`, (err) => {
            if (err) {
              console.log(`Error stopping process: ${err.message}`);
            } else {
              console.log(`Successfully stopped process with PID ${pid}`);
            }
            callback();
          });
        } else {
          console.log('Could not extract PID from lsof output');
          callback();
        }
      }
    } catch (err) {
      console.log(`Error processing port kill: ${err.message}`);
      callback();
    }
  });
}

// Function to start backend server
function startBackend() {
  console.log('\nStarting backend server...');
  
  const backendPath = path.join(__dirname, 'backend');
  
  // Check if node_modules exists, if not run npm install
  if (!fs.existsSync(path.join(backendPath, 'node_modules'))) {
    console.log('Installing backend dependencies...');
    exec('npm install', { cwd: backendPath }, (error) => {
      if (error) {
        console.error('Error installing backend dependencies:', error);
        return;
      }
      runBackendServer();
    });
  } else {
    runBackendServer();
  }
  
  function runBackendServer() {
    const backend = spawn('node', ['server.js'], { 
      cwd: backendPath,
      stdio: 'inherit',
      shell: true
    });
    
    backend.on('error', (error) => {
      console.error('Failed to start backend:', error);
    });
    
    console.log('Backend server started on http://localhost:5000');
  }
}

// Function to start frontend server
function startFrontend() {
  console.log('\nStarting frontend server...');
  
  const frontendPath = path.join(__dirname, 'frontend');
  
  // Check if node_modules exists, if not run npm install
  if (!fs.existsSync(path.join(frontendPath, 'node_modules'))) {
    console.log('Installing frontend dependencies...');
    exec('npm install', { cwd: frontendPath }, (error) => {
      if (error) {
        console.error('Error installing frontend dependencies:', error);
        return;
      }
      runFrontendServer();
    });
  } else {
    runFrontendServer();
  }
  
  function runFrontendServer() {
    const frontend = spawn('npm', ['start'], { 
      cwd: frontendPath,
      stdio: 'inherit',
      shell: true
    });
    
    frontend.on('error', (error) => {
      console.error('Failed to start frontend:', error);
    });
    
    console.log('Frontend server started on http://localhost:3000');
  }
}

// Kill existing processes and start servers
killProcessOnPort(5000, () => {
  killProcessOnPort(3000, () => {
    console.log('\nAll existing server processes stopped.');
    
    // Start both servers
    startBackend();
    // Start frontend after a short delay to allow backend to initialize first
    setTimeout(startFrontend, 3000);
    
    console.log('\n='.repeat(80));
    console.log('Servers should be starting...');
    console.log('You can access the application at: http://localhost:3000');
    console.log('\nIMPORTANT: If you still see "Unknown Patient", please:');
    console.log('1. Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)');
    console.log('2. Log out and log back in to refresh your session');
    console.log('3. Make sure both servers are running without errors');
    console.log('='.repeat(80));
  });
}); 