// Load environment variables from .env and .env.local files
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { spawn, exec } = require('child_process');
const http = require('http');

// Load .env file
dotenv.config();

// Load .env.local file if it exists
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envLocalConfig = dotenv.parse(fs.readFileSync(envLocalPath));
  for (const k in envLocalConfig) {
    process.env[k] = envLocalConfig[k];
  }
}

// Function to check if the server is running
const checkServerRunning = (port) => {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, () => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    // Set a timeout for the request
    req.setTimeout(1000, () => {
      req.abort();
      resolve(false);
    });
  });
};

// Function to find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;
  let isPortTaken = true;
  
  while (isPortTaken) {
    try {
      const server = require('net').createServer();
      await new Promise((resolve, reject) => {
        server.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying next port...`);
            port++;
            resolve(false);
          } else {
            reject(err);
          }
        });
        server.once('listening', () => {
          server.close();
          resolve(true);
        });
        server.listen(port);
      });
      isPortTaken = false;
    } catch (err) {
      console.error(`Error checking port ${port}:`, err);
      port++;
    }
  }
  
  return port;
};

async function startUnifiedSetup() {
  console.log('Starting unified setup with ngrok path-based routing...');
  
  if (!process.env.NGROK_STATIC_DOMAIN) {
    console.error('Error: NGROK_STATIC_DOMAIN is required');
    console.log('Please add NGROK_STATIC_DOMAIN to your .env or .env.local file');
    process.exit(1);
  }
  
  if (!process.env.NGROK_AUTHTOKEN) {
    console.error('Error: NGROK_AUTHTOKEN is required');
    console.log('Please add NGROK_AUTHTOKEN to your .env or .env.local file');
    process.exit(1);
  }
  
  const staticDomain = process.env.NGROK_STATIC_DOMAIN;
  const requestedPort = process.env.PORT || 3000;
  
  // Check if the application is running
  console.log(`Checking if application is running on port ${requestedPort}...`);
  const isRunning = await checkServerRunning(requestedPort);
  
  let PORT = requestedPort;
  if (!isRunning) {
    // Try to find an available port if the requested one is not available
    PORT = await findAvailablePort(parseInt(requestedPort));
    if (PORT !== parseInt(requestedPort)) {
      console.log(`Port ${requestedPort} is not available, using port ${PORT} instead.`);
    }
  }
  
  let appProcess = null;
  
  if (!isRunning) {
    console.log(`Application not running on port ${PORT}. Starting it with Next.js dev server...`);
    
    // Update environment variables for the callback URL before starting the app
    process.env.CALLBACK_URL = `https://${staticDomain}/auth/callback`;
    process.env.FALLBACK_URL = `https://${staticDomain}/auth/callback`;
    process.env.NEXT_PUBLIC_APP_URL = `https://${staticDomain}`;
    
    // Set X (Twitter) callback URLs and ensure environment variables are properly set
    console.log(`Setting X callback URL to: https://${staticDomain}/api/auth/x/callback`);
    process.env.X_CALLBACK_URL = `https://${staticDomain}/api/auth/x/callback`;
    
    // Ensure all X environment variables are correctly accessible to Next.js API routes
    // by duplicating NEXT_PUBLIC_ prefixed variables without the prefix
    if (process.env.NEXT_PUBLIC_X_CLIENT_ID) {
      process.env.X_CLIENT_ID = process.env.NEXT_PUBLIC_X_CLIENT_ID;
    }
    if (process.env.NEXT_PUBLIC_X_CLIENT_SECRET) {
      process.env.X_CLIENT_SECRET = process.env.NEXT_PUBLIC_X_CLIENT_SECRET;
    }
    if (process.env.NEXT_PUBLIC_BEARER_TOKEN) {
      process.env.BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;
    }
    if (process.env.NEXT_PUBLIC_API_KEY) {
      process.env.API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    }
    if (process.env.NEXT_PUBLIC_API_SECRET) {
      process.env.API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;
    }
    
    // Start the application with Next.js dev server
    appProcess = spawn('npx', ['next', 'dev', '-p', PORT], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // Handle process exit
    appProcess.on('exit', (code) => {
      console.log(`Next.js process exited with code ${code}`);
      // Don't exit the parent process here, let ngrok continue running
      if (code !== 0) {
        console.error('Next.js failed to start. Please check for errors.');
      }
    });
    
    // Give the server a moment to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if the server started successfully
    const serverStarted = await checkServerRunning(PORT);
    if (!serverStarted) {
      console.error('Next.js server failed to start. Please check for errors.');
      // Continue anyway to start ngrok, in case the server is already running elsewhere
    } else {
      console.log('Next.js server started successfully');
    }
  } else {
    console.log('✅ Application is already running on port ' + PORT);
    
    // Even if the app is already running, update the environment variables
    process.env.CALLBACK_URL = `https://${staticDomain}/auth/callback`;
    process.env.FALLBACK_URL = `https://${staticDomain}/auth/callback`;
    
    console.log('⚠️ Note: The running application may need to be restarted to pick up the new callback URLs');
  }
  
  console.log(`Using static domain: ${staticDomain}`);
  console.log(`Forwarding to local port: ${PORT}`);
  console.log(`Setting callback URL to: ${process.env.CALLBACK_URL}`);
  
  // Use the npx command to start ngrok with the static domain and auth token
  const authToken = process.env.NGROK_AUTHTOKEN;
  const command = `npx ngrok http --authtoken=${authToken} --domain=${staticDomain} ${PORT}`;
  
  console.log(`Executing command: ${command}`);
  
  // Execute the command
  const ngrokProcess = exec(command);
  
  // Handle stdout and stderr
  ngrokProcess.stdout.on('data', (data) => {
    console.log(`ngrok: ${data}`);
  });
  
  ngrokProcess.stderr.on('data', (data) => {
    console.error(`ngrok error: ${data}`);
  });
  
  // Handle process exit
  ngrokProcess.on('exit', (code) => {
    console.log(`ngrok process exited with code ${code}`);
    if (appProcess) {
      console.log('Shutting down Next.js server...');
      appProcess.kill();
    }
    process.exit(code);
  });
  
  console.log(`\nNgrok tunnel established at: https://${staticDomain}`);
  console.log(`OAuth callback URL: https://${staticDomain}/auth/callback`);
  console.log(`\nIMPORTANT: Make sure to add this callback URL to your X.com app settings:`);
  console.log(`https://${staticDomain}/auth/callback`);
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    if (appProcess) {
      console.log('Terminating Next.js server...');
      appProcess.kill();
    }
    process.exit(0);
  });
  
  // Keep the process running
  console.log('\nPress Ctrl+C to stop all services');
}

startUnifiedSetup(); 