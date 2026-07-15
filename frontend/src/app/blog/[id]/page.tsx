'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,

  Clock,
  Share2,
  MessageSquare,
  Globe,
  Link as LinkIcon,
  Check,

  Loader2
} from 'lucide-react';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  date: string;
  image: string;
  read_time: string;
  [key: string]: unknown;
}

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    let isMounted = true;
    const fetchPostData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [postRes, allRes] = await Promise.all([
          fetch(`${API_BASE}/blogs/${id}`),
          fetch(`${API_BASE}/blogs/`)
        ]);

        if (postRes.ok && isMounted) {
          const postData = await postRes.json();
          setPost(postData);
        }

        if (allRes.ok && isMounted) {
          const allData = await allRes.json();
          setRelatedPosts(Array.isArray(allData) ? allData.filter((p: BlogPost) => p.id !== id).slice(0, 3) : []);
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPostData();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-brand-red w-12 h-12" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-black text-brand-dark mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-brand-red font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end justify-start overflow-hidden pt-32 md:pt-40">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 font-black uppercase tracking-widest text-xs transition-all hover:-translate-x-2"
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80 text-xs font-black uppercase tracking-[0.2em] mb-6">
              <span className="bg-brand-red text-white px-4 py-1.5 rounded-full">{post.category}</span>
              <span className="flex items-center gap-2"><Calendar size={14} className="text-brand-red" /> {post.date}</span>
              <span className="flex items-center gap-2"><Clock size={14} className="text-brand-red" /> {post.read_time}</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter max-w-5xl">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 container mx-auto px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Main Article */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8"
          >
            {/* Author Info */}
            <div className="flex items-center gap-4 pb-12 mb-12 border-b border-gray-100">
              <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center text-brand-red font-black text-xl border-2 border-brand-red/20">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="text-brand-dark font-black text-lg tracking-tight">{post.author}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Industry Expert @ Aaj Tech</div>
              </div>
            </div>

            {/* Rich Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-brand-dark prose-headings:tracking-tighter prose-p:text-gray-600 prose-p:leading-relaxed prose-blockquote:border-l-brand-red prose-blockquote:bg-brand-light/30 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:font-black prose-blockquote:text-brand-dark prose-strong:text-brand-dark prose-img:rounded-[2rem] prose-img:shadow-2xl">
              {post.content.includes('<p>') || post.content.includes('</div>') ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                post.content.split('\n\n').map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))
              )}
            </div>

            {/* Tags & Share */}
            <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex flex-wrap gap-3">
                {['Industrial', 'Connectors', 'Manufacturing', 'Tech'].map(tag => (
                  <span key={tag} className="px-5 py-2 bg-gray-50 text-gray-500 rounded-full text-xs font-black uppercase tracking-widest border border-gray-100 hover:bg-brand-red hover:text-white transition-all cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-brand-dark font-black uppercase tracking-widest text-xs">Share Article</span>
                <div className="flex gap-2">
                  {/* LinkedIn Share */}
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="w-10 h-10 bg-brand-light text-brand-red rounded-xl flex items-center justify-center hover:bg-brand-red hover:text-white transition-all shadow-sm"
                    title="Share on LinkedIn"
                  >
                    <Globe size={18} />
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopy}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-brand-light text-brand-red hover:bg-brand-red hover:text-white'
                      }`}
                    title="Copy Link"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check size={18} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="link"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <LinkIcon size={18} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Native Share */}
                  <button
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: post.title,
                            text: post.excerpt,
                            url: window.location.href,
                          });
                        } catch (err) {
                          console.log('Error sharing:', err);
                        }
                      } else {
                        // Fallback if native share is not supported (e.g. some desktop browsers)
                        const url = window.location.href;
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`, '_blank');
                      }
                    }}
                    className="w-10 h-10 bg-brand-light text-brand-red rounded-xl flex items-center justify-center hover:bg-brand-red hover:text-white transition-all shadow-sm"
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">

            {/* Related Posts */}
            <div>
              <h3 className="text-xl font-black text-brand-dark mb-8 uppercase tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-brand-red rounded-full" />
                Related Articles
              </h3>
              <div className="space-y-6">
                {relatedPosts.map(related => (
                  <Link key={related.id} href={`/blog/${related.id}`} className="flex gap-4 group">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={related.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <div className="text-brand-red text-[10px] font-black uppercase tracking-widest mb-1">{related.date}</div>
                      <h4 className="text-brand-dark font-black text-sm leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support CTA */}
            <div className="bg-brand-light p-10 rounded-[3rem] border border-brand-red/10 relative group overflow-hidden">
              <div className="relative z-10">
                <MessageSquare className="text-brand-red mb-6" size={32} />
                <h3 className="text-xl font-black text-brand-dark mb-4 uppercase tracking-tight leading-tight">Need technical support?</h3>
                <p className="text-gray-500 text-sm mb-8 font-medium leading-relaxed">
                  Our experts are ready to help you with any technical questions.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-brand-red font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all"
                >
                  Contact Support <ArrowLeft className="rotate-180" size={16} />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-brand-red">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">Ready to upgrade your technology?</h2>
          <Link
            href="/products"
            className="inline-flex bg-white text-brand-red px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
          >
            Explore Our Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
