#!/bin/bash

# ContextLess API - cURL Examples
# Demonstrates how to use the API with cURL commands

API_URL="http://localhost:3001"

echo "========================================="
echo "ContextLess API - cURL Examples"
echo "========================================="
echo ""

# 1. Health Check
echo "1. Health Check"
echo "Command: curl ${API_URL}/health"
echo ""
curl -s ${API_URL}/health | json_pp
echo ""
echo ""

# 2. Basic Compression (Balanced)
echo "2. Basic Text Compression (Balanced)"
echo ""
curl -s -X POST ${API_URL}/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial intelligence is intelligence demonstrated by machines. AI systems can perceive their environment and take actions to achieve goals. Machine learning and deep learning are subfields of AI that focus on learning from data.",
    "compressionLevel": "balanced"
  }' | json_pp
echo ""
echo ""

# 3. Aggressive Compression
echo "3. Aggressive Compression"
echo ""
curl -s -X POST ${API_URL}/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet at least once. It is commonly used for testing typewriters and computer keyboards, displaying examples of fonts, and other applications involving text.",
    "compressionLevel": "aggressive"
  }' | json_pp
echo ""
echo ""

# 4. Minimal Compression
echo "4. Minimal Compression"
echo ""
curl -s -X POST ${API_URL}/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Cloud computing is the delivery of computing services over the Internet. Services include servers, storage, databases, networking, software, analytics, and intelligence. Cloud computing offers faster innovation, flexible resources, and economies of scale.",
    "compressionLevel": "minimal"
  }' | json_pp
echo ""
echo ""

# 5. With API Key (if authentication is enabled)
echo "5. With API Key Authentication"
echo "Uncomment in server.js to enable authentication"
echo ""
# Uncomment the following lines if API key authentication is enabled:
# export API_KEY="your_api_key_here"
# curl -s -X POST ${API_URL}/api/compress \
#   -H "Content-Type: application/json" \
#   -H "X-API-Key: ${API_KEY}" \
#   -d '{
#     "text": "Your text here...",
#     "compressionLevel": "balanced"
#   }' | json_pp
echo ""

# 6. Error Handling - Empty Text
echo "6. Error Handling Example - Empty Text"
echo ""
curl -s -X POST ${API_URL}/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "",
    "compressionLevel": "balanced"
  }' | json_pp
echo ""
echo ""

# 7. Error Handling - Invalid Compression Level
echo "7. Error Handling Example - Invalid Compression Level"
echo ""
curl -s -X POST ${API_URL}/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Some text here",
    "compressionLevel": "invalid_level"
  }' | json_pp
echo ""
echo ""

# 8. Large Text Example
echo "8. Large Text Processing"
echo ""
curl -s -X POST ${API_URL}/api/compress \
  -H "Content-Type: application/json" \
  -d @- <<'EOF' | json_pp
{
  "text": "The history of artificial intelligence (AI) began in antiquity with myths, stories and rumors of artificial beings endowed with intelligence or consciousness by master craftsmen. The seeds of modern AI were planted by classical philosophers who attempted to describe the process of human thinking as the mechanical manipulation of symbols. This work culminated in the invention of the programmable digital computer in the 1940s, a machine based on the abstract essence of mathematical reasoning. This device and the ideas behind it inspired a handful of scientists to begin seriously discussing the possibility of building an electronic brain. The field of AI research was founded at a workshop held on the campus of Dartmouth College during the summer of 1956. The attendees became the leaders of AI research for decades. They and their students produced programs that the press described as 'astonishing': computers were learning checkers strategies, solving word problems in algebra, proving logical theorems and speaking English. By the middle of the 1960s, research in the U.S. was heavily funded by the Department of Defense and laboratories had been established around the world. AI's founders were profoundly optimistic about the future of the new field: Herbert Simon predicted that 'machines will be capable, within twenty years, of doing any work a man can do'. Marvin Minsky agreed, writing that 'within a generation the problem of creating artificial intelligence will substantially be solved'.",
  "compressionLevel": "balanced"
}
EOF
echo ""
echo ""

echo "========================================="
echo "Examples completed!"
echo "========================================="
