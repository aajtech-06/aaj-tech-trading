'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';

const API_BASE = 'https://aajtechtrading.in/api';

const isValidImageUrl = (url?: string) => {
  if (!url) return false;
  if (url.startsWith('/')) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

interface Category {
  id: string;
  name: string;
  count: number;
  image?: string;
  description?: string;
}

const ProductShowcase = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/categories/`);
        const data = await res.json();
        // Only show categories that have a valid image uploaded
        const filtered = data.filter((c: Category) => c.image && c.image.trim() !== '');
        setCategories(filtered);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const nextSlide = () => {
    if (categories.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    if (categories.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const [cardWidth, setCardWidth] = useState(600);
  const [cardHeight, setCardHeight] = useState(480);
  const [gap, setGap] = useState(32);
  const [padding, setPadding] = useState(128);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardWidth(window.innerWidth * 0.85);
        setCardHeight(320);
        setGap(16);
        setPadding(16);
      } else if (window.innerWidth < 1024) {
        setCardWidth(480);
        setCardHeight(380);
        setGap(24);
        setPadding(48);
      } else if (window.innerWidth < 1280) {
        setCardWidth(550);
        setCardHeight(440);
        setGap(32);
        setPadding(96);
      } else {
        setCardWidth(600);
        setCardHeight(480);
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
  const touchStartRef = useRef<number | null>(null);
  const wasSwipedRef = useRef(false);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    touchStartRef.current = e.targetTouches[0].clientX;
    wasSwipedRef.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStartRef.current !== null) {
      const distance = Math.abs(e.targetTouches[0].clientX - touchStartRef.current);
      if (distance > 10) {
        wasSwipedRef.current = true;
      }
    }
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
    <section className="py-20 md:py-24 bg-brand-light dark:bg-brand-dark/95 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Text */}
      <div className="absolute top-0 right-0 text-[20vw] font-black text-brand-dark/[0.02] dark:text-white/[0.02] select-none pointer-events-none -translate-y-1/2">
        CATEGORIES
      </div>

      <div className="relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 px-4">
          <Reveal direction="up">
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark dark:text-white mb-6">
              Product <span className="text-brand-red">Categories</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <div className="w-32 h-2 bg-brand-red mx-auto rounded-full"></div>
          </Reveal>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-red w-12 h-12" />
          </div>
        ) : categories.length > 0 ? (
          <div 
            className="relative w-full overflow-hidden py-4 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Slider Container with Left Alignment matching Page Content */}
            <div className="w-full flex justify-start">
              <motion.div
                className="flex"
                style={{
                  width: `${categories.length * (cardWidth + gap) - gap}px`,
                  gap: `${gap}px`
                }}
                animate={{
                  x: padding - currentIndex * (cardWidth + gap)
                }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
              >
                {categories.map((category) => {
                  return (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      style={{ width: cardWidth, height: cardHeight }}
                      className="shrink-0 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-neutral-900/90 dark:via-neutral-900/95 dark:to-neutral-950/90 rounded-[40px] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-neutral-800/80 hover:border-brand-red/20 dark:hover:border-brand-red/30 relative group cursor-pointer block transition-all duration-500 hover:shadow-[0_30px_70px_-15px_rgba(210,35,42,0.15)] hover:-translate-y-2"
                      onClick={(e) => {
                        if (wasSwipedRef.current) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      {/* Premium Background Glows */}
                      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-red/[0.02] dark:bg-brand-red/[0.04] rounded-full blur-[100px] group-hover:bg-brand-red/[0.06] group-hover:scale-125 transition-all duration-700 ease-out" />
                      <div className="absolute -left-20 -top-20 w-80 h-80 bg-brand-red/[0.01] dark:bg-brand-red/[0.02] rounded-full blur-[100px] group-hover:bg-brand-red/[0.03] transition-all duration-700 ease-out" />

                      {/* Sleek details */}
                      <div className="absolute top-10 left-10 right-10 z-10 flex flex-col gap-2">
                        <h3 className="text-2xl md:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight group-hover:text-brand-red transition-colors duration-300">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs font-semibold text-gray-500 dark:text-neutral-400 line-clamp-2 max-w-[85%] mt-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                            {category.description}
                          </p>
                        )}
                      </div>

                      {/* Tech Circuit Pattern in card background */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] group-hover:opacity-[0.14] transition-all duration-500 pointer-events-none select-none">
                        <div className="w-64 h-64 border-2 border-dashed border-brand-red rounded-full animate-[spin_120s_linear_infinite] group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute w-80 h-80 border border-brand-red rounded-full opacity-50 group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute w-48 h-48 border border-brand-red rounded-full opacity-70 group-hover:scale-95 transition-transform duration-700" />
                        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-brand-red to-transparent" />
                        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-brand-red to-transparent" />

                        {/* Corner tech lines */}
                        <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-brand-red/60 group-hover:top-6 group-hover:left-6 transition-all duration-500" />
                        <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-brand-red/60 group-hover:top-6 group-hover:right-6 transition-all duration-500" />
                        <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-brand-red/60 group-hover:bottom-6 group-hover:left-6 transition-all duration-500" />
                        <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-brand-red/60 group-hover:bottom-6 group-hover:right-6 transition-all duration-500" />
                      </div>

                      {/* Product Image Centered */}
                      <div className="w-full h-full flex items-center justify-center px-8 pt-20 pb-8 relative z-0">
                        {isValidImageUrl(category.image) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.image}
                            alt={category.name}
                            className="max-h-[90%] max-w-[90%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] select-none transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2 group-hover:drop-shadow-[0_30px_60px_rgba(210,35,42,0.2)]"
                          />
                        ) : (
                          <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                            {category.name}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            {categories.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 md:left-12 lg:left-24 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-200/50 dark:border-neutral-700 flex items-center justify-center text-brand-dark dark:text-white hover:bg-brand-red dark:hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={24} className="md:w-8 md:h-8" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 md:right-12 lg:right-24 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-200/50 dark:border-neutral-700 flex items-center justify-center text-brand-dark dark:text-white hover:bg-brand-red dark:hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronRight size={24} className="md:w-8 md:h-8" />
                </button>
              </>
            )}

            {/* Pagination Indicators / Pill Dots */}
            <div className="flex items-center justify-center gap-3 mt-12 z-20 relative">
              <div className="bg-white/80 dark:bg-neutral-900/80 border border-gray-200/80 dark:border-neutral-800 px-6 py-3 rounded-full shadow-lg flex items-center gap-3.5 backdrop-blur-sm">
                {categories.map((_, i) => (
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
        ) : (
          <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">
            No categories to display
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
