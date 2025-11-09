import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart3, Leaf, Sparkles } from 'lucide-react';

const compressionOptions = [
  {
    id: 'aggressive',
    label: 'Aggressive',
    icon: Zap,
    description: 'Maximum compression'
  },
  {
    id: 'balanced',
    label: 'Balanced',
    icon: BarChart3,
    description: 'Best balance'
  },
  {
    id: 'minimal',
    label: 'Minimal',
    icon: Leaf,
    description: 'Light touch'
  }
];

const CompressionControls = ({ selectedLevel, onLevelChange, onCompress, disabled = false, hasText }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-4"
    >
      {/* Compression Level Buttons */}
      <div className="flex gap-3 flex-wrap">
        {compressionOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedLevel === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onLevelChange(option.id)}
              disabled={disabled}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300 ease-in-out
                ${isSelected
                  ? 'glass-button-active text-white'
                  : 'glass-button text-gray-100 hover:text-white'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Compress Button */}
      <button
        onClick={onCompress}
        disabled={disabled || !hasText}
        className="
          w-full px-8 py-4 rounded-xl font-semibold text-lg
          bg-gradient-accent text-white
          shadow-glass-glow
          transition-all duration-300 ease-in-out
          hover:scale-[1.02] hover:shadow-glass-lg
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:scale-100
          flex items-center justify-center gap-2
        "
      >
        <Sparkles className="w-5 h-5" />
        <span>Optimize Text</span>
      </button>
    </motion.div>
  );
};

export default CompressionControls;
