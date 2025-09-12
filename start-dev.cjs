const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting full development environment...\n');

let serverProcess = null;
let viteProcess = null;

// Function to start backend server
function startServer() {
  console.log('📡 Starting backend server on port 3001...');
  serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Error starting server:', error.message);
  });

  serverProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Server process exited with code ${code}`);
    }
  });
}

// Function to start frontend server
function startVite() {
  console.log('🎨 Starting Vite development server on port 3000...');
  const vitePath = path.join('node_modules', '.bin', 'vite');
  
  viteProcess = spawn('node', [vitePath], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  viteProcess.on('error', (error) => {
    console.error('❌ Error starting Vite:', error.message);
  });

  viteProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Vite process exited with code ${code}`);
    }
  });
}

// Start servers
startServer();

// Wait 3 seconds then start Vite
setTimeout(() => {
  startVite();
  
  console.log('\n✅ Both servers are starting...');
  console.log('📡 Backend: http://localhost:3001');
  console.log('🎨 Frontend: http://localhost:3000');
  console.log('\nPress Ctrl+C to stop both servers');
}, 3000);

// Handle cleanup
function cleanup() {
  console.log('\n🛑 Shutting down development servers...');
  
  if (serverProcess) {
    serverProcess.kill();
  }
  
  if (viteProcess) {
    viteProcess.kill();
  }
  
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
