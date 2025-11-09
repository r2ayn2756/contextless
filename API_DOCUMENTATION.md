# ContextLess API Documentation

## Overview

ContextLess provides a RESTful API for AI-powered text compression and optimization. This API allows external tools and applications to compress large text into token-efficient summaries while preserving essential information.

**Base URL**: `http://localhost:3001` (or your deployed URL)

---

## Authentication

Currently, the API is open for development. For production use, consider implementing API key authentication (see Configuration section).

---

## Endpoints

### 1. Health Check

Check if the API is running and healthy.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2025-11-09T10:00:00.000Z",
  "service": "ContextLess API"
}
```

---

### 2. Compress Text

Optimize and compress text using AI.

**Endpoint**: `POST /api/compress`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "text": "Your large text content here...",
  "compressionLevel": "balanced"
}
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | The text to compress (max 500,000 characters) |
| `compressionLevel` | string | No | Compression level: `aggressive`, `balanced`, or `minimal`. Default: `balanced` |

**Compression Levels**:
- `aggressive`: 70-80% compression, extremely concise
- `balanced`: 60-70% compression, balance between brevity and completeness (default)
- `minimal`: 40-50% compression, preserves more context

**Success Response** (200 OK):
```json
{
  "summary": "Brief 2-3 sentence summary of the content",
  "optimizedContent": "The compressed and optimized text with only essential information",
  "originalTokens": 15000,
  "optimizedTokens": 3000,
  "compressionRatio": "80%",
  "processingTime": 5.2
}
```

**Error Responses**:

**400 Bad Request** - Invalid input:
```json
{
  "error": "Text is required and must be a string",
  "code": "INVALID_INPUT"
}
```

**429 Too Many Requests** - Rate limit exceeded:
```json
{
  "error": "Rate limit exceeded. Please try again in a moment.",
  "code": "RATE_LIMIT"
}
```

**500 Internal Server Error** - Processing failed:
```json
{
  "error": "Processing failed. Text may be too large or contain unsupported content.",
  "code": "PROCESSING_ERROR"
}
```

---

## Usage Examples

### cURL

```bash
# Health check
curl http://localhost:3001/health

# Compress text with balanced compression
curl -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your large text here...",
    "compressionLevel": "balanced"
  }'

# Aggressive compression
curl -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text...",
    "compressionLevel": "aggressive"
  }'
```

### JavaScript (Node.js)

```javascript
const axios = require('axios');

async function compressText(text, level = 'balanced') {
  try {
    const response = await axios.post('http://localhost:3001/api/compress', {
      text: text,
      compressionLevel: level
    });

    console.log('Summary:', response.data.summary);
    console.log('Compression:', response.data.compressionRatio);
    console.log('Optimized:', response.data.optimizedContent);

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
compressText('Your large text here...', 'balanced');
```

### JavaScript (Browser/Frontend)

```javascript
async function compressText(text, compressionLevel = 'balanced') {
  try {
    const response = await fetch('http://localhost:3001/api/compress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        compressionLevel: compressionLevel
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
}

// Usage
compressText('Your text here...', 'aggressive')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Python

```python
import requests
import json

def compress_text(text, compression_level='balanced'):
    """
    Compress text using the ContextLess API

    Args:
        text (str): Text to compress
        compression_level (str): 'aggressive', 'balanced', or 'minimal'

    Returns:
        dict: API response with optimized content
    """
    url = 'http://localhost:3001/api/compress'

    payload = {
        'text': text,
        'compressionLevel': compression_level
    }

    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()

        data = response.json()
        return data

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        raise

# Usage
if __name__ == '__main__':
    large_text = "Your large text content here..."

    result = compress_text(large_text, 'balanced')

    print(f"Summary: {result['summary']}")
    print(f"Compression Ratio: {result['compressionRatio']}")
    print(f"Original Tokens: {result['originalTokens']}")
    print(f"Optimized Tokens: {result['optimizedTokens']}")
    print(f"Processing Time: {result['processingTime']}s")
    print(f"\nOptimized Content:\n{result['optimizedContent']}")
```

### Ruby

```ruby
require 'net/http'
require 'json'
require 'uri'

def compress_text(text, compression_level = 'balanced')
  uri = URI('http://localhost:3001/api/compress')

  request = Net::HTTP::Post.new(uri)
  request.content_type = 'application/json'
  request.body = JSON.dump({
    text: text,
    compressionLevel: compression_level
  })

  response = Net::HTTP.start(uri.hostname, uri.port) do |http|
    http.request(request)
  end

  JSON.parse(response.body)
end

# Usage
result = compress_text('Your text here...', 'balanced')
puts "Summary: #{result['summary']}"
puts "Compression: #{result['compressionRatio']}"
```

---

## Rate Limits

The API processes requests sequentially to avoid rate limits with the underlying AI service. For large texts (>100K characters), the content is automatically chunked and processed in parts.

**Recommendations**:
- Add delays between requests if making multiple API calls
- Consider implementing request queuing for high-volume applications
- Monitor the `processingTime` field to estimate request duration

---

## Error Handling

Always implement proper error handling in your client code:

```javascript
async function safeCompress(text) {
  try {
    const result = await compressText(text);
    return result;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      if (error.response.status === 429) {
        // Rate limited - wait and retry
        await new Promise(resolve => setTimeout(resolve, 5000));
        return safeCompress(text);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
    } else {
      // Other errors
      console.error('Error:', error.message);
    }
    throw error;
  }
}
```

---

## Performance Considerations

- **Small texts (<50K chars)**: ~2-5 seconds
- **Medium texts (50-100K chars)**: ~5-10 seconds
- **Large texts (100-500K chars)**: ~10-30 seconds (processed in chunks)

**Tips**:
- Set appropriate timeout values (recommended: 60 seconds)
- Implement progress indicators for long-running requests
- Consider streaming responses for very large texts (future feature)

---

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3001
NODE_ENV=production

# Future: API Authentication
API_KEY=your_api_key_for_client_authentication
```

### Running the API

```bash
# Install dependencies
cd backend
npm install

# Start the server
npm start

# Or with nodemon for development
npm run dev
```

---

## Deployment

### Docker (Recommended)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

EXPOSE 3001

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t contextless-api .
docker run -p 3001:3001 -e GEMINI_API_KEY=your_key contextless-api
```

### Cloud Platforms

The API can be deployed to:
- **Railway**: Connect GitHub repo, set environment variables
- **Render**: Web service with auto-deploy from Git
- **Fly.io**: `fly launch` and `fly deploy`
- **AWS EC2/ECS**: Use provided Dockerfile
- **Google Cloud Run**: Serverless container deployment

---

## Security Recommendations

1. **API Key Authentication**: Implement API key validation (see implementation guide below)
2. **Rate Limiting**: Add express-rate-limit middleware
3. **CORS Configuration**: Restrict allowed origins in production
4. **Input Sanitization**: Already implemented
5. **HTTPS**: Use reverse proxy (nginx) or cloud provider SSL

### Adding API Key Authentication

```javascript
// middleware/auth.js
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or missing API key',
      code: 'AUTH_FAILED'
    });
  }

  next();
}

// In server.js
app.use('/api', authenticateApiKey);
```

Client usage with API key:
```bash
curl -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"text": "..."}'
```

---

## Support

For issues, questions, or feature requests, please contact the development team or open an issue in the project repository.

**API Version**: 1.0.0
**Last Updated**: 2025-11-09
