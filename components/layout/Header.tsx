
import React from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from '../ui/GlitchText';
import { AudioVisualizer } from '../ui/AudioVisualizer';

export const Header: React.FC = () => {
  return (
    <header className="container mx-auto px-6 py-24 text-center relative">
      {/* Decorative Grid Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-900 to-transparent" />

      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4">
          <GlitchText text="GOGRICHIANI" color="cyan" />
        </h1>
        <p className="font-rajdhani text-xl md:text-2xl text-gray-400 tracking-[0.2em] uppercase">
          Music Composer
        </p>
      </motion.div>

      <div className="mt-12">
        <AudioVisualizer />
      </div>
    </header>
  );
};
