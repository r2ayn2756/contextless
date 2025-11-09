/**
 * ContextLess API Client - Node.js Example
 * Demonstrates how to use the ContextLess API from Node.js applications
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.CONTEXTLESS_API_URL || 'http://localhost:3001';
const API_KEY = process.env.CONTEXTLESS_API_KEY; // Optional: only if authentication is enabled

/**
 * Compress text using the ContextLess API
 * @param {string} text - Text to compress
 * @param {string} compressionLevel - 'aggressive', 'balanced', or 'minimal'
 * @returns {Promise<Object>} API response with optimized content
 */
async function compressText(text, compressionLevel = 'balanced') {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add API key if configured
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/compress`,
      {
        text: text,
        compressionLevel: compressionLevel
      },
      {
        headers: headers,
        timeout: 60000 // 60 second timeout for large texts
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      throw new Error(`API Error: ${error.response.data.error || error.message}`);
    } else if (error.request) {
      // No response received
      throw new Error('No response from API server. Is it running?');
    } else {
      // Other errors
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

/**
 * Check if the API is healthy and running
 * @returns {Promise<boolean>}
 */
async function healthCheck() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000
    });
    return response.data.status === 'OK';
  } catch (error) {
    return false;
  }
}

/**
 * Example usage with error handling and retries
 */
async function main() {
  try {
    // Health check
    console.log('Checking API health...');
    const isHealthy = await healthCheck();

    if (!isHealthy) {
      console.error('❌ API is not responding. Make sure the server is running.');
      process.exit(1);
    }

    console.log('✓ API is healthy\n');

    // Example text to compress
    const largeText = `
      Artificial intelligence (AI) is intelligence demonstrated by machines,
      as opposed to intelligence displayed by humans or animals. Leading AI
      textbooks define the field as the study of "intelligent agents": any
      system that perceives its environment and takes actions that maximize
      its chance of achieving its goals. Some popular accounts use the term
      "artificial intelligence" to describe machines that mimic "cognitive"
      functions that humans associate with the human mind, such as "learning"
      and "problem solving". This is a longer text that could benefit from
      compression to reduce token usage while maintaining the essential
      information about what artificial intelligence is and how it's defined
      in academic contexts.
    `.trim();

    console.log('Original text length:', largeText.length, 'characters');
    console.log('Compressing with balanced mode...\n');

    // Compress the text
    const result = await compressText(largeText, 'balanced');

    // Display results
    console.log('=== COMPRESSION RESULTS ===\n');
    console.log('Summary:', result.summary);
    console.log('\nCompression Stats:');
    console.log('  - Original tokens:', result.originalTokens);
    console.log('  - Optimized tokens:', result.optimizedTokens);
    console.log('  - Compression ratio:', result.compressionRatio);
    console.log('  - Processing time:', result.processingTime, 'seconds');
    console.log('\nOptimized Content:');
    console.log(result.optimizedContent);

    // Try different compression levels
    console.log('\n\n=== TESTING AGGRESSIVE COMPRESSION ===\n');
    const aggressiveResult = await compressText(largeText, 'aggressive');
    console.log('Aggressive compression ratio:', aggressiveResult.compressionRatio);
    console.log('Aggressive optimized length:', aggressiveResult.optimizedContent.length, 'characters');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export functions for use as a module
module.exports = {
  compressText,
  healthCheck
};

// Run example if called directly
if (require.main === module) {
  main();
}
