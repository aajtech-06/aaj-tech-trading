'use client';

import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'YOUNG YAK', color: '#F58220', sub: 'ENTERPRISE CO., LTD.' },
  { name: 'Neltron', color: '#E31E24', sub: 'Industrial Co., Ltd.' },
  { name: 'ZHONGB', color: '#00A0E9', sub: 'TECHNOLOGY' },
  { name: 'Xinya', color: '#003399', sub: 'CONNECTIVITY' },
  { name: 'molex', color: '#E31E24', sub: 'creating connections for life' },

];

const DistributorLogos = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black text-[#F58220] uppercase tracking-widest"
        >
          Distributors & Dealers
        </motion.h2>
        <div className="w-24 h-1 bg-[#F58220] mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="relative flex overflow-hidden group">
        <motion.div
          animate={{
            x: [0, -1500],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center min-w-[250px] h-32 px-8 border border-gray-100 rounded-2xl hover:shadow-2xl transition-all hover:border-[#D2232A] bg-white group/logo"
            >
              <div className="flex flex-col items-center">
                <span
                  className="text-2xl font-black italic tracking-tighter"
                  style={{ color: logo.color }}
                >
                  {logo.name}
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  {logo.sub}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default DistributorLogos;
