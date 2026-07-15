'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  read_time: string;
  image: string;
  createdAt: string;
  [key: string]: unknown;
}

export default function BlogPage() {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs/`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (isMounted) {
          setBlogs(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const blogsToRender = Array.isArray(blogs) ? blogs : [];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Banner */}
      <div className="relative w-full bg-brand-red pt-36 pb-24 overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20%] opacity-20 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full border-[50px] border-white absolute"></div>
          <div className="w-[450px] h-[450px] rounded-full border-[40px] border-white absolute"></div>
          <div className="w-[300px] h-[300px] rounded-full border-[30px] border-white absolute"></div>
        </div>

        <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 flex flex-col items-start justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-5xl leading-tight drop-shadow-md"
          >
            Connector Guides, Product Information & Usage Support
          </motion.h1>
        </div>
      </div>

      {/* Blog Content Section */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {blogsToRender.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest">No Insights Found</h2>
              <p className="text-gray-300 mt-2">Our technical library is being updated.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {blogsToRender.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] overflow-hidden group cursor-pointer border border-gray-100 flex flex-col hover:shadow-[0_20px_60px_rgb(0,0,0,0.1)] transition-all duration-700"
                  >
                    {/* Post Image Container */}
                    <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden bg-white p-4 md:p-8 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image || 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2070&auto=format&fit=crop'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>

                      {/* Watermark Logo */}
                      <div className="absolute top-8 right-8 md:top-12 md:right-12 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center">
                          <span className="text-white font-black text-xl">A</span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-8 left-8 md:top-12 md:left-12">
                        <span className="bg-brand-red text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-xl">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-10 md:p-16">
                      <div className="flex items-center gap-6 text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-brand-red" /> {post.date}</span>
                        <span className="text-gray-200">|</span>
                        <span className="text-brand-red">{post.read_time || '5 MIN READ'}</span>
                      </div>

                      <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-8 group-hover:text-brand-red transition-colors leading-[1.1] tracking-tighter">
                        {post.title}
                      </h2>

                      <p className="text-gray-500 leading-relaxed mb-12 text-lg md:text-xl font-medium max-w-4xl">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-3 text-brand-red font-black uppercase tracking-[0.3em] text-xs group-hover:gap-6 transition-all">
                        Read Full Article <ArrowRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
