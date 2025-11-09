import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import TextInput from './components/TextInput';
import CompressionControls from './components/CompressionControls';
import ProcessingStatus from './components/ProcessingStatus';
import OptimizedOutput from './components/OptimizedOutput';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [inputText, setInputText] = useState('');
  const [compressionLevel, setCompressionLevel] = useState('balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCompress = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to optimize');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/compress`,
        {
          text: inputText,
          compressionLevel: compressionLevel
        },
        {
          timeout: 300000 // 5 minute timeout to match backend
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error('Compression error:', err);

      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. The text might be too large. Please try with smaller text.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === 'Network Error') {
        setError('Connection failed. Please make sure the backend server is running.');
      } else {
        setError('Processing failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-blue-300 animate-pulse" />
            <h1 className="text-5xl font-bold text-white text-glow">
              ContextLess
            </h1>
            <Sparkles className="w-10 h-10 text-purple-300 animate-pulse" />
          </div>
          <p className="text-gray-200 text-lg">
            Compress your large contexts into token-efficient summaries
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <div className="glass-card rounded-xl p-4 border-red-400/50 bg-red-500/10 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                <p className="text-red-200">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="space-y-6">
          {!result ? (
            <>
              {/* Input Section */}
              <TextInput
                value={inputText}
                onChange={setInputText}
                disabled={isProcessing}
              />

              {/* Controls */}
              <CompressionControls
                selectedLevel={compressionLevel}
                onLevelChange={setCompressionLevel}
                onCompress={handleCompress}
                disabled={isProcessing}
                hasText={inputText.trim().length > 0}
              />

              {/* Processing Status */}
              <AnimatePresence>
                {isProcessing && <ProcessingStatus />}
              </AnimatePresence>
            </>
          ) : (
            <>
              {/* Results */}
              <OptimizedOutput result={result} />

              {/* Reset Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleReset}
                  className="glass-button px-8 py-3 rounded-xl font-semibold text-gray-100 hover:text-white"
                >
                  Optimize Another Text
                </button>
              </motion.div>
            </>
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-gray-300/60 text-sm"
        >
          <p>Powered by Google Gemini AI</p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
