/**
 * Text Chunker Utility
 * Splits large text into smaller chunks at sentence boundaries
 * Maintains context overlap between chunks for better processing
 */

/**
 * Splits text into chunks at sentence boundaries
 * @param {string} text - The text to chunk
 * @param {number} maxChunkSize - Maximum size of each chunk in characters (default: 50000)
 * @returns {string[]} Array of text chunks
 */
function chunkText(text, maxChunkSize = 50000) {
  // If text is smaller than max chunk size, return as single chunk
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks = [];
  const overlapSize = 500; // Characters to overlap between chunks for context

  // Split text into sentences (basic sentence detection)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  let currentChunk = '';
  let previousOverlap = '';

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];

    // If adding this sentence would exceed max chunk size
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push(currentChunk.trim());

      // Create overlap from end of current chunk
      const words = currentChunk.trim().split(' ');
      previousOverlap = words.slice(-Math.floor(overlapSize / 5)).join(' ') + ' ';

      // Start new chunk with overlap
      currentChunk = previousOverlap + sentence;
    } else {
      // Add sentence to current chunk
      currentChunk += sentence;
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Estimates token count more accurately
 * @param {string} text - The text to estimate tokens for
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  // More accurate estimation:
  // 1. Count words (split by whitespace)
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;

  // 2. Average token count per word:
  //    - Short common words (the, is, a, to): 1 token
  //    - Medium words (about, when, where): 1 token
  //    - Long words (international, understanding): 2-3 tokens
  //    - Average: ~1.3 tokens per word

  // 3. Add tokens for punctuation and special characters
  //    Roughly 10% additional tokens for punctuation

  const estimatedTokens = Math.ceil(wordCount * 1.3);

  return estimatedTokens;
}

module.exports = {
  chunkText,
  estimateTokens
};
