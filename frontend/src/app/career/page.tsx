'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  TrendingUp,
  BookOpen,
  Smile,
  IndianRupee,
  Lightbulb,
  Users,
  ShieldAlert,
  Calendar,
  Award,
  Trophy,
  Target,
  HeartHandshake,
  Upload,
  Check,
  Loader2,
  ChevronDown,
  Mail,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  MapPin,
  Clock
} from 'lucide-react';
import { Job, Department } from '@/types';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

const WHY_JOIN_US = [
  {
    icon: TrendingUp,
    title: 'Career Growth',
    desc: 'Scale your capabilities with rapid project assignments and clear milestone trackings.'
  },
  {
    icon: BookOpen,
    title: 'Learning Opportunities',
    desc: 'Get mentored by industry veterans and access external training programs.'
  },
  {
    icon: Smile,
    title: 'Friendly Work Environment',
    desc: 'Work in a supportive, collaborative culture with approachable managers.'
  },
  {
    icon: IndianRupee,
    title: 'Competitive Salary',
    desc: 'We offer packages matching top industry standards along with performance bonuses.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Work with cutting-edge EV products and advanced industrial connectivity components.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Collaborate with cross-functional teams to deliver high-quality supply chain and distribution operations.'
  }
];

const BENEFITS = [
  { icon: ShieldAlert, title: 'Health Benefits', desc: 'Comprehensive medical coverage for you and your family.' },
  { icon: Calendar, title: 'Paid Leave', desc: 'Generous vacation days, casual leaves, and national holidays.' },
  { icon: Award, title: 'Training Programs', desc: 'Sponsorships for professional certifications, industry workshops, and seminars.' },
  { icon: Trophy, title: 'Performance Rewards', desc: 'Quarterly and annual bonuses for high performing individuals.' },
  { icon: Target, title: 'Career Development', desc: 'Clear paths to progress into senior roles and lead business operations.' },
  { icon: HeartHandshake, title: 'Supportive Culture', desc: 'Open communication channels and mental well-being support.' }
];

const FAQS = [
  {
    q: 'How can I apply?',
    a: 'You can apply by looking at the Current Openings section, choosing a relevant role, and clicking "Apply Now". This will scroll you to the application form. Fill out your details and upload a PDF/Word resume. You can also directly mail your CV to info@aajtechtrading.com.'
  },
  {
    q: 'Can freshers apply?',
    a: 'Absolutely! While some senior sales or operations positions require specialized prior experience, we actively recruit fresh graduates and business/marketing professionals for entry-level roles.'
  },
  {
    q: 'What is the hiring process?',
    a: 'After you submit your application, our HR team reviews your resume. If your profile is shortlisted, you will receive an email or phone call to schedule an interview. Candidates who successfully complete the interview process will receive an official offer letter, joining date, and onboarding instructions.'
  },
  {
    q: 'How long does recruitment take?',
    a: 'Typically, the entire process takes about 7 to 14 working days from your initial application submission to the final selection result, depending on interview slot availability.'
  }
];

const Hexagon = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.12, scale: 1 }}
    transition={{ delay, duration: 3.5, repeat: Infinity, repeatType: "reverse" }}
    className={`absolute ${className}`}
    style={{
      clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      background: "linear-gradient(135deg, #d2232a 0%, #8b1317 100%)",
      width: "140px",
      height: "160px",
    }}
  />
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export default function CareerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Department filter states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  // File Upload states
  const [file, setFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // Selected position for form auto-fill
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedFormDept, setSelectedFormDept] = useState('');

  // FAQ Accordion states
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Form references
  const formRef = useRef<HTMLFormElement>(null);
  const openingsRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchActiveJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/career/jobs?active_only=true`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (isMounted) {
          setJobs(data);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        if (isMounted) setLoadingJobs(false);
      }
    };

    const fetchActiveDepts = async () => {
      try {
        const res = await fetch(`${API_BASE}/career/departments`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setDepartments(data);
          }
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };

    fetchActiveJobs();
    fetchActiveDepts();

    return () => { isMounted = false; };
  }, []);

  const handleApplyClick = (jobTitle: string) => {
    const job = jobs.find(j => j.title === jobTitle);
    if (job) {
      setSelectedFormDept(job.department);
    }
    setSelectedPosition(jobTitle);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredJobs = selectedDeptFilter === 'All'
    ? jobs
    : jobs.filter(j => j.department === selectedDeptFilter);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check size limit (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('Resume file is too large! Maximum allowed size is 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
    setUploadingFile(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${API_BASE}/career/upload-resume`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedUrl(data.url);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.detail || 'Failed to upload resume to server.');
        setFile(null);
      }
    } catch (err) {
      console.error(err);
      setError('Connection error while uploading resume. Please try again.');
      setFile(null);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!uploadedUrl) {
      setError('Please upload your resume first.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const applicationData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      department: selectedFormDept || formData.get('department'),
      position: selectedPosition || formData.get('position'),
      experience: formData.get('experience'),
      currentCTC: formData.get('currentCTC'),
      expectedCTC: formData.get('expectedCTC'),
      resume: uploadedUrl,
      message: formData.get('message'),
      status: 'Applied'
    };

    try {
      const res = await fetch(`${API_BASE}/career/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      if (res.ok) {
        setSuccess(true);
        setFile(null);
        setUploadedUrl('');
        setSelectedPosition('');
        setSelectedFormDept('');
        if (formRef.current) formRef.current.reset();
        setTimeout(() => setSuccess(false), 8000);
      } else {
        const err = await res.json();
        setError(err.detail || 'Failed to submit application. Please verify details.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="bg-white min-h-screen text-brand-dark overflow-x-hidden font-sans">

      {/* 1. Hero Section */}
      <section className="relative pt-44 pb-28 md:pt-52 md:pb-40 bg-brand-dark flex items-center overflow-hidden">
        {/* Floating Hexagons */}
        <Hexagon className="top-24 left-[8%]" delay={0} />
        <Hexagon className="bottom-16 right-[12%] hidden lg:block" delay={1.2} />

        {/* Background Overlay image */}
        <div className="absolute inset-0 opacity-15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=2070&auto=format&fit=crop"
            alt="Engineers working on electronics"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark"></div>
        </div>

        {/* Decorative Circle lines */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20%] opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full border-[50px] border-white absolute"></div>
          <div className="w-[450px] h-[450px] rounded-full border-[40px] border-white absolute"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block px-4 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-black uppercase tracking-[0.3em] mb-8"
            >
              Work with the best
            </motion.span>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tighter"
            >
              Join Our <br />
              <span className="text-brand-red">Team.</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-12"
            >
              Build your career with AAJ Tech Trading Corporation and become part of an innovative industrial solutions company.
            </motion.p>
            <motion.div variants={itemVariants}>
              <button
                onClick={() => openingsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-brand-red hover:bg-brand-red-hover text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-[0_15px_30px_rgba(210,35,42,0.3)] active:scale-95 flex items-center gap-3 group cursor-pointer"
              >
                View Open Positions
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Why Join Us */}
      <section className="py-24 md:py-32 bg-[#fafafa]">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">

          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight">
              Why AAJ Tech Trading?
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              We empower team members to take direct ownership, drive product innovation, and advance their professional trajectories in a global ecosystem.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {WHY_JOIN_US.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(0,0,0,0.06)' }}
                className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100/80 shadow-[0_10px_30px_rgba(0,0,0,0.01)] transition-all duration-500 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-brand-red/5 rounded-2xl flex items-center justify-center text-brand-red mb-8 group-hover:bg-brand-red group-hover:text-white group-hover:shadow-[0_12px_24px_rgba(237,28,36,0.3)] transition-all duration-500">
                  <item.icon size={28} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                </div>
                <h3 className="text-xl font-black text-brand-dark mb-4 group-hover:text-brand-red transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 3. Current Openings */}
      <section ref={openingsRef} id="open-positions" className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 tracking-tight">
                Current Openings
              </h2>
              <p className="text-gray-500 font-medium text-lg">
                Explore our active job roles and apply today.
              </p>
            </div>
            <span className="px-5 py-2.5 rounded-full bg-brand-red/5 border border-brand-red/10 text-brand-red text-xs font-black uppercase tracking-[0.2em]">
              {filteredJobs.length} Available Slots
            </span>
          </div>

          {loadingJobs ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Fetching openings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-[#fafafa] rounded-[40px] p-16 text-center border border-gray-100 max-w-4xl mx-auto">
              <Briefcase size={48} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-black text-brand-dark mb-2">No Active Openings Right Now</h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">
                We are constantly expanding. Send your CV directly to our HR box, and we will contact you when a slot matches.
              </p>
              <a
                href="mailto:info@aajtechtrading.com"
                className="inline-flex items-center gap-3 bg-brand-dark hover:bg-brand-red text-white font-black px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-colors"
              >
                Send Resume to HR
                <Mail size={16} />
              </a>
            </div>
          ) : (
            <>
              {/* Department Filter Tags */}
              {departments.length > 0 && (
                <div className="flex flex-wrap gap-4.5 justify-center mb-16">
                  <button
                    onClick={() => setSelectedDeptFilter('All')}
                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border ${selectedDeptFilter === 'All'
                      ? 'bg-brand-red text-white border-brand-red shadow-[0_10px_25px_rgba(237,28,36,0.22)] scale-[1.03]'
                      : 'bg-white text-gray-500 hover:text-brand-dark border-gray-200 shadow-[0_5px_15px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.04)] hover:scale-[1.03] cursor-pointer'
                      }`}
                  >
                    All Departments
                  </button>
                  {departments.map((dept) => {
                    const hasJobs = jobs.some(j => j.department === dept.name);
                    if (!hasJobs) return null;
                    return (
                      <button
                        key={dept.id}
                        onClick={() => setSelectedDeptFilter(dept.name)}
                        className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border ${selectedDeptFilter === dept.name
                          ? 'bg-brand-red text-white border-brand-red shadow-[0_10px_25px_rgba(237,28,36,0.22)] scale-[1.03]'
                          : 'bg-white text-gray-500 hover:text-brand-dark border-gray-200 shadow-[0_5px_15px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.04)] hover:scale-[1.03] cursor-pointer'
                          }`}
                      >
                        {dept.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-xl mx-auto">
                  <Briefcase size={40} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-black text-brand-dark mb-1">No positions in {selectedDeptFilter}</h3>
                  <p className="text-gray-400 text-sm font-medium">Please explore other departments above or check back soon.</p>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
                  <AnimatePresence mode="popLayout">
                    {filteredJobs.map((job) => (
                      <motion.div
                        key={job.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] hover:border-brand-red/10 hover:-translate-y-1 transition-all duration-500 flex flex-col md:flex-row justify-between gap-8 group"
                      >
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-brand-red text-[10px] font-black uppercase tracking-wider border border-brand-red/10">
                              {job.department}
                            </span>
                            <span className="px-3.5 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-wider border border-gray-200/50 flex items-center gap-1">
                              <MapPin size={10} /> {job.location}
                            </span>
                            <span className="px-3.5 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-wider border border-gray-200/50 flex items-center gap-1">
                              <Clock size={10} /> {job.employmentType}
                            </span>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-black text-brand-dark leading-tight group-hover:text-brand-red transition-colors duration-300">
                            {job.title}
                          </h3>

                          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-bold text-gray-400">
                            <p>Experience: <span className="text-gray-600 font-extrabold">{job.experience}</span></p>
                            {job.salary && <p>Salary: <span className="text-gray-600 font-extrabold">{job.salary}</span></p>}
                          </div>

                          <p className="text-gray-500 text-sm font-medium leading-relaxed pt-2">
                            {job.description}
                          </p>
                        </div>

                        <div className="flex items-center shrink-0">
                          <button
                            onClick={() => handleApplyClick(job.title)}
                            className="w-full md:w-auto bg-brand-dark hover:bg-brand-red text-white font-black px-10 py-5 rounded-2xl text-xs uppercase tracking-widest transition-all hover:shadow-[0_10px_25px_rgba(237,28,36,0.22)] active:scale-95 shrink-0 cursor-pointer"
                          >
                            Apply Now
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          )}

        </div>
      </section>

      {/* 4. Employee Benefits */}
      <section className="py-24 md:py-32 bg-[#fafafa]">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">

          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight">
              Employee Benefits
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              We look after our crew so they can focus on delivering professional excellence.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {BENEFITS.map((b) => (
              <motion.div
                key={b.title}
                variants={itemVariants}
                whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(0,0,0,0.05)' }}
                className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-brand-red/5 text-brand-red rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red group-hover:text-white transition-all duration-500">
                  <b.icon size={22} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                </div>
                <h4 className="text-lg font-black text-brand-dark mb-3 group-hover:text-brand-red transition-colors duration-300">
                  {b.title}
                </h4>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 5. Application Form */}
      <section ref={formSectionRef} className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 max-w-4xl">

          <div className="bg-white p-8 md:p-16 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-red/20 shrink-0">
                <Briefcase size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-brand-dark">Apply Online</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Ready to innovate? Complete the form below.</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-50 rounded-[32px] p-12 text-center border border-green-100"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark mb-2">Application Received!</h3>
                  <p className="text-gray-600 font-medium">Thank you for applying. Our talent acquisition department will evaluate your profile and contact you shortly.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleFormSubmit}
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="name@gmail.com"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                    {/* Department Dropdown */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                      {selectedFormDept ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={selectedFormDept}
                            disabled
                            className="w-full bg-gray-100 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark select-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFormDept('');
                              setSelectedPosition('');
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-red hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <select
                          name="department"
                          value={selectedFormDept}
                          onChange={(e) => {
                            setSelectedFormDept(e.target.value);
                            setSelectedPosition('');
                          }}
                          className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.name}>{dept.name}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Position Dropdown */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Position Applying For</label>
                      {selectedPosition ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={selectedPosition}
                            disabled
                            className="w-full bg-gray-100 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark select-none"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedPosition('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-red hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <select
                          name="position"
                          className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Position</option>
                          {jobs
                            .filter(j => !selectedFormDept || selectedFormDept === 'Other' || j.department === selectedFormDept)
                            .map((job) => (
                              <option key={job.id} value={job.title}>{job.title}</option>
                            ))}
                          <option value="Other">Other Position</option>
                        </select>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Experience (Years)</label>
                      <input
                        name="experience"
                        type="text"
                        placeholder="e.g. 2.5 Years / Fresher"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current CTC (P.A.)</label>
                      <input
                        name="currentCTC"
                        type="text"
                        placeholder="e.g. ₹4,00,000 / Nil"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expected CTC (P.A.)</label>
                      <input
                        name="expectedCTC"
                        type="text"
                        placeholder="e.g. ₹6,00,000"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Resume Upload Box */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      Upload Resume
                    </label>
                    <div
                      onClick={() => !uploadingFile && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${uploadedUrl ? 'border-green-200 bg-green-50/10' : 'border-gray-100 hover:border-brand-red/30 hover:bg-brand-red/5 bg-gray-50/30'
                        }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />

                      {uploadingFile ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
                          <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Uploading resume...</p>
                        </div>
                      ) : (
                        <>
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${uploadedUrl ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 shadow-sm'
                            }`}>
                            {uploadedUrl ? <Check size={28} /> : <Upload size={28} />}
                          </div>
                          <div className="text-center">
                            <p className="font-black text-brand-dark text-sm mb-1">
                              {file ? file.name : 'Drop resume here or click to upload'}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              PDF, DOC, DOCX up to 5MB
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message / Cover Note</label>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Introduce yourself, key achievements, or detail why you want to join AAJ Tech Trading..."
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-brand-red/5 border border-brand-red/10 p-4 rounded-2xl text-brand-red text-sm font-bold text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || uploadingFile}
                    className="w-full bg-brand-dark hover:bg-brand-red disabled:bg-gray-100 text-white py-6 rounded-2xl font-black text-xl transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center gap-3 group active:scale-[0.98] cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-24 md:py-32 bg-[#fafafa]">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 max-w-4xl">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 tracking-tight">
              Recruitment FAQs
            </h2>
            <p className="text-gray-500 font-medium">
              Got questions about our onboarding workflow? Here are some quick answers.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-8 py-6 text-left font-black text-lg text-brand-dark hover:text-brand-red flex items-center justify-between gap-4 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-red' : ''}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="faq-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-8 pb-8 pt-2 text-sm font-medium text-gray-500 leading-relaxed border-t border-gray-50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. Footer CTA */}
      <section className="py-24 bg-brand-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full border-[60px] border-white absolute"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
            Didn&apos;t find a suitable role?
          </h2>
          <p className="text-gray-400 text-base md:text-lg mb-10 font-medium max-w-xl mx-auto leading-relaxed">
            Send your resume and preferred project domain directly to our inbox. We will keep you in mind for upcoming openings.
          </p>
          <a
            href="mailto:info@aajtechtrading.com"
            className="inline-flex items-center gap-3 bg-brand-red hover:bg-brand-red-hover text-white font-black px-10 py-5 rounded-full text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-brand-red/25"
          >
            info@aajtechtrading.com
            <Mail size={16} />
          </a>
        </div>
      </section>

    </div>
  );
}
