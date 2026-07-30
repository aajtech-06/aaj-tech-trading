'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

const API_BASE = 'https://aajtechtrading.in/api';

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

// Parse inline markdown bold (**text**) or titles ending with colons
function parseInlineStyling(text: string): React.ReactNode {
  // If the line has "Title: description" style
  if (text.includes(': ') && text.indexOf(': ') < 40) {
    const colonIdx = text.indexOf(': ');
    const title = text.substring(0, colonIdx);
    const desc = text.substring(colonIdx + 2);
    return (
      <React.Fragment>
        <strong className="text-brand-dark dark:text-white font-extrabold">{title}: </strong>
        {parseInlineMarkdown(desc)}
      </React.Fragment>
    );
  }
  return parseInlineMarkdown(text);
}

// Parse **bold** markdown tags inline
function parseInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-brand-dark dark:text-white font-extrabold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function parseBlogContent(content: string): React.ReactNode[] {
  // If the content already contains HTML tags, render it dangerously
  if (content.includes('<p>') || content.includes('</div>') || content.includes('<br>')) {
    return [<div key="raw-html" dangerouslySetInnerHTML={{ __html: content }} />];
  }

  // Normalize newlines and split by double or more newlines
  const blocks = content.split(/\n\n+/);
  
  return blocks.map((block, blockIndex) => {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) return null;

    // Check if the block itself is a Heading / Question
    const isQuestion = trimmedBlock.endsWith('?');
    const isShortLine = trimmedBlock.length < 80 && !trimmedBlock.includes('.') && !trimmedBlock.includes(',') && !trimmedBlock.includes(':');
    const isHeading = isQuestion || isShortLine;

    if (isHeading) {
      if (isQuestion) {
        return (
          <h3 
            key={blockIndex} 
            className="text-2xl md:text-3xl font-black text-brand-dark dark:text-white mt-12 mb-6 tracking-tight border-l-4 border-brand-red bg-brand-red/5 dark:bg-brand-red/10 px-6 py-4 rounded-r-3xl leading-snug"
          >
            {trimmedBlock}
          </h3>
        );
      } else {
        return (
          <h4 
            key={blockIndex} 
            className="text-xl md:text-2xl font-black text-brand-dark dark:text-white mt-10 mb-4 tracking-tight border-b border-gray-100 dark:border-neutral-800 pb-2"
          >
            {trimmedBlock}
          </h4>
        );
      }
    }

    // Now, check if the block contains single newlines (\n)
    if (trimmedBlock.includes('\n')) {
      const lines = trimmedBlock.split('\n').map(l => l.trim()).filter(Boolean);
      
      const hasBulletMarker = lines.some(line => 
        line.startsWith('-') || 
        line.startsWith('•') || 
        line.startsWith('*') || 
        /^\d+[\.\)]/.test(line)
      );
      
      const allLinesAreShort = lines.every(line => line.length < 75);
      const isList = hasBulletMarker || (allLinesAreShort && lines.length >= 2);

      if (isList) {
        return (
          <ul key={blockIndex} className="my-6 space-y-3 list-none pl-0">
            {lines.map((line, lineIdx) => {
              // Strip leading list characters
              const cleanLine = line.replace(/^[-•*\s\d\.\)]+/, '').trim();
              return (
                <li key={lineIdx} className="flex items-start gap-3 group text-gray-600 dark:text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mt-0.5 shrink-0 font-extrabold text-[10px]">
                    ✓
                  </span>
                  <span className="text-base font-semibold leading-relaxed">
                    {parseInlineStyling(cleanLine)}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      } else {
        // If it has newlines but doesn't look like a bulleted list, render with line breaks
        return (
          <p key={blockIndex} className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {parseInlineStyling(line)}
                {lineIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      }
    }

    // Default paragraph
    return (
      <p key={blockIndex} className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6">
        {parseInlineStyling(trimmedBlock)}
      </p>
    );
  });
}

interface BlogDetailClientProps {
  id: string;
}

export default function BlogDetailClient({ id }: BlogDetailClientProps) {
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-dark transition-colors duration-300">
        <Loader2 className="animate-spin text-brand-red w-12 h-12" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-dark transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-4xl font-black text-brand-dark dark:text-white mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-brand-red font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0C0E] transition-colors duration-500 pb-24">
      {/* Article Header (Elegant Centered Layout with Smooth Gradient) */}
      <section className="pt-40 pb-32 bg-gradient-to-b from-white to-[#F8F9FA] dark:from-neutral-950 dark:to-[#0B0C0E] border-b border-gray-100 dark:border-neutral-900 transition-colors duration-500 relative overflow-hidden">
        {/* Subtle decorative glowing background circle */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-brand-red/5 dark:bg-brand-red/2 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/2 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          >
            {/* Elegant Floating Back button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-red dark:text-neutral-500 dark:hover:text-brand-red mb-10 font-black uppercase tracking-widest text-xs transition-all hover:-translate-x-2 bg-white dark:bg-neutral-900 px-5 py-2.5 rounded-full shadow-sm border border-gray-100 dark:border-neutral-800"
            >
              <ArrowLeft size={14} className="text-brand-red" /> Back to Blog
            </Link>

            <div className="flex items-center justify-center flex-wrap gap-4 text-gray-500 dark:text-neutral-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
              <span className="bg-brand-red/10 text-brand-red border border-brand-red/20 px-5 py-2 rounded-full">{post.category}</span>
              <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-full" />
              <span className="flex items-center gap-2"><Calendar size={14} className="text-brand-red" /> {post.date}</span>
              <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-full" />
              <span className="flex items-center gap-2"><Clock size={14} className="text-brand-red" /> {post.read_time}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark dark:text-white leading-[1.1] tracking-tight max-w-4xl mx-auto mt-4 mb-6 font-sans">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Image Section (Full image visibility, Overlaps header beautifully) */}
      <section className="container mx-auto px-4 md:px-12 lg:px-24 relative z-20 -mt-16 md:-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          className="w-full max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-white dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'}
            alt={post.title}
            className="w-full h-auto max-h-[600px] object-contain rounded-[2rem] mx-auto block"
          />
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="pt-20 container mx-auto px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Main Article */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-neutral-800/40 shadow-sm"
          >
            {/* Author Info & Top Share */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 mb-10 border-b border-gray-100 dark:border-neutral-800/60">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-light dark:bg-neutral-800 rounded-full flex items-center justify-center text-brand-red font-black text-xl border-2 border-brand-red/20 dark:border-brand-red/10">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="text-brand-dark dark:text-white font-black text-lg tracking-tight">{post.author}</div>
                  <div className="text-gray-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest">Industry Expert @ Aaj Tech</div>
                </div>
              </div>

              {/* Top Share Buttons */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-gray-400 dark:text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Share:</span>
                <div className="flex gap-2">
                  {/* LinkedIn Share */}
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const url = window.location.href;
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                      }
                    }}
                    className="w-9 h-9 bg-brand-light dark:bg-neutral-800 text-brand-red rounded-lg flex items-center justify-center hover:bg-brand-red hover:text-white dark:hover:text-white hover:border-brand-red transition-all shadow-sm border border-brand-red/10"
                    title="Share on LinkedIn"
                  >
                    <Globe size={16} />
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopy}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-sm border ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-brand-light dark:bg-neutral-800 text-brand-red hover:bg-brand-red hover:text-white dark:hover:text-white border-brand-red/10'
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
                          <Check size={16} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="link"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <LinkIcon size={16} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Native Share */}
                  <button
                    onClick={async () => {
                      if (typeof window !== 'undefined' && navigator.share) {
                        try {
                          await navigator.share({
                            title: post.title,
                            text: post.excerpt,
                            url: window.location.href,
                          });
                        } catch (err) {
                          console.log('Error sharing:', err);
                        }
                      } else if (typeof window !== 'undefined') {
                        const url = window.location.href;
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`, '_blank');
                      }
                    }}
                    className="w-9 h-9 bg-brand-light dark:bg-neutral-800 text-brand-red rounded-lg flex items-center justify-center hover:bg-brand-red hover:text-white dark:hover:text-white hover:border-brand-red transition-all shadow-sm border border-brand-red/10"
                    title="Share"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Rich Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-brand-dark dark:prose-headings:text-white prose-headings:tracking-tighter prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-blockquote:border-l-brand-red prose-blockquote:bg-brand-light/30 dark:prose-blockquote:bg-neutral-800/20 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:font-black prose-blockquote:text-brand-dark dark:prose-blockquote:text-white prose-strong:text-brand-dark dark:prose-strong:text-white prose-img:rounded-[2rem] prose-img:shadow-2xl">
              {parseBlogContent(post.content)}
            </div>

            {/* Tags & Share */}
            <div className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex flex-wrap gap-3">
                {['Industrial', 'Connectors', 'Manufacturing', 'Tech'].map(tag => (
                  <span key={tag} className="px-5 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 rounded-full text-xs font-black uppercase tracking-widest border border-gray-100 dark:border-neutral-700 hover:bg-brand-red hover:text-white dark:hover:text-white hover:border-brand-red transition-all cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-brand-dark dark:text-white font-black uppercase tracking-widest text-xs">Share Article</span>
                <div className="flex gap-2">
                  {/* LinkedIn Share */}
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const url = window.location.href;
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                      }
                    }}
                    className="w-10 h-10 bg-brand-light dark:bg-neutral-800 text-brand-red rounded-xl flex items-center justify-center hover:bg-brand-red hover:text-white dark:hover:text-white transition-all shadow-sm"
                    title="Share on LinkedIn"
                  >
                    <Globe size={18} />
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopy}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-brand-light dark:bg-neutral-800 text-brand-red hover:bg-brand-red hover:text-white dark:hover:text-white'
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
                      if (typeof window !== 'undefined' && navigator.share) {
                        try {
                          await navigator.share({
                            title: post.title,
                            text: post.excerpt,
                            url: window.location.href,
                          });
                        } catch (err) {
                          console.log('Error sharing:', err);
                        }
                      } else if (typeof window !== 'undefined') {
                        const url = window.location.href;
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`, '_blank');
                      }
                    }}
                    className="w-10 h-10 bg-brand-light dark:bg-neutral-800 text-brand-red rounded-xl flex items-center justify-center hover:bg-brand-red hover:text-white dark:hover:text-white transition-all shadow-sm"
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

            {/* Related Articles */}
            <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-neutral-800/40 shadow-sm">
              <h3 className="text-xl font-black text-brand-dark dark:text-white mb-8 uppercase tracking-tight flex items-center gap-3">
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
                      <h4 className="text-brand-dark dark:text-white font-black text-sm leading-snug group-hover:text-brand-red dark:group-hover:text-brand-red transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support CTA */}
            <div className="bg-gradient-to-br from-brand-dark/95 to-neutral-900/90 dark:from-neutral-950 dark:to-neutral-900 text-white p-10 rounded-[2.5rem] border border-white/10 relative group overflow-hidden shadow-2xl">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <MessageSquare className="text-brand-red mb-6" size={32} />
                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight leading-tight">Need technical support?</h3>
                <p className="text-white/60 text-sm mb-8 font-medium leading-relaxed">
                  Our experts are ready to help you with any technical questions.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-brand-red hover:bg-white hover:text-brand-red text-white font-black px-6 py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg shadow-brand-red/20"
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
}
