'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { industries } from '@/data/mockData';
import { Reveal } from '@/components/common/Reveal';

const IndustryGrid = () => {
  return (
    <section id="industries" className="py-32 bg-brand-light relative overflow-hidden">
      {/* Background Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-brand-dark" 
            style={{ 
              left: `${i * 10}%`, 
              width: '1px', 
              height: '100%', 
              top: 0 
            }}
          ></div>
        ))}
      </div>

      <div className="px-4 md:px-12 lg:px-24 xl:px-32 relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <Reveal direction="up">
            <span className="text-brand-red font-black tracking-[0.3em] uppercase text-xs mb-6 block">Our Impact</span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark mb-8">
              Industries We <span className="text-brand-red">Serve</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <div className="w-32 h-2 bg-brand-red mx-auto rounded-full"></div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
              className="group relative h-[450px] md:h-[550px] rounded-[48px] overflow-hidden shadow-2xl"
            >
              <Image
                src={industry.image}
                alt={industry.title}
                fill
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent group-hover:from-brand-red group-hover:via-brand-red/40 transition-all duration-700"></div>
              
              <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  <h3 className="text-3xl font-black mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {industry.title}
                  </h3>
                  <p className="text-white/0 group-hover:text-white/90 transition-all duration-300 text-lg leading-relaxed overflow-hidden h-0 group-hover:h-auto font-medium">
                    {industry.description}
                  </p>
                  
                  {/* Decorative indicator */}
                  <div className="w-12 h-1 bg-white/30 mt-6 rounded-full group-hover:bg-white group-hover:w-24 transition-all duration-500"></div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryGrid;
