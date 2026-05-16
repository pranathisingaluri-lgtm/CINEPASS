import React from 'react';
import { motion } from 'motion/react';
import { Popcorn, Ticket, Star, Film, Sparkles, Heart } from 'lucide-react';

const stickers = [
  { Icon: Popcorn, size: 40, color: 'text-red-900/10' },
  { Icon: Ticket, size: 32, color: 'text-amber-900/10' },
  { Icon: Star, size: 24, color: 'text-red-900/10' },
  { Icon: Film, size: 48, color: 'text-red-900/10' },
  { Icon: Sparkles, size: 28, color: 'text-red-400/5' },
  { Icon: Heart, size: 24, color: 'text-red-900/10' },
  { Icon: Popcorn, size: 36, color: 'text-red-900/10' },
  { Icon: Ticket, size: 28, color: 'text-red-900/10' },
  { Icon: Star, size: 32, color: 'text-amber-900/10' },
  { Icon: Sparkles, size: 40, color: 'text-red-400/5' },
];

export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stickers.map((Sticker, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            rotate: Math.random() * 360,
            opacity: 0
          }}
          animate={{ 
            y: [null, '-20%', '20%', null],
            rotate: [null, 15, -15, null],
            opacity: 1
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute ${Sticker.color}`}
          style={{
            left: `${(i * 15) % 90}%`,
            top: `${(i * 12) % 90}%`,
          }}
        >
          <Sticker.Icon size={Sticker.size} strokeWidth={1} />
        </motion.div>
      ))}
      
      {/* Dynamic Cherry "Bubbles" */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`cherry-${i}`}
          initial={{ 
            x: Math.random() * 100 + 'vw', 
            y: '110vh',
            scale: 0.5 + Math.random()
          }}
          animate={{ 
            y: '-10vh',
            x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 50}px)`
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
          className="absolute w-4 h-4 rounded-full bg-red-900/5 blur-[2px]"
        />
      ))}
    </div>
  );
}
