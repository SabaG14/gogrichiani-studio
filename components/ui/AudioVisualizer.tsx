
import React from 'react';
import { motion } from 'framer-motion';

export const AudioVisualizer: React.FC = () => {
  return (
    <div className="flex items-end justify-center gap-1 h-16 w-full overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-cyan-400"
          animate={{
            height: [10, Math.random() * 60 + 10, 10],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.05
          }}
        />
      ))}
    </div>
  );
};
