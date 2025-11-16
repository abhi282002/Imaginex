import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handlemouseDown = () => {
    setIsDragging(true);
  };

  const handlemouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setSliderPosition(percentage);
  };

  const beforeImage =
    'https://ik.imagekit.io/sjbr5usgh/pixora-uploads/Roadster_Hero_W0sp0doWK.webp';
  const afterImage =
    'https://ik.imagekit.io/sjbr5usgh/pixora-uploads/Roadster_Hero_W0sp0doWK.webp?tr=e-changebg-prompt-Change%20scene%20to%20snowy%20alpine%20road%2C%20cold%20blue%20tones%2C%20clean%20snowbanks%3B%20keep%20car%20untouched';

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
      }}
      className="relative w-full max-w-lg mx-auto"
    >
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-glass border border-card-border glow-subtle cursow-ew-resize select-none "
        onMouseDown={handlemouseDown}
        onMouseUp={handlemouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handlemouseUp}
      >
        <div className="absolute inset-0 ">
          <img
            src={beforeImage}
            alt="Before"
            className="w-full h-full object-cover select-none"
          />
        </div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <img
            src={afterImage}
            alt="After"
            className="w-full h-full object-cover select-none"
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-primary cursor-ew-resize group "
          style={{
            left: `${sliderPosition}%`,
            transform: 'translateX(-50%)',
          }}
          onMouseDown={handleMouseMove}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -trasnlate-y-1/2 w-8 h-8 bg-gradient-primary rounded-full shadow-primary-glow group-hover:scale-110 transition-transform flex items-center justify-center">
            <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center">
              <div className="w-1 h-4 bg-gradient-primary rounded-full" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-xs font-medium text-muted-foreground">
          AFTER
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-medium text-primary">
          BEFORE
        </div>
      </div>

      <motion.p
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1,
        }}
        className="text-center mt-4 text-sm text-muted-foreground"
      >
        Drag the slider to see the magic✨
      </motion.p>
    </motion.div>
  );
};

export default BeforeAfterSlider;
