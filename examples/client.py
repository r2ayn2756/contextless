"""
ContextLess API Client - Python Example
Demonstrates how to use the ContextLess API from Python applications
"""

import os
import sys
import requests
from typing import Dict, Optional
import json


# Configuration
API_BASE_URL = os.getenv('CONTEXTLESS_API_URL', 'http://localhost:3001')
API_KEY = os.getenv('CONTEXTLESS_API_KEY')  # Optional: only if authentication is enabled


class ContextLessClient:
    """Client for the ContextLess text compression API"""

    def __init__(self, base_url: str = API_BASE_URL, api_key: Optional[str] = API_KEY):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.session = requests.Session()

        # Set default headers
        self.session.headers.update({
            'Content-Type': 'application/json'
        })

        # Add API key if configured
        if self.api_key:
            self.session.headers.update({
                'X-API-Key': self.api_key
            })

    def health_check(self) -> bool:
        """Check if the API is healthy and running"""
        try:
            response = self.session.get(
                f'{self.base_url}/health',
                timeout=5
            )
            return response.status_code == 200 and response.json().get('status') == 'OK'
        except Exception as e:
            print(f"Health check failed: {e}")
            return False

    def compress_text(
        self,
        text: str,
        compression_level: str = 'balanced'
    ) -> Dict:
        """
        Compress text using the ContextLess API

        Args:
            text: Text to compress
            compression_level: 'aggressive', 'balanced', or 'minimal'

        Returns:
            Dictionary with optimized content and metadata

        Raises:
            requests.exceptions.RequestException: If the API request fails
        """
        if compression_level not in ['aggressive', 'balanced', 'minimal']:
            raise ValueError("compression_level must be 'aggressive', 'balanced', or 'minimal'")

        payload = {
            'text': text,
            'compressionLevel': compression_level
        }

        try:
            response = self.session.post(
                f'{self.base_url}/api/compress',
                json=payload,
                timeout=60  # 60 second timeout for large texts
            )

            # Raise exception for error status codes
            response.raise_for_status()

            return response.json()

        except requests.exceptions.HTTPError as e:
            error_data = e.response.json() if e.response.content else {}
            error_msg = error_data.get('error', str(e))
            raise Exception(f"API Error: {error_msg}")

        except requests.exceptions.Timeout:
            raise Exception("Request timed out. The text may be too large.")

        except requests.exceptions.ConnectionError:
            raise Exception("Could not connect to API. Is the server running?")

        except Exception as e:
            raise Exception(f"Unexpected error: {str(e)}")


def main():
    """Example usage of the ContextLess API client"""

    # Initialize client
    client = ContextLessClient()

    # Health check
    print("Checking API health...")
    if not client.health_check():
        print("❌ API is not responding. Make sure the server is running.")
        sys.exit(1)

    print("✓ API is healthy\n")

    # Example text to compress
    large_text = """
    Artificial intelligence (AI) is intelligence demonstrated by machines,
    as opposed to intelligence displayed by humans or animals. Leading AI
    textbooks define the field as the study of "intelligent agents": any
    system that perceives its environment and takes actions that maximize
    its chance of achieving its goals. Some popular accounts use the term
    "artificial intelligence" to describe machines that mimic "cognitive"
    functions that humans associate with the human mind, such as "learning"
    and "problem solving". This is a longer text that could benefit from
    compression to reduce token usage while maintaining the essential
    information about what artificial intelligence is and how it's defined
    in academic contexts.
    """.strip()

    print(f"Original text length: {len(large_text)} characters")
    print("Compressing with balanced mode...\n")

    try:
        # Compress the text
        result = client.compress_text(large_text, 'balanced')

        # Display results
        print("=== COMPRESSION RESULTS ===\n")
        print(f"Summary: {result['summary']}")
        print("\nCompression Stats:")
        print(f"  - Original tokens: {result['originalTokens']}")
        print(f"  - Optimized tokens: {result['optimizedTokens']}")
        print(f"  - Compression ratio: {result['compressionRatio']}")
        print(f"  - Processing time: {result['processingTime']} seconds")
        print("\nOptimized Content:")
        print(result['optimizedContent'])

        # Try different compression levels
        print("\n\n=== TESTING AGGRESSIVE COMPRESSION ===\n")
        aggressive_result = client.compress_text(large_text, 'aggressive')
        print(f"Aggressive compression ratio: {aggressive_result['compressionRatio']}")
        print(f"Aggressive optimized length: {len(aggressive_result['optimizedContent'])} characters")

        # Try minimal compression
        print("\n\n=== TESTING MINIMAL COMPRESSION ===\n")
        minimal_result = client.compress_text(large_text, 'minimal')
        print(f"Minimal compression ratio: {minimal_result['compressionRatio']}")
        print(f"Minimal optimized length: {len(minimal_result['optimizedContent'])} characters")

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
