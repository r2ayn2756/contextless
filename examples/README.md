# ContextLess API - Client Examples

This directory contains example client implementations demonstrating how to use the ContextLess API from different programming languages and tools.

## Available Examples

### 1. Node.js Client (`client.js`)

A complete Node.js client implementation with error handling and examples.

**Setup:**
```bash
npm install
```

**Usage:**
```bash
node client.js
```

**As a Module:**
```javascript
const { compressText, healthCheck } = require('./client');

// Use in your application
const result = await compressText('Your text here', 'balanced');
```

---

### 2. Python Client (`client.py`)

A Python client class with comprehensive error handling.

**Requirements:**
```bash
pip install requests
```

**Usage:**
```bash
python client.py
```

**As a Module:**
```python
from client import ContextLessClient

client = ContextLessClient()
result = client.compress_text('Your text here', 'balanced')
```

---

### 3. cURL Examples (`curl-examples.sh`)

Shell script with various cURL examples for testing the API.

**Usage (Linux/Mac):**
```bash
chmod +x curl-examples.sh
./curl-examples.sh
```

**Usage (Windows Git Bash):**
```bash
bash curl-examples.sh
```

**Individual Commands:**
```bash
# Health check
curl http://localhost:3001/health

# Compress text
curl -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text...", "compressionLevel": "balanced"}'
```

---

## Configuration

### Environment Variables

Set these environment variables to configure the clients:

```bash
# API endpoint (default: http://localhost:3001)
export CONTEXTLESS_API_URL=http://localhost:3001

# Optional: API key if authentication is enabled
export CONTEXTLESS_API_KEY=your_api_key_here
```

### Windows (PowerShell):
```powershell
$env:CONTEXTLESS_API_URL="http://localhost:3001"
$env:CONTEXTLESS_API_KEY="your_api_key_here"
```

---

## Quick Start

1. **Make sure the ContextLess API server is running:**
   ```bash
   cd ../backend
   npm start
   ```

2. **Run an example client:**
   ```bash
   # Node.js
   npm install
   node client.js

   # Python
   python client.py

   # cURL
   bash curl-examples.sh
   ```

---

## API Response Format

All successful API calls return a JSON object:

```json
{
  "summary": "Brief 2-3 sentence summary",
  "optimizedContent": "Compressed text content",
  "originalTokens": 1500,
  "optimizedTokens": 450,
  "compressionRatio": "70%",
  "processingTime": 2.3
}
```

---

## Error Handling

The API returns error responses with this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `INVALID_INPUT` - Invalid or missing text
- `EMPTY_INPUT` - Empty text provided
- `TEXT_TOO_LARGE` - Text exceeds 500K characters
- `INVALID_COMPRESSION_LEVEL` - Invalid compression level
- `RATE_LIMIT` - Rate limit exceeded
- `PROCESSING_ERROR` - General processing error

---

## Integration Examples

### Express.js Middleware
```javascript
const { compressText } = require('./examples/client');

app.post('/process', async (req, res) => {
  try {
    const result = await compressText(req.body.text, 'balanced');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Python Flask Application
```python
from flask import Flask, request, jsonify
from client import ContextLessClient

app = Flask(__name__)
client = ContextLessClient()

@app.route('/process', methods=['POST'])
def process_text():
    try:
        text = request.json.get('text')
        result = client.compress_text(text, 'balanced')
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### CLI Tool
```bash
#!/bin/bash
# Simple CLI wrapper for the API

TEXT="$1"
LEVEL="${2:-balanced}"

curl -s -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"$TEXT\", \"compressionLevel\": \"$LEVEL\"}" \
  | jq -r '.optimizedContent'
```

---

## Testing

Test the API with different scenarios:

```bash
# Small text
curl -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d '{"text": "Short text here", "compressionLevel": "balanced"}'

# Large text (file)
curl -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d @large_text.json

# With timeout
curl --max-time 60 -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d '{"text": "...", "compressionLevel": "aggressive"}'
```

---

## Support

For API documentation, see [`../API_DOCUMENTATION.md`](../API_DOCUMENTATION.md)

For issues or questions, please refer to the main project repository.
