/**
 * Compression Route Handler
 * POST /api/compress - Optimizes text using Google Gemini AI
 */

const express = require('express');
const router = express.Router();
const { chunkText, estimateTokens } = require('../utils/textChunker');
const { processChunks } = require('../utils/geminiProcessor');

/**
 * POST /api/compress
 * Compresses and optimizes text input
 */
router.post('/compress', async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  console.log(`\n[${requestId}] ===== NEW COMPRESSION REQUEST =====`);
  console.log(`[${requestId}] Request received at: ${new Date().toISOString()}`);

  try {
    const { text, compressionLevel } = req.body;

    console.log(`[${requestId}] Text length: ${text?.length || 0} characters`);
    console.log(`[${requestId}] Compression level: ${compressionLevel || 'balanced'}`);

    // Validation
    if (!text || typeof text !== 'string') {
      console.log(`[${requestId}] ✗ Validation failed: Invalid text input`);
      return res.status(400).json({
        error: 'Text is required and must be a string',
        code: 'INVALID_INPUT'
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text cannot be empty',
        code: 'EMPTY_INPUT'
      });
    }

    // Max character limit: 500K characters
    if (text.length > 500000) {
      return res.status(400).json({
        error: 'Text exceeds maximum length of 500,000 characters',
        code: 'TEXT_TOO_LARGE'
      });
    }

    // Validate compression level
    const validLevels = ['aggressive', 'balanced', 'minimal'];
    const level = compressionLevel || 'balanced';

    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: 'Invalid compression level. Must be: aggressive, balanced, or minimal',
        code: 'INVALID_COMPRESSION_LEVEL'
      });
    }

    // Calculate original token count
    const originalTokens = estimateTokens(text);
    console.log(`[${requestId}] Original tokens: ${originalTokens}`);

    // Determine if chunking is needed (chunk if > 15K characters to prevent timeouts)
    let chunks;
    if (text.length > 15000) {
      // Use smaller chunks (10K) to prevent API timeouts and speed up processing
      console.log(`[${requestId}] Text exceeds 15K chars, chunking...`);
      chunks = chunkText(text, 10000);
      console.log(`[${requestId}] Created ${chunks.length} chunks`);
      chunks.forEach((chunk, i) => {
        console.log(`[${requestId}]   Chunk ${i + 1}: ${chunk.length} characters`);
      });
    } else {
      console.log(`[${requestId}] Text under 30K chars, no chunking needed`);
      chunks = [text];
    }

    console.log(`[${requestId}] Starting Gemini processing...`);
    const processStartTime = Date.now();

    // Process with Gemini
    const { summary, optimizedContent } = await processChunks(chunks, level, requestId);

    const processEndTime = Date.now();
    console.log(`[${requestId}] Gemini processing completed in ${((processEndTime - processStartTime) / 1000).toFixed(2)}s`);

    // Calculate optimized token count
    const optimizedTokens = estimateTokens(optimizedContent);
    console.log(`[${requestId}] Optimized tokens: ${optimizedTokens}`);

    // Calculate compression ratio
    const compressionRatio = Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100);
    console.log(`[${requestId}] Compression ratio: ${compressionRatio}%`);

    // Calculate processing time
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[${requestId}] Total request time: ${processingTime}s`);

    // Send response
    console.log(`[${requestId}] Sending response to client...`);
    res.json({
      summary,
      optimizedContent,
      originalTokens,
      optimizedTokens,
      compressionRatio: `${compressionRatio}%`,
      processingTime: parseFloat(processingTime)
    });

    console.log(`[${requestId}] ===== REQUEST COMPLETED SUCCESSFULLY =====\n`);

  } catch (error) {
    const errorTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[${requestId}] ✗✗✗ ERROR OCCURRED after ${errorTime}s ✗✗✗`);
    console.error(`[${requestId}] Error type: ${error.constructor.name}`);
    console.error(`[${requestId}] Error code: ${error.code}`);
    console.error(`[${requestId}] Error message: ${error.message}`);
    console.error(`[${requestId}] Full error:`, error);

    // Handle specific error types
    if (error.message.includes('timeout') || error.code === 'ETIMEDOUT') {
      console.log(`[${requestId}] Detected timeout error`);
      return res.status(408).json({
        error: 'Request timeout. The text might be too large. Please try with smaller text.',
        code: 'TIMEOUT',
        suggestion: 'Try reducing the text size or splitting it into smaller parts.'
      });
    }

    if (error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again in a moment.',
        code: 'RATE_LIMIT'
      });
    }

    if (error.message.includes('API key')) {
      return res.status(500).json({
        error: 'API configuration error. Please contact support.',
        code: 'API_CONFIG_ERROR'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Processing failed. Text may be too large or contain unsupported content.',
      code: 'PROCESSING_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
