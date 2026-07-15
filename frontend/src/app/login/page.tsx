'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useAdminAuth } from '@/features/admin/hooks/useAdminAuth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'login' | 'forgot' | 'otp' | 'reset-success'>('login');

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSending, setIsOtpSending] = useState(false);

  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid work email address');
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password, remember);

    if (!result.success) {
      setError(result.message || 'Invalid email or password');
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpSending(true);
    // Mock OTP flow
    setTimeout(() => {
      setIsOtpSending(false);
      setView('otp');
    }, 1500);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock verification
    setTimeout(() => {
      setIsSubmitting(false);
      setView('reset-success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      {/* Subtle Industrial Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D2232A 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.06)] relative z-10"
      >
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_15px_30px_rgba(210,35,42,0.2)]">
                  <ShieldCheck size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-brand-dark mb-2">Admin Access</h1>
                <p className="text-gray-400 font-medium text-sm">Secure login for Aaj Tech Trading portal</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[10px] font-black text-brand-red uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-red/10 focus:bg-white focus:ring-4 focus:ring-brand-red/5 rounded-2xl py-4 pl-12 pr-12 font-bold text-brand-dark transition-all outline-none text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-1">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-200 transition-all checked:border-brand-red checked:bg-brand-red focus:outline-none"
                    />
                    <CheckCircle2 className="absolute h-5 w-5 scale-0 text-white transition-transform peer-checked:scale-75 pointer-events-none left-0" />
                  </div>
                  <label htmlFor="remember" className="text-sm font-bold text-gray-500 cursor-pointer select-none">Remember this device</label>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-brand-red/5 border border-brand-red/10 p-3 rounded-xl"
                  >
                    <p className="text-brand-red text-xs font-bold text-center">
                      {error}
                    </p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-dark hover:bg-brand-red disabled:bg-gray-200 text-white font-black py-4.5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(210,35,42,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <span className={`flex items-center gap-3 transition-opacity ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  {isSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin" size={20} />
                    </div>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {view === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-gray-400 hover:text-brand-red font-bold text-xs mb-8 transition-colors"
              >
                <ChevronLeft size={16} /> Back to Login
              </button>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-brand-dark mb-2">Forgot Password</h2>
                <p className="text-gray-400 font-medium text-sm">Enter your work email to receive an OTP.</p>
              </div>
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Work Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" size={18} />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-red/10 focus:bg-white focus:ring-4 focus:ring-brand-red/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-brand-dark transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isOtpSending}
                  className="w-full bg-brand-dark hover:bg-brand-red disabled:bg-gray-200 text-white font-black py-4.5 rounded-2xl transition-all flex items-center justify-center gap-3"
                >
                  {isOtpSending ? <Loader2 className="animate-spin" size={20} /> : 'Send OTP'}
                </button>
              </form>
            </motion.div>
          )}

          {view === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-brand-dark mb-2">Check your email</h2>
                <p className="text-gray-400 font-medium text-sm">We&apos;ve sent a 6-digit code to <br /><span className="text-brand-dark font-bold">{forgotEmail}</span></p>
              </div>
              <form onSubmit={handleOtpVerify} className="space-y-6">
                <div className="flex justify-center gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-48 text-center text-3xl font-black tracking-[0.5em] py-4 bg-gray-50 border-2 border-brand-red/10 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-red/5 outline-none transition-all"
                    placeholder="000000"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-dark hover:bg-brand-red disabled:bg-gray-200 text-white font-black py-4.5 rounded-2xl transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Continue'}
                </button>
                <button type="button" className="text-xs font-bold text-gray-400 hover:text-brand-red transition-colors">Resend Code</button>
              </form>
            </motion.div>
          )}

          {view === 'reset-success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-[0_15px_30px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-brand-dark mb-2">Password Reset!</h2>
              <p className="text-gray-400 font-medium text-sm mb-10">You can now login with your <br />new credentials.</p>
              <button
                onClick={() => setView('login')}
                className="w-full bg-brand-dark hover:bg-brand-red text-white font-black py-4.5 rounded-2xl transition-all"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <Link href="/" className="text-[10px] font-black text-gray-400 hover:text-brand-dark uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <ArrowRight size={14} className="rotate-180" /> Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
