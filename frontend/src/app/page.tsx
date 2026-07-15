'use client';

import React from 'react';
import Link from 'next/link';
import HeroSlider from '@/features/home/HeroSlider';
import ProductShowcase from '@/features/products/ProductShowcase';
import DistributorLogos from '@/features/home/DistributorLogos';
import WhyChooseUs from '@/features/home/WhyChooseUs';
import Counters from '@/features/home/Counters';
import IndustryGrid from '@/features/industries/IndustryGrid';
import BlogSection from '@/features/home/BlogSection';
import { Reveal } from '@/components/common/Reveal';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSlider />

      {/* 2. Featured Categories */}
      <Reveal direction="up" delay={0.1} width="100%">
        <ProductShowcase />
      </Reveal>

      {/* 3. Why Choose Us */}
      <Reveal direction="up" delay={0.2} width="100%">
        <WhyChooseUs />
      </Reveal>

      {/* 4. Statistics */}
      <Counters />

      {/* 5. Industries Served */}
      <Reveal direction="up" delay={0.1} width="100%">
        <IndustryGrid />
      </Reveal>

      {/* 5.5 Blog Section */}
      <BlogSection />

      {/* 5.7 Career Teaser Section (Simple Card Style) */}
      <Reveal direction="up" delay={0.1} width="100%">
        <section className="py-12 bg-white relative overflow-hidden">
          <div className="px-4 md:px-12 lg:px-24 xl:px-32 relative z-10 w-full">
            <div className="bg-gradient-to-br from-brand-red via-[#c5151c] to-brand-dark rounded-[32px] md:rounded-[60px] p-6 sm:p-12 md:p-24 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(237,28,36,0.15)]">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-4xl md:text-6xl xl:text-7xl font-black text-white mb-6 md:mb-8 leading-tight">
                  Ready to build your career with us?
                </h2>
                <p className="text-red-100 text-sm sm:text-base md:text-xl mb-8 md:mb-12 leading-relaxed opacity-90">
                  Join our team of innovative thinkers and shape the future of industrial B2B connectivity.
                </p>
                <div className="flex justify-center items-center w-full">
                  <Link href="/career" className="group relative bg-white hover:bg-gray-100 text-brand-dark px-8 py-3.5 sm:px-12 sm:py-5 rounded-full font-black text-sm sm:text-lg transition-all shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:scale-95 text-center w-full sm:w-auto">
                    View Career
                    <span className="absolute inset-0 rounded-full bg-black/5 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 6. Final Call to Action */}
      <section className="py-20 md:py-32 bg-brand-light relative overflow-hidden">
        <div className="px-4 md:px-12 lg:px-24 xl:px-32 relative z-10 w-full">
          <Reveal direction="up" width="100%">
            <div className="bg-brand-dark rounded-[32px] md:rounded-[60px] p-6 sm:p-12 md:p-24 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-4xl md:text-6xl xl:text-7xl font-black text-white mb-6 md:mb-8 leading-tight">
                  Ready to optimize your <span className="text-brand-red">industrial operations?</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-base md:text-xl mb-8 md:mb-12 leading-relaxed">
                  Join hundreds of global companies that trust Aaj Tech Trading for their critical component needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                  <Link href="/contact" className="group relative bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3.5 sm:px-12 sm:py-5 rounded-full font-black text-sm sm:text-lg transition-all shadow-[0_20px_40px_rgba(210,35,42,0.3)] active:scale-95 text-center w-full sm:w-auto">
                    Contact Us
                    <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></span>
                  </Link>
                  <Link href="/products" className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-3.5 sm:px-12 sm:py-5 rounded-full font-black text-sm sm:text-lg transition-all active:scale-95 backdrop-blur-sm text-center w-full sm:w-auto">
                    View Catalog
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-10 w-24 h-24 border-2 border-brand-red/20 rounded-full"></div>
          <div className="absolute bottom-1/4 right-20 w-40 h-40 border-4 border-brand-red/10 rounded-full"></div>
        </div>
      </section>

      {/* 7. Distributors & Dealers (Final section before footer) */}
      <DistributorLogos />
    </main>
  );
}
