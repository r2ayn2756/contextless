# ContextLess

An AI-powered context optimization tool that compresses large text into token-efficient summaries using Google Gemini AI.

**Available as both a Web Application and RESTful API** - Use it with a beautiful UI or integrate it into your own tools and applications.

## Features

### Web Interface
- Beautiful glassmorphism UI design
- Three compression levels: Aggressive, Balanced, and Minimal
- Real-time character counting
- Token usage statistics
- Processing status with animations
- Copy-to-clipboard functionality
- Responsive design

### API Features
- RESTful API for programmatic access
- Client libraries for Node.js and Python
- Optional API key authentication
- CORS enabled for cross-origin requests
- Handles up to 5M characters
- Automatic text chunking for large inputs

## Tech Stack

### Backend
- Node.js + Express
- Google Gemini AI API
- CORS enabled for cross-origin requests
- Intelligent text chunking for large inputs

### Frontend
- React + Vite
- Tailwind CSS with custom glassmorphism design
- Framer Motion for smooth animations
- Axios for API communication
- Lucide React for beautiful icons

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

4. Start the backend server:
```bash
npm start
```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional - defaults to localhost:3001):
```
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

### Using the Web Interface

1. Open the frontend in your browser (`http://localhost:5173`)
2. Paste your large text into the input area
3. Select a compression level:
   - **Aggressive**: Maximum compression (70-80%)
   - **Balanced**: Best balance between compression and detail retention (60-70%)
   - **Minimal**: Light touch, preserves more context (40-50%)
4. Click "Optimize Text"
5. View your optimized content and statistics
6. Copy the results using the copy buttons

### Using as an API

ContextLess can be used as a standalone API for integration with other tools. See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

**Quick Example (cURL):**
```bash
curl -X POST http://localhost:3001/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your large text here...",
    "compressionLevel": "balanced"
  }'
```

**Quick Example (Node.js):**
```javascript
const axios = require('axios');

const result = await axios.post('http://localhost:3001/api/compress', {
  text: 'Your text here...',
  compressionLevel: 'balanced'
});

console.log(result.data.optimizedContent);
```

**Quick Example (Python):**
```python
import requests

response = requests.post('http://localhost:3001/api/compress', json={
    'text': 'Your text here...',
    'compressionLevel': 'balanced'
})

print(response.json()['optimizedContent'])
```

See the [examples/](examples/) directory for complete client implementations in Node.js, Python, and more.

## API Endpoints

### POST /api/compress

Compresses and optimizes text input.

**Request Body:**
```json
{
  "text": "Your large text here...",
  "compressionLevel": "aggressive" | "balanced" | "minimal"
}
```

**Response:**
```json
{
  "summary": "Brief summary of content",
  "optimizedContent": "Compressed text",
  "originalTokens": 15000,
  "optimizedTokens": 3000,
  "compressionRatio": "80%",
  "processingTime": 5.2
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-09T17:00:00.000Z",
  "service": "ContextLess API"
}
```

## Features in Detail

### Text Chunking
Large texts (>100K characters) are automatically split into manageable chunks with context overlap to ensure coherent optimization.

### Error Handling
- Network error detection
- Rate limit handling
- Input validation
- User-friendly error messages

### Performance
- Handles up to 5M characters
- Optimized API calls with chunking
- 60-second timeout for large texts
- Non-blocking UI during processing

## Design System

The app features a stunning glassmorphism design:
- Purple to blue gradient background
- Glass cards with backdrop blur
- Smooth transitions and animations
- Responsive layout for all screen sizes
- Custom scrollbar styling

## Testing the API

A test suite is included to verify the API is working correctly:

```bash
# Install dependencies (if not already done)
npm install axios

# Run tests
node test-api.js
```

This will run a series of tests including health checks, compression tests, and error handling verification.

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for GitHub & Vercel
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[examples/README.md](examples/README.md)** - Client implementation examples
- **[Instructions.txt](Instructions.txt)** - Original implementation guide

## Use Cases

### For Developers
- Integrate text compression into your applications
- Reduce token usage for AI model inputs
- Preprocess large documents for LLM consumption
- Build CLI tools with the API

### For Content Creators
- Compress articles and documentation
- Optimize context for AI assistants
- Generate summaries from long-form content
- Reduce costs when using AI APIs

### For Data Scientists
- Preprocess datasets for NLP tasks
- Extract key information from large corpora
- Reduce prompt sizes for batch processing
- Create training data summaries

## Deployment

### Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/contextless)

1. Click the button above or manually import your GitHub repository to Vercel
2. Add your `GEMINI_API_KEY` as an environment variable
3. Deploy!

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions including:**
- GitHub setup and pushing your code
- Vercel deployment (Dashboard & CLI)
- Environment variable configuration
- Custom domain setup
- Troubleshooting guide

### Other Hosting Platforms

The API can also be deployed to:

- **Railway**: One-click deploy from GitHub
- **Render**: Automatic deployments
- **Fly.io**: Global edge deployment
- **Docker**: Use the provided Dockerfile pattern
- **AWS/GCP/Azure**: Standard Node.js deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for platform-specific instructions.

## License

MIT

## Credits

Powered by Google Gemini AI
