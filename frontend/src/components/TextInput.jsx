import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const TextInput = ({ value, onChange, disabled = false }) => {
  const charCount = value.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste your large context here..."
          className="glass-input w-full rounded-xl p-4 resize-none font-mono text-sm"
          style={{ minHeight: '300px' }}
        />
        <div className="absolute bottom-8 right-8 text-gray-300/70 text-sm font-medium">
          {charCount.toLocaleString()} characters
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default TextInput;
