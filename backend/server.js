/**
 * ContextLess Backend Server
 * Express server with Google Gemini AI integration for text optimization
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { validateApiKey } = require('./utils/geminiProcessor');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allows API access from any origin
// For production, specify allowed origins: { origin: ['https://yourapp.com'] }
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS for API and frontend communication
app.use(express.json({ limit: '50mb' })); // Parse JSON with 50mb limit for large texts
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Increase server timeout for long-running requests (5 minutes)
app.use((req, res, next) => {
  req.setTimeout(300000); // 5 minutes for request
  res.setTimeout(300000); // 5 minutes for response
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'ContextLess API'
  });
});

// Optional: API authentication middleware
// Uncomment the next line to enable API key authentication
// Set API_KEY in .env to activate
const { authenticateApiKey } = require('./middleware/auth');
// app.use('/api', authenticateApiKey); // Uncomment to enable auth

// Mount routes
const compressRoute = require('./routes/compress');
app.use('/api', compressRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server with API key validation
async function startServer() {
  try {
    // Validate Gemini API key on startup
    console.log('Validating Gemini API key...');
    const isValid = await validateApiKey();

    if (!isValid) {
      console.error('\n❌ STARTUP FAILED: Invalid or missing Gemini API key');
      console.error('Please set GEMINI_API_KEY in your .env file\n');
      process.exit(1);
    }

    console.log('✓ API key validated successfully');

    // Start listening
    app.listen(PORT, () => {
      console.log('\n🚀 ContextLess Backend Server Running');
      console.log(`   Port: ${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log(`   API: http://localhost:${PORT}/api/compress`);
      console.log('\n   Ready to optimize text! 📝✨\n');
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM signal. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT signal. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
