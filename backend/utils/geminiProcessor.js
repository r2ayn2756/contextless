/**
 * Gemini API Processor
 * Handles text optimization using Google Gemini AI
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
let genAI;
let model;

function initializeGemini() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using Gemini 2.5 Flash - fast and efficient model
    // Note: gemini-2.5-flash-lite would be 1.5x faster but may have lower quality
    model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        maxOutputTokens: 8192, // Increased from 4096 to handle larger outputs
        temperature: 0.3,
      }
    });
  }
  return model;
}

/**
 * Get system prompt based on compression level
 * @param {string} compressionLevel - 'aggressive', 'balanced', or 'minimal'
 * @returns {string} System prompt for Gemini
 */
function getSystemPrompt(compressionLevel) {
  const basePrompt = `You are a context optimization expert. Your job is to extract ONLY the essential information from the provided text, removing redundancy, filler words, and unnecessary details while preserving all key facts, data points, and actionable information.

Rules:
- Preserve ALL important facts, numbers, names, and dates
- Remove conversational filler and repetition
- Keep technical terms and specific details
- Maintain logical flow
- Use clear, concise language`;

  const compressionTargets = {
    aggressive: '- Output should be 70-80% shorter than input\n- Be extremely concise, keep only critical information',
    balanced: '- Output should be 60-70% shorter than input\n- Balance brevity with completeness',
    minimal: '- Output should be 40-50% shorter than input\n- Preserve more context and detail'
  };

  return `${basePrompt}\n${compressionTargets[compressionLevel] || compressionTargets.balanced}`;
}

/**
 * Process a single text chunk with Gemini
 * @param {string} text - The text to optimize
 * @param {string} compressionLevel - 'aggressive', 'balanced', or 'minimal'
 * @param {string} requestId - Request ID for logging
 * @returns {Promise<{summary: string, optimizedContent: string}>}
 */
async function processChunk(text, compressionLevel = 'balanced', requestId = 'unknown') {
  const chunkStartTime = Date.now();

  try {
    console.log(`[${requestId}]   - Initializing Gemini model...`);
    const model = initializeGemini();
    const systemPrompt = getSystemPrompt(compressionLevel);

    const prompt = `${systemPrompt}

Text to optimize:
${text}

Output format:
SUMMARY: [2-3 sentence overview]
OPTIMIZED: [compressed essential content only]`;

    console.log(`[${requestId}]   - Sending request to Gemini API...`);
    const apiStartTime = Date.now();

    const result = await model.generateContent(prompt);

    const apiEndTime = Date.now();
    console.log(`[${requestId}]   - Gemini API responded in ${((apiEndTime - apiStartTime) / 1000).toFixed(2)}s`);

    const response = await result.response;
    const responseText = response.text();

    console.log(`[${requestId}]   - Response received, length: ${responseText.length} chars`);

    // Parse the response
    const summaryMatch = responseText.match(/SUMMARY:\s*([\s\S]*?)(?=OPTIMIZED:|$)/i);
    const optimizedMatch = responseText.match(/OPTIMIZED:\s*([\s\S]*?)$/i);

    const summary = summaryMatch ? summaryMatch[1].trim() : '';
    const optimizedContent = optimizedMatch ? optimizedMatch[1].trim() : responseText;

    const chunkEndTime = Date.now();
    const totalChunkTime = ((chunkEndTime - chunkStartTime) / 1000).toFixed(2);
    console.log(`[${requestId}]   - Chunk processed successfully in ${totalChunkTime}s total`);

    return {
      summary,
      optimizedContent
    };
  } catch (error) {
    const chunkEndTime = Date.now();
    const totalChunkTime = ((chunkEndTime - chunkStartTime) / 1000).toFixed(2);
    console.error(`[${requestId}]   ✗ Gemini API Error after ${totalChunkTime}s:`, error.message);
    console.error(`[${requestId}]   ✗ Error stack:`, error.stack);
    throw new Error(`Failed to process text with Gemini: ${error.message}`);
  }
}

/**
 * Process multiple chunks and combine results
 * @param {string[]} chunks - Array of text chunks
 * @param {string} compressionLevel - 'aggressive', 'balanced', or 'minimal'
 * @param {string} requestId - Request ID for logging
 * @returns {Promise<{summary: string, optimizedContent: string}>}
 */
async function processChunks(chunks, compressionLevel = 'balanced', requestId = 'unknown') {
  const totalChunks = chunks.length;

  console.log(`[${requestId}] Starting processing of ${totalChunks} chunk(s) with ${compressionLevel} compression`);

  const startTime = Date.now();

  // Limit parallel processing to avoid rate limits (process in batches of 10)
  const BATCH_SIZE = 10;
  const results = [];

  if (totalChunks <= BATCH_SIZE) {
    console.log(`[${requestId}] Using PARALLEL processing (${totalChunks} chunks)`);

    // Process ALL chunks in parallel for small batches
    const chunkPromises = chunks.map((chunk, i) => {
      console.log(`[${requestId}] Launching chunk ${i + 1}/${totalChunks} (${chunk.length} characters)...`);
      return processChunk(chunk, compressionLevel, requestId)
        .then(result => {
          console.log(`[${requestId}] ✓ Chunk ${i + 1}/${totalChunks} completed`);
          return { index: i, result };
        })
        .catch(error => {
          console.error(`[${requestId}] ✗ Chunk ${i + 1}/${totalChunks} failed:`, error.message);
          throw error;
        });
    });

    // Wait for all chunks to complete
    const completedChunks = await Promise.all(chunkPromises);
    results.push(...completedChunks);
  } else {
    console.log(`[${requestId}] Using BATCHED processing (${totalChunks} chunks in batches of ${BATCH_SIZE})`);

    // Process in batches to avoid rate limits
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);
      const batch = chunks.slice(i, i + BATCH_SIZE);

      console.log(`[${requestId}] Processing batch ${batchNumber}/${totalBatches} (${batch.length} chunks)...`);

      const batchPromises = batch.map((chunk, batchIndex) => {
        const chunkIndex = i + batchIndex;
        console.log(`[${requestId}] Launching chunk ${chunkIndex + 1}/${totalChunks}...`);
        return processChunk(chunk, compressionLevel, requestId)
          .then(result => {
            console.log(`[${requestId}] ✓ Chunk ${chunkIndex + 1}/${totalChunks} completed`);
            return { index: chunkIndex, result };
          })
          .catch(error => {
            console.error(`[${requestId}] ✗ Chunk ${chunkIndex + 1}/${totalChunks} failed:`, error.message);
            throw error;
          });
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < chunks.length) {
        console.log(`[${requestId}] Waiting 1s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // Sort by original index to maintain order
  results.sort((a, b) => a.index - b.index);
  const processedResults = results.map(c => c.result);

  const endTime = Date.now();
  const totalTime = ((endTime - startTime) / 1000).toFixed(2);
  console.log(`[${requestId}] All ${totalChunks} chunk(s) processed successfully in ${totalTime}s`);

  // Combine results
  const combinedSummary = processedResults.length > 1
    ? `This content was processed in ${processedResults.length} parts. ` + processedResults.map((r, i) => `Part ${i + 1}: ${r.summary}`).join(' ')
    : processedResults[0].summary;

  const combinedOptimized = processedResults.map(r => r.optimizedContent).join('\n\n---\n\n');

  return {
    summary: combinedSummary,
    optimizedContent: combinedOptimized
  };
}

/**
 * Validate API key on startup
 * @returns {Promise<boolean>}
 */
async function validateApiKey() {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_key_here') {
      throw new Error('GEMINI_API_KEY not configured in .env file');
    }

    // Test the API key with a minimal request
    const model = initializeGemini();
    const result = await model.generateContent('Hi');
    await result.response;
    return true;
  } catch (error) {
    console.error('API Key Validation Failed:', error.message);
    return false;
  }
}

module.exports = {
  processChunk,
  processChunks,
  validateApiKey
};
