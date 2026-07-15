'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/utils';
import { heroSlides } from '@/data/mockData';

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const { scrollY } = useScroll();

  // Scroll animations: Shrink and Fade as user scrolls down
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[650px] overflow-hidden bg-white mt-[80px]">
      <motion.div 
        style={{ scale, opacity, y }}
        className="absolute inset-0 z-0"
      >
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, index) => (
          index === current && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
              style={{ backgroundColor: slide.backgroundColor || 'white' }}
            >
              {slide.isFullImage ? (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  quality={100}
                  priority={index === 0}
                  unoptimized
                  className="object-contain"
                />
              ) : (
                <div className="h-full flex flex-col md:flex-row items-center px-4 sm:px-8 md:px-24 lg:px-32 gap-6 md:gap-12 justify-center md:justify-start">
                  {/* Left Content */}
                  <div className="w-full md:w-1/2 text-white order-2 md:order-1 relative z-10 text-center md:text-left">
                    <motion.h1
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                      className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-6 drop-shadow-xl tracking-tight leading-tight"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-xs sm:text-base md:text-2xl opacity-90 mb-4 md:mb-10 max-w-lg leading-relaxed font-light line-clamp-2 md:line-clamp-none mx-auto md:mx-0"
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    >
                      <Link
                        href={slide.ctaHref}
                        className="inline-block bg-white text-[#ED1C24] px-6 py-2.5 sm:px-10 sm:py-4 rounded-full font-bold shadow-2xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base"
                      >
                        {slide.ctaText}
                      </Link>
                    </motion.div>
                  </div>

                  {/* Right Image Container */}
                  <div className="w-full md:w-1/2 h-[35%] sm:h-[45%] md:h-[75%] relative order-1 md:order-2">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        rotate: 0,
                        y: [0, -20, 0] 
                      }}
                      transition={{ 
                        delay: 0.4, 
                        duration: 0.8,
                        y: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-scale-down drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        priority={index === 0}
                        unoptimized
                      />
                    </motion.div>
                    
                    {/* Decorative shadow below floating image */}
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-10 bg-black/20 blur-[40px] rounded-full z-0"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )
        ))}
      </AnimatePresence>
      </motion.div>

      {/* Slider Indicators (Dynamic Color for Visibility) */}
      <div className={cn(
        "absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-3 rounded-full shadow-2xl border backdrop-blur-md transition-colors duration-500",
        heroSlides[current].isFullImage 
          ? "bg-black/5 border-black/10" 
          : "bg-white/20 border-white/30"
      )}>
        {heroSlides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-4 h-4 rounded-full border-2 transition-all duration-300",
              // Logic for active state
              current === i 
                ? (heroSlides[current].isFullImage ? "bg-[#ED1C24] border-[#ED1C24] scale-125" : "bg-white border-white scale-125")
                : (heroSlides[current].isFullImage ? "bg-transparent border-[#ED1C24]/40 hover:bg-[#ED1C24]/20" : "bg-transparent border-white/60 hover:bg-white/30")
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};



export default HeroSlider;
