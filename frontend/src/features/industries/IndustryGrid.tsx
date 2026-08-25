'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { industries } from '@/data/mockData';
import { Reveal } from '@/components/common/Reveal';

const IndustryGrid = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (industries.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % industries.length);
  };

  const prevSlide = () => {
    if (industries.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + industries.length) % industries.length);
  };

  const [cardWidth, setCardWidth] = useState(600);
  const [cardHeight, setCardHeight] = useState(550);
  const [gap, setGap] = useState(32);
  const [padding, setPadding] = useState(128);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardWidth(window.innerWidth * 0.85);
        setCardHeight(450);
        setGap(16);
        setPadding(16);
      } else if (window.innerWidth < 1024) {
        setCardWidth(480);
        setCardHeight(500);
        setGap(24);
        setPadding(48);
      } else if (window.innerWidth < 1280) {
        setCardWidth(550);
        setCardHeight(550);
        setGap(32);
        setPadding(96);
      } else {
        setCardWidth(600);
        setCardHeight(550);
        setGap(32);
        setPadding(128);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section id="industries" className="py-32 bg-brand-light dark:bg-brand-dark/95 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-brand-dark dark:bg-white" 
            style={{ 
              left: `${i * 10}%`, 
              width: '1px', 
              height: '100%', 
              top: 0 
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 px-4">
          <Reveal direction="up">
            <span className="text-brand-red font-black tracking-[0.3em] uppercase text-xs mb-6 block">Our Impact</span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark dark:text-white mb-8">
              Industries We <span className="text-brand-red">Serve</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <div className="w-32 h-2 bg-brand-red mx-auto rounded-full"></div>
          </Reveal>
        </div>

        {/* Carousel Slider */}
        <div 
          className="relative w-full overflow-hidden py-4 touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-full flex justify-start">
            <motion.div
              className="flex"
              style={{
                width: `${industries.length * (cardWidth + gap) - gap}px`,
                gap: `${gap}px`
              }}
              animate={{
                x: padding - currentIndex * (cardWidth + gap)
              }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
            >
              {industries.map((industry) => (
                <div
                  key={industry.id}
                  style={{ width: cardWidth, height: cardHeight }}
                  className="shrink-0 group relative rounded-[48px] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5"
                >
                  <Image
                    src={industry.image}
                    alt={industry.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent group-hover:from-brand-red group-hover:via-brand-red/40 transition-all duration-700"></div>
                  
                  <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                    <div>
                      <h3 className="text-3xl font-black mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {industry.title}
                      </h3>
                      <p className="text-white/0 group-hover:text-white/90 transition-all duration-300 text-lg leading-relaxed overflow-hidden h-0 group-hover:h-auto font-medium">
                        {industry.description}
                      </p>
                      
                      {/* Decorative indicator */}
                      <div className="w-12 h-1 bg-white/30 mt-6 rounded-full group-hover:bg-white group-hover:w-24 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          {industries.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-2 md:left-12 lg:left-24 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-200/50 dark:border-neutral-700 items-center justify-center text-brand-dark dark:text-white hover:bg-brand-red dark:hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={24} className="md:w-8 md:h-8" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-2 md:right-12 lg:left-24 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-200/50 dark:border-neutral-700 items-center justify-center text-brand-dark dark:text-white hover:bg-brand-red dark:hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight size={24} className="md:w-8 md:h-8" />
              </button>
            </>
          )}

          {/* Pagination Indicators / Pill Dots */}
          <div className="flex items-center justify-center gap-3 mt-12 z-20 relative">
            <div className="bg-white/80 dark:bg-neutral-900/80 border border-gray-200/80 dark:border-neutral-800 px-6 py-3 rounded-full shadow-lg flex items-center gap-3.5 backdrop-blur-sm">
              {industries.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${currentIndex === i
                    ? "bg-brand-red border-brand-red scale-125"
                    : "bg-transparent border-gray-400/60 hover:bg-gray-200 dark:hover:bg-neutral-700"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryGrid;
