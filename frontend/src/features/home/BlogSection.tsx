'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  read_time: string;
}

const BlogSection = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [visibleCards, setVisibleCards] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < blogs.length - visibleCards) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(Math.max(0, blogs.length - visibleCards));
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs/`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setBlogs(data);
          } else {
            setBlogs([]);
          }
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error('Error fetching blogs for home:', error);
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="px-4 md:px-12 lg:px-24 xl:px-32">
        <div className="relative mb-20">
          <div className="text-center">
            <Reveal direction="up">
              <div>
                <span className="text-brand-red font-black uppercase tracking-[0.3em] text-sm mb-4 block">Latest Insights</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark leading-tight tracking-tighter mx-auto max-w-4xl">
                  Technical <span className="text-brand-red">Knowledge</span> & <br className="hidden md:block" />
                  Industry Updates
                </h2>
              </div>
            </Reveal>
          </div>

          <div className="md:absolute md:right-0 md:top-2 mt-8 md:mt-0 flex justify-center">
            <Reveal direction="right" delay={0.4}>
              <Link
                href="/blog"
                className="group flex items-center gap-2 text-brand-dark hover:text-brand-red transition-all duration-300 font-black uppercase text-xs tracking-widest border-b-2 border-transparent hover:border-brand-red pb-1"
              >
                View All Articles
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="relative group">
          {/* Slider Controls */}
          {blogs.length > visibleCards && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-brand-dark hover:bg-brand-red hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 border border-gray-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-brand-dark hover:bg-brand-red hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 border border-gray-100"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="overflow-hidden px-2 py-10 -mx-2">
            <motion.div
              className="flex gap-8"
              animate={{ x: `calc(-${currentIndex * (100 / visibleCards)}% - ${currentIndex * (32 / visibleCards)}px)` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ width: blogs.length > visibleCards ? `${(blogs.length / visibleCards) * 100}%` : '100%' }}
            >
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="w-full"
                  style={{ flex: `0 0 calc(${100 / (blogs.length > visibleCards ? blogs.length : visibleCards)}% - ${blogs.length > visibleCards ? (32 * (blogs.length - 1)) / blogs.length : 0}px)` }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <motion.div
                      whileHover={{ y: -15 }}
                      className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group/card shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 h-full flex flex-col"
                    >
                      <div className="relative h-64 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute top-6 left-6">
                          <span className="bg-white/90 backdrop-blur-md text-brand-red px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {post.category || 'Industry'}
                          </span>
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <Calendar size={12} className="text-brand-red" />
                            {post.date || 'April 2024'}
                          </div>
                          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                          <div className="text-[10px] font-bold text-brand-red uppercase tracking-widest">
                            {post.read_time || '5 Min Read'}
                          </div>
                        </div>

                        <h3 className="text-2xl font-black text-brand-dark mb-4 group-hover/card:text-brand-red transition-colors duration-300 leading-tight">
                          {post.title}
                        </h3>

                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark group-hover/card:text-brand-red transition-colors flex items-center gap-2">
                            Read More <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
