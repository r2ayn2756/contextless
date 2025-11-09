/**
 * Simple API Test Script
 * Quick test to verify the ContextLess API is working
 * Run: node test-api.js
 */

const axios = require('axios');

const API_URL = process.env.CONTEXTLESS_API_URL || 'http://localhost:3001';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testHealthCheck() {
  try {
    log('\n1. Testing Health Check...', 'cyan');
    const response = await axios.get(`${API_URL}/health`);

    if (response.data.status === 'OK') {
      log('   ✓ Health check passed', 'green');
      log(`   Service: ${response.data.service}`, 'blue');
      return true;
    }
    return false;
  } catch (error) {
    log('   ✗ Health check failed', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

async function testBasicCompression() {
  try {
    log('\n2. Testing Basic Compression (Balanced)...', 'cyan');

    const testText = `
      Artificial intelligence (AI) is intelligence demonstrated by machines,
      as opposed to intelligence displayed by humans or animals. Leading AI
      textbooks define the field as the study of "intelligent agents": any
      system that perceives its environment and takes actions that maximize
      its chance of achieving its goals.
    `.trim();

    const response = await axios.post(`${API_URL}/api/compress`, {
      text: testText,
      compressionLevel: 'balanced'
    }, {
      timeout: 30000
    });

    log('   ✓ Compression successful', 'green');
    log(`   Original tokens: ${response.data.originalTokens}`, 'blue');
    log(`   Optimized tokens: ${response.data.optimizedTokens}`, 'blue');
    log(`   Compression ratio: ${response.data.compressionRatio}`, 'blue');
    log(`   Processing time: ${response.data.processingTime}s`, 'blue');
    log(`   Summary: ${response.data.summary.substring(0, 80)}...`, 'blue');
    return true;
  } catch (error) {
    log('   ✗ Compression test failed', 'red');
    log(`   Error: ${error.response?.data?.error || error.message}`, 'red');
    return false;
  }
}

async function testAggressiveCompression() {
  try {
    log('\n3. Testing Aggressive Compression...', 'cyan');

    const testText = 'Cloud computing delivers computing services over the Internet including servers, storage, databases, and software.';

    const response = await axios.post(`${API_URL}/api/compress`, {
      text: testText,
      compressionLevel: 'aggressive'
    }, {
      timeout: 30000
    });

    log('   ✓ Aggressive compression successful', 'green');
    log(`   Compression ratio: ${response.data.compressionRatio}`, 'blue');
    return true;
  } catch (error) {
    log('   ✗ Aggressive compression failed', 'red');
    log(`   Error: ${error.response?.data?.error || error.message}`, 'red');
    return false;
  }
}

async function testErrorHandling() {
  try {
    log('\n4. Testing Error Handling (Empty Text)...', 'cyan');

    const response = await axios.post(`${API_URL}/api/compress`, {
      text: '',
      compressionLevel: 'balanced'
    });

    log('   ✗ Should have returned an error', 'red');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log('   ✓ Error handling works correctly', 'green');
      log(`   Error code: ${error.response.data.code}`, 'blue');
      return true;
    }
    log('   ✗ Unexpected error', 'red');
    return false;
  }
}

async function testInvalidCompressionLevel() {
  try {
    log('\n5. Testing Invalid Compression Level...', 'cyan');

    const response = await axios.post(`${API_URL}/api/compress`, {
      text: 'Some text',
      compressionLevel: 'invalid_level'
    });

    log('   ✗ Should have returned an error', 'red');
    return false;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.code === 'INVALID_COMPRESSION_LEVEL') {
      log('   ✓ Validation works correctly', 'green');
      return true;
    }
    log('   ✗ Unexpected error response', 'red');
    return false;
  }
}

async function runTests() {
  log('========================================', 'yellow');
  log('  ContextLess API Test Suite', 'yellow');
  log('========================================', 'yellow');
  log(`\nAPI URL: ${API_URL}\n`, 'blue');

  const results = {
    passed: 0,
    failed: 0
  };

  // Run all tests
  const tests = [
    testHealthCheck,
    testBasicCompression,
    testAggressiveCompression,
    testErrorHandling,
    testInvalidCompressionLevel
  ];

  for (const test of tests) {
    const passed = await test();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  // Summary
  log('\n========================================', 'yellow');
  log('  Test Results', 'yellow');
  log('========================================', 'yellow');
  log(`Total: ${results.passed + results.failed}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log('========================================\n', 'yellow');

  if (results.failed > 0) {
    log('⚠️  Some tests failed. Check the API server logs.', 'red');
    process.exit(1);
  } else {
    log('✓ All tests passed! The API is working correctly.', 'green');
    process.exit(0);
  }
}

// Check if server is running
log('Checking if API server is accessible...', 'cyan');
axios.get(`${API_URL}/health`, { timeout: 5000 })
  .then(() => {
    runTests();
  })
  .catch((error) => {
    log('\n❌ Cannot connect to API server', 'red');
    log(`   URL: ${API_URL}`, 'blue');
    log(`   Error: ${error.message}`, 'red');
    log('\n💡 Make sure the server is running:', 'yellow');
    log('   cd backend && npm start\n', 'cyan');
    process.exit(1);
  });
