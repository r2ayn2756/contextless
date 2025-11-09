import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, TrendingDown } from 'lucide-react';
import GlassCard from './GlassCard';

const OptimizedOutput = ({ result }) => {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Stats Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-4 flex-wrap"
      >
        <div className="glass-card px-6 py-3 rounded-full flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-green-300" />
          <span className="text-white font-semibold">
            {result.compressionRatio} reduction
          </span>
        </div>
        <div className="glass-card px-6 py-3 rounded-full">
          <span className="text-gray-200">
            {result.originalTokens.toLocaleString()} → {result.optimizedTokens.toLocaleString()} tokens
          </span>
        </div>
        <div className="glass-card px-6 py-3 rounded-full">
          <span className="text-gray-200">
            {result.processingTime}s
          </span>
        </div>
      </motion.div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Summary</h3>
            <button
              onClick={() => copyToClipboard(result.summary, 'summary')}
              className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-gray-100"
            >
              {copiedSection === 'summary' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
            {result.summary}
          </p>
        </GlassCard>
      </motion.div>

      {/* Optimized Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Optimized Content</h3>
            <button
              onClick={() => copyToClipboard(result.optimizedContent, 'content')}
              className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-gray-100"
            >
              {copiedSection === 'content' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-gray-100 leading-relaxed whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
            {result.optimizedContent}
          </pre>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default OptimizedOutput;
