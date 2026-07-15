'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://aaj-tech-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.detail || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Connection error. Please check if the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-gray-100 rounded-[32px] p-10 text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-brand-dark mb-4">Check Your Email!</h2>
          <p className="text-gray-500 font-medium mb-8">
            We&apos;ve sent a secure link to <span className="text-brand-dark font-bold">{email}</span>.
            Please follow the instructions to set your password and activate your account.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-brand-dark hover:bg-brand-red text-white font-black py-4 rounded-2xl transition-all"
          >
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.06)] relative z-10"
      >
        <Link
          href="/login"
          className="flex items-center gap-2 text-gray-400 hover:text-brand-red font-bold text-xs mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Login
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-red/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-brand-dark mb-2">Create Account</h1>
          <p className="text-gray-400 font-medium text-sm">Join the Aaj Tech Trading partner network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" size={18} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-red/10 focus:bg-white focus:ring-4 focus:ring-brand-red/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-brand-dark transition-all outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Work Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-red/10 focus:bg-white focus:ring-4 focus:ring-brand-red/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-brand-dark transition-all outline-none text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-brand-red/5 border border-brand-red/10 p-3 rounded-xl"
            >
              <p className="text-brand-red text-xs font-bold text-center">{error}</p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-dark hover:bg-brand-red disabled:bg-gray-200 text-white font-black py-4.5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Register Now
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-red font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
