/**
 * API Key Authentication Middleware
 * Optional authentication for API access control
 */

/**
 * Validates API key from request headers
 * Set API_KEY in .env to enable authentication
 * If API_KEY is not set, all requests are allowed (development mode)
 */
function authenticateApiKey(req, res, next) {
  // If no API_KEY is configured, skip authentication (dev mode)
  if (!process.env.API_KEY) {
    return next();
  }

  // Extract API key from headers
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  // Validate API key
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized: API key required. Include X-API-Key header or Authorization: Bearer token',
      code: 'MISSING_API_KEY'
    });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid API key',
      code: 'INVALID_API_KEY'
    });
  }

  // API key is valid, proceed
  next();
}

/**
 * Rate limiting configuration (optional enhancement)
 * Uncomment and install express-rate-limit to enable
 */
// const rateLimit = require('express-rate-limit');
//
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: {
//     error: 'Too many requests from this IP, please try again later',
//     code: 'RATE_LIMIT_EXCEEDED'
//   }
// });

module.exports = {
  authenticateApiKey,
  // apiLimiter // Uncomment when rate limiting is enabled
};
