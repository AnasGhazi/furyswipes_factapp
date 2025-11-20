import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { FunFactCard } from '../types';
import { Info, RotateCcw } from 'lucide-react';

interface FlashCardProps {
  card: FunFactCard;
  index: number;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({ card, index, isTop, onSwipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Motion values for drag physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isTop) return;

    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  const handleCardClick = () => {
    if (isTop) setIsFlipped(!isFlipped);
  };

  // Calculate scale/position for stack effect
  const cardScale = 1 - index * 0.05;
  const cardY = index * 15;
  const zIndex = 100 - index;

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: index < 3 ? 1 : 0, // Hide cards deep in stack
        zIndex,
        scale: isTop ? 1 : cardScale,
        y: isTop ? 0 : cardY,
        perspective: 1000, // Standard CSS perspective
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute w-full max-w-sm h-[65vh] cursor-grab active:cursor-grabbing`}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{ 
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d', // Vital for mobile
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
        onClick={handleCardClick}
      >
        {/* Front of Card */}
        <div
          className={`absolute w-full h-full rounded-3xl shadow-2xl p-8 flex flex-col justify-between bg-gradient-to-br ${card.color} border border-white/10 text-white`}
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden' // Vital for mobile
          }}
        >
          <div className="flex justify-between items-start opacity-80">
            <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full">
              {card.topic}
            </span>
            <Info size={20} />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-center leading-tight drop-shadow-md" dir="ltr">
              {card.question}
            </h2>
          </div>

          <div className="text-center text-sm font-medium opacity-75 animate-pulse">
            Tap to flip • Swipe to skip
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute w-full h-full rounded-3xl shadow-2xl p-8 flex flex-col justify-between bg-white text-gray-900"
          style={{ 
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden' // Vital for mobile
          }}
        >
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Did you know?
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="text-gray-400 hover:text-gray-600"
            >
               <RotateCcw size={20} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-y-auto py-4">
            <p className="text-xl font-medium text-center leading-relaxed text-gray-800" dir="ltr">
              {card.answer}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};