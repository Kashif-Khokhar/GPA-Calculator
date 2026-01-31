import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const PARTICLES = [...Array(20)].map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  targetY: Math.random() * -20 - 10,
  duration: Math.random() * 2 + 2,
  delay: Math.random() * 2
}));

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Dynamic Background Particles */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-500/30 rounded-full"
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%` 
            }}
            initial={{ 
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: [0, p.targetY * 10],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay
            }}
          />
        ))}
      </div>

      {/* Central Content */}
      <div className="relative flex flex-col items-center">
        {/* Animated Glow Halo */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-40 h-40 bg-brand-600/20 rounded-full blur-[60px]"
        />

        {/* University Icon Reveal */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.2 
          }}
          className="relative w-24 h-24 bg-gradient-to-br from-brand-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 mb-8"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />
          <GraduationCap className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
          
          {/* Laser Reveal Line around the box */}
          <motion.div
            className="absolute inset-0 border-2 border-brand-400 rounded-2xl"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>

        {/* Text Reveal Animation */}
        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-4xl font-black text-white tracking-tighter uppercase mb-2"
          >
            Superior <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">GPA</span>
          </motion.h1>
          
          {/* Progress Bar Container */}
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500 to-transparent"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-[0.4em]"
          >
            Excellence is an Attitude
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
