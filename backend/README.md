# ContextLess Backend

Backend API for the ContextLess text optimization tool, powered by Google Gemini AI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### POST /api/compress

Optimizes and compresses text using Google Gemini AI.

**Request Body:**
```json
{
  "text": "Your large text content here...",
  "compressionLevel": "balanced"
}
```

**Compression Levels:**
- `aggressive`: 70-80% compression (most concise)
- `balanced`: 60-70% compression (default)
- `minimal`: 40-50% compression (preserves more detail)

**Response:**
```json
{
  "summary": "Brief overview of the content",
  "optimizedContent": "Compressed and optimized text",
  "originalTokens": 15000,
  "optimizedTokens": 4500,
  "compressionRatio": "70%",
  "processingTime": 3.24
}
```

### GET /health

Health check endpoint.

## Features

- Handles texts up to 5M characters
- **⚡ Parallel chunk processing** - processes multiple chunks simultaneously for 5-8x speedup
- Automatic chunking for large texts (>15K chars)
- Smart chunking with 10K character chunks for optimal speed
- Context overlap between chunks for better processing
- Three compression levels (aggressive, balanced, minimal)
- Token estimation and compression ratio calculation
- **Optimized Gemini 2.5 Flash** with maxOutputTokens and temperature tuning
- Detailed progress logging with request IDs for debugging
- Extended timeout (5 minutes) for large text processing
- Comprehensive error handling with timeout detection
- CORS enabled for frontend integration

### Performance

- **73K characters**: ~8-12 seconds (8 chunks processed in parallel)
- **150K characters**: ~15-20 seconds (15 chunks processed in parallel)
- **Single chunk (<15K)**: ~3-5 seconds

## Project Structure

```
backend/
├── server.js              # Main server setup
├── routes/
│   └── compress.js        # Compression endpoint
├── utils/
│   ├── textChunker.js    # Text chunking utility
│   └── geminiProcessor.js # Gemini API integration
├── package.json
└── .env                   # Environment variables
```

## Error Handling

The API returns structured error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Error Codes:**
- `INVALID_INPUT`: Missing or invalid text input
- `EMPTY_INPUT`: Text is empty
- `TEXT_TOO_LARGE`: Text exceeds 5M character limit
- `INVALID_COMPRESSION_LEVEL`: Invalid compression level specified
- `RATE_LIMIT`: API rate limit exceeded
- `API_CONFIG_ERROR`: API key configuration issue
- `PROCESSING_ERROR`: General processing error

## Requirements

- Node.js 14+
- Google Gemini API key (get one at https://makersuite.google.com/app/apikey)
- npm or yarn
