'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { counters } from '@/data/mockData';

const CounterItem = ({ value, label, suffix, index }: { value: number, label: string, suffix: string, index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, springValue, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
      className="text-center group"
    >
      <div className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-4 flex justify-center items-center drop-shadow-lg">
        <motion.span>{displayValue}</motion.span>
        <span className="text-white/40 ml-2 text-2xl sm:text-4xl md:text-5xl font-black">{suffix}</span>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.5 }}
        className="text-white/80 font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[10px] sm:text-xs md:text-sm"
      >
        {label}
      </motion.p>
      
      {/* Decorative Line */}
      <motion.div 
        initial={{ width: 0 }}
        animate={isInView ? { width: "40px" } : {}}
        transition={{ delay: index * 0.1 + 0.8, duration: 0.5 }}
        className="h-1 bg-white/30 mx-auto mt-6 rounded-full group-hover:bg-white group-hover:w-16 transition-all duration-300"
      ></motion.div>
    </motion.div>
  );
};

const Counters = () => {
  return (
    <section className="py-20 md:py-32 bg-brand-red relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-full h-full border-[60px] border-white/5 rounded-[120px]"
        ></motion.div>
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-full border-[100px] border-white/5 rounded-full"
        ></motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {counters.map((counter, index) => (
            <CounterItem 
              key={counter.id} 
              value={counter.value} 
              label={counter.label} 
              suffix={counter.suffix} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counters;
