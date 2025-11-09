# Quick Start Guide - Using ContextLess as an API

This guide will help you get started using ContextLess as a RESTful API in under 5 minutes.

## Step 1: Start the API Server

```bash
# Install dependencies
cd backend
npm install

# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "PORT=3001" >> .env

# Start the server
npm start
```

You should see:
```
✓ API key validated successfully

🚀 ContextLess Backend Server Running
   Port: 3001
   Health: http://localhost:3001/health
   API: http://localhost:3001/api/compress
```

## Step 2: Test the API

### Option A: Using cURL (Command Line)

```bash
# Health check
curl http://localhost:3001/health

# Compress text
curl -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial intelligence is transforming the way we work and live. It enables machines to learn from experience and perform human-like tasks. AI applications include natural language processing, computer vision, and autonomous systems.",
    "compressionLevel": "balanced"
  }'
```

### Option B: Using Node.js

```bash
# Install axios in your project
npm install axios

# Create test.js
cat > test.js << 'EOF'
const axios = require('axios');

async function test() {
  const result = await axios.post('http://localhost:3001/api/compress', {
    text: 'Your large text here...',
    compressionLevel: 'balanced'
  });

  console.log('Original:', result.data.originalTokens, 'tokens');
  console.log('Optimized:', result.data.optimizedTokens, 'tokens');
  console.log('Saved:', result.data.compressionRatio);
  console.log('\nOptimized text:', result.data.optimizedContent);
}

test();
EOF

# Run it
node test.js
```

### Option C: Using Python

```bash
# Install requests
pip install requests

# Create test.py
cat > test.py << 'EOF'
import requests

response = requests.post('http://localhost:3001/api/compress', json={
    'text': 'Your large text here...',
    'compressionLevel': 'balanced'
})

result = response.json()
print(f"Original: {result['originalTokens']} tokens")
print(f"Optimized: {result['optimizedTokens']} tokens")
print(f"Saved: {result['compressionRatio']}")
print(f"\nOptimized text: {result['optimizedContent']}")
EOF

# Run it
python test.py
```

## Step 3: Use in Your Application

### Node.js Example

```javascript
// compression-service.js
const axios = require('axios');

class CompressionService {
  constructor(apiUrl = 'http://localhost:3001') {
    this.apiUrl = apiUrl;
  }

  async compress(text, level = 'balanced') {
    try {
      const response = await axios.post(`${this.apiUrl}/api/compress`, {
        text,
        compressionLevel: level
      }, { timeout: 60000 });

      return response.data;
    } catch (error) {
      throw new Error(`Compression failed: ${error.message}`);
    }
  }
}

// Usage
const service = new CompressionService();
const result = await service.compress('Your text...', 'aggressive');
```

### Python Example

```python
# compression_service.py
import requests

class CompressionService:
    def __init__(self, api_url='http://localhost:3001'):
        self.api_url = api_url

    def compress(self, text, level='balanced'):
        try:
            response = requests.post(
                f'{self.api_url}/api/compress',
                json={'text': text, 'compressionLevel': level},
                timeout=60
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'Compression failed: {str(e)}')

# Usage
service = CompressionService()
result = service.compress('Your text...', 'aggressive')
```

## Compression Levels

Choose the right level for your use case:

| Level | Compression | Use Case |
|-------|-------------|----------|
| `aggressive` | 70-80% | Maximum token savings, summaries |
| `balanced` | 60-70% | Best for most use cases |
| `minimal` | 40-50% | Preserve more detail and context |

## Response Format

All successful requests return:

```json
{
  "summary": "Brief 2-3 sentence summary",
  "optimizedContent": "The compressed text",
  "originalTokens": 1000,
  "optimizedTokens": 300,
  "compressionRatio": "70%",
  "processingTime": 2.5
}
```

## Common Use Cases

### 1. Reduce LLM Prompt Size

```javascript
// Before sending to OpenAI/Claude
const largeContext = fs.readFileSync('large-doc.txt', 'utf8');
const compressed = await compress(largeContext, 'balanced');

const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: compressed.optimizedContent },
    { role: 'user', content: 'Your question here' }
  ]
});
```

### 2. Summarize Documents

```python
# Summarize a research paper
with open('paper.txt', 'r') as f:
    paper = f.read()

result = service.compress(paper, 'aggressive')
print(result['summary'])  # Quick summary
print(result['optimizedContent'])  # Key points
```

### 3. Batch Processing

```javascript
// Process multiple documents
const documents = ['doc1.txt', 'doc2.txt', 'doc3.txt'];

for (const doc of documents) {
  const text = fs.readFileSync(doc, 'utf8');
  const compressed = await compress(text, 'balanced');

  console.log(`${doc}: Saved ${compressed.compressionRatio}`);
  fs.writeFileSync(`compressed-${doc}`, compressed.optimizedContent);
}
```

## Error Handling

Always handle errors properly:

```javascript
try {
  const result = await compress(text);
} catch (error) {
  if (error.response?.status === 400) {
    console.error('Invalid input:', error.response.data.error);
  } else if (error.response?.status === 429) {
    console.error('Rate limited, wait and retry');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Next Steps

- Read the full [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Check out [examples/](examples/) for complete client implementations
- Enable API authentication for production use
- Deploy to a cloud platform for remote access

## Troubleshooting

**API not responding?**
- Check if the server is running: `curl http://localhost:3001/health`
- Verify your Gemini API key is set in `.env`
- Check server logs for errors

**Slow responses?**
- Large texts take longer (10-30s for 100K+ chars)
- Set appropriate timeout values (60s recommended)
- Consider chunking very large texts before sending

**Rate limits?**
- The API processes requests sequentially
- Add delays between rapid requests
- Consider implementing a request queue

## Support

For more help:
- Full API reference: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Examples: [examples/README.md](examples/README.md)
- Test your setup: `npm test` or `node test-api.js`
