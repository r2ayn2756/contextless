import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import GlassCard from './GlassCard';

const ProcessingStatus = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className="w-16 h-16 text-blue-300" />
        </motion.div>

        <motion.p
          className="mt-6 text-xl font-medium text-gray-100"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Processing your context...
        </motion.p>

        <p className="mt-2 text-sm text-gray-300/70">
          This may take a few moments for large texts
        </p>
      </GlassCard>
    </motion.div>
  );
};

export default ProcessingStatus;
