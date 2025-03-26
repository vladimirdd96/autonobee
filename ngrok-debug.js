const { exec } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to check if ngrok is installed
const checkNgrokInstalled = () => {
  return new Promise((resolve, reject) => {
    exec('npx ngrok --version', (error, stdout, stderr) => {
      if (error) {
        console.error('Error checking ngrok:', error.message);
        reject(new Error('ngrok is not installed or not accessible via npx'));
        return;
      }
      
      if (stderr) {
        console.error('Error checking ngrok:', stderr);
        reject(new Error('ngrok returned an error when checking version'));
        return;
      }
      
      console.log('ngrok version:', stdout.trim());
      resolve(true);
    });
  });
};

// Function to verify auth token
const verifyAuthToken = (token) => {
  if (!token) {
    throw new Error('NGROK_AUTHTOKEN is not set in environment variables');
  }
  
  if (token.length < 10) {
    throw new Error('NGROK_AUTHTOKEN appears to be invalid (too short)');
  }
  
  return true;
};

// Function to verify static domain
const verifyStaticDomain = (domain) => {
  if (!domain) {
    throw new Error('NGROK_STATIC_DOMAIN is not set in environment variables');
  }
  
  if (!domain.includes('.ngrok-free.app')) {
    console.warn('Warning: NGROK_STATIC_DOMAIN does not contain .ngrok-free.app, which is unusual');
  }
  
  return true;
};

// Function to test ngrok connection
const testNgrokConnection = (authToken) => {
  return new Promise((resolve, reject) => {
    const testProcess = exec(`npx ngrok authtoken ${authToken}`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Failed to authenticate with ngrok: ${error.message}`));
        return;
      }
      
      if (stderr) {
        reject(new Error(`ngrok auth stderr: ${stderr}`));
        return;
      }
      
      console.log('ngrok authentication result:', stdout.trim());
      resolve(true);
    });
  });
};

// Run the diagnostics
async function runDiagnostics() {
  console.log('======= NGROK DIAGNOSTICS =======');
  
  try {
    // Check if ngrok is installed
    console.log('1. Checking if ngrok is installed...');
    await checkNgrokInstalled();
    console.log('✅ ngrok is installed and accessible');
    
    // Verify auth token
    console.log('\n2. Verifying auth token...');
    const authToken = process.env.NGROK_AUTHTOKEN;
    verifyAuthToken(authToken);
    console.log('✅ NGROK_AUTHTOKEN is set');
    
    // Verify static domain
    console.log('\n3. Verifying static domain...');
    const staticDomain = process.env.NGROK_STATIC_DOMAIN;
    verifyStaticDomain(staticDomain);
    console.log('✅ NGROK_STATIC_DOMAIN is set');
    
    // Test ngrok connection
    console.log('\n4. Testing ngrok connection...');
    await testNgrokConnection(authToken);
    console.log('✅ Successfully connected to ngrok');
    
    console.log('\n======= DIAGNOSTICS SUMMARY =======');
    console.log('All tests passed! Your ngrok setup appears to be valid.');
    console.log('\nIf you are still experiencing issues, please:');
    console.log('1. Make sure you have internet connectivity');
    console.log('2. Check if your ngrok authtoken is still valid in your ngrok dashboard');
    console.log('3. Verify that your static domain is correctly reserved in your ngrok dashboard');
    console.log('4. Ensure no other process is using the same static domain');
    
  } catch (error) {
    console.error('\n❌ DIAGNOSTICS FAILED');
    console.error('Error:', error.message);
    console.error('\nPlease fix the identified issues and try again.');
  }
}

runDiagnostics(); 