'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Briefcase,
  FileText,
  Check,
  Loader2,
  Download,
  Eye,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  Calendar,
  Filter,
  Layers
} from 'lucide-react';
import { Job, CareerApplication, Department } from '@/types';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

export default function CareerManagement() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'departments'>('jobs');

  // Jobs management state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [jobSubmitting, setJobSubmitting] = useState(false);

  // Departments management state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptNameInput, setDeptNameInput] = useState('');
  const [deptSubmitting, setDeptSubmitting] = useState(false);

  const initialJobForm = {
    title: '',
    department: '',
    location: 'New Delhi, Delhi',
    experience: '2-4 years',
    employmentType: 'Full-time',
    salary: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  };
  const [jobForm, setJobForm] = useState(initialJobForm);

  // Applications management state
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selectedApp, setSelectedApp] = useState<CareerApplication | null>(null);
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await fetch(`${API_BASE}/career/jobs`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await fetch(`${API_BASE}/career/applications`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      setLoadingDepts(true);
      const res = await fetch(`${API_BASE}/career/departments`);
      if (!res.ok) throw new Error('Failed to fetch departments');
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDepts(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      // Defer calls to yield to the event loop and prevent synchronous setState in effect
      await Promise.resolve();
      fetchJobs();
      fetchApplications();
      fetchDepartments();
    };
    init();
  }, []);

  // Job form actions
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description || !jobForm.department) {
      alert('Please fill out all required fields, including Department.');
      return;
    }

    setJobSubmitting(true);
    try {
      const url = editingJobId ? `${API_BASE}/career/jobs/${editingJobId}` : `${API_BASE}/career/jobs`;
      const method = editingJobId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobForm)
      });

      if (res.ok) {
        const result = await res.json();
        if (editingJobId) {
          setJobs(prev => prev.map(j => j.id === editingJobId ? result : j));
        } else {
          setJobs(prev => [result, ...prev]);
        }
        closeJobModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setJobSubmitting(false);
    }
  };

  const handleEditJobClick = (job: Job) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      experience: job.experience,
      employmentType: job.employmentType,
      salary: job.salary || '',
      description: job.description,
      status: job.status
    });
    setIsJobModalOpen(true);
  };

  const handleToggleJobStatus = async (job: Job) => {
    const nextStatus = job.status === 'active' ? 'inactive' : 'active';
    try {
      const updatedJob = { ...job, status: nextStatus };
      const res = await fetch(`${API_BASE}/career/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob)
      });

      if (res.ok) {
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: nextStatus } : j));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job opening?')) return;
    try {
      const res = await fetch(`${API_BASE}/career/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.id !== jobId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeJobModal = () => {
    setIsJobModalOpen(false);
    setEditingJobId(null);
    setJobForm(initialJobForm);
  };

  // Department actions
  const handleDeptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptNameInput.trim()) return;

    setDeptSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/career/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: deptNameInput.trim() })
      });
      if (res.ok) {
        const result = await res.json();
        setDepartments(prev => [...prev, result]);
        setDeptNameInput('');
        setIsDeptModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to add department');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeptSubmitting(false);
    }
  };

  const handleDeleteDept = async (deptId: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await fetch(`${API_BASE}/career/departments/${deptId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDepartments(prev => prev.filter(d => d.id !== deptId));
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to delete department');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Application actions
  const handleUpdateAppStatus = async (appId: string, status: string) => {
    setUpdatingAppId(appId);
    try {
      const res = await fetch(`${API_BASE}/career/applications/${appId}/status?status=${encodeURIComponent(status)}`, {
        method: 'PUT'
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: status as any } : a));
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(prev => prev ? { ...prev, status: status as any } : null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      const res = await fetch(`${API_BASE}/career/applications/${appId}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications(prev => prev.filter(a => a.id !== appId));
        if (selectedApp?.id === appId) setSelectedApp(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filters
  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
    j.department.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(jobSearchTerm.toLowerCase())
  );

  const filteredApps = applications.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
      a.position.toLowerCase().includes(appSearchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || a.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark mb-2 tracking-tight">Career Control Hub</h1>
          <p className="text-gray-400 font-bold">Manage job openings and evaluate incoming applicant documents.</p>
        </div>
        {activeTab === 'jobs' && (
          <button
            onClick={() => setIsJobModalOpen(true)}
            className="bg-brand-red hover:bg-brand-dark text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={22} />
            Post New Job
          </button>
        )}
        {activeTab === 'departments' && (
          <button
            onClick={() => setIsDeptModalOpen(true)}
            className="bg-brand-red hover:bg-brand-dark text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={22} />
            Add Department
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-8 py-4 font-black text-sm uppercase tracking-wider border-b-2 transition-all ${activeTab === 'jobs'
            ? 'border-brand-red text-brand-red bg-brand-red/5'
            : 'border-transparent text-gray-400 hover:text-brand-dark'
            }`}
        >
          Job Openings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-8 py-4 font-black text-sm uppercase tracking-wider border-b-2 transition-all ${activeTab === 'applications'
            ? 'border-brand-red text-brand-red bg-brand-red/5'
            : 'border-transparent text-gray-400 hover:text-brand-dark'
            }`}
        >
          Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-8 py-4 font-black text-sm uppercase tracking-wider border-b-2 transition-all ${activeTab === 'departments'
            ? 'border-brand-red text-brand-red bg-brand-red/5'
            : 'border-transparent text-gray-400 hover:text-brand-dark'
            }`}
        >
          Departments ({departments.length})
        </button>
      </div>

      {/* TABS CONTAINER */}

      {activeTab === 'jobs' && (
        <>
          {/* Job Filters */}
          <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search job title, department, location..."
                value={jobSearchTerm}
                onChange={(e) => setJobSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none"
              />
            </div>
          </div>

          {/* Job List Table */}
          {loadingJobs ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Loading Job Database...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <Briefcase size={48} className="mx-auto text-gray-200 mb-6" />
              <h3 className="text-xl font-black text-brand-dark mb-2">No matching job records</h3>
              <p className="text-gray-400 font-medium max-w-sm mx-auto">Try correcting your keywords.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Job Title</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Department</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Experience</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="font-black text-brand-dark group-hover:text-brand-red transition-colors text-base">{job.title}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{job.employmentType}</p>
                        </td>
                        <td className="px-8 py-6 font-bold text-sm text-gray-600">{job.department}</td>
                        <td className="px-8 py-6 font-bold text-sm text-gray-600">{job.location}</td>
                        <td className="px-8 py-6 font-bold text-sm text-gray-600">{job.experience}</td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full border ${job.status === 'active'
                            ? 'bg-green-50 text-green-600 border-green-200'
                            : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleToggleJobStatus(job)}
                              className={`p-2 rounded-xl border transition-all ${job.status === 'active'
                                ? 'hover:bg-green-50 text-green-500 border-green-100'
                                : 'hover:bg-gray-100 text-gray-400 border-gray-200'
                                }`}
                              title={job.status === 'active' ? "Disable Job" : "Enable Job"}
                            >
                              {job.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                            <button
                              onClick={() => handleEditJobClick(job)}
                              className="p-2 hover:bg-blue-50 hover:text-blue-600 text-gray-300 rounded-xl transition-all border border-transparent hover:border-blue-100"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 hover:bg-red-50 hover:text-brand-red text-gray-300 rounded-xl transition-all border border-transparent hover:border-red-100"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'applications' && (
        <>
          {/* Applications Filters */}
          <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search candidate name, email, role..."
                value={appSearchTerm}
                onChange={(e) => setAppSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-gray-50 border-none rounded-xl py-3 pl-12 pr-10 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all cursor-pointer h-[52px]"
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications List Table */}
          {loadingApps ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Loading applications...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <FileText size={48} className="mx-auto text-gray-200 mb-6" />
              <h3 className="text-xl font-black text-brand-dark mb-2">No matching applicant records</h3>
              <p className="text-gray-400 font-medium max-w-sm mx-auto">Modify your filters or keywords.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Candidate Info</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Applying Position</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Resume</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Applied Date</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="font-black text-brand-dark text-base">{app.name}</p>
                          <div className="flex flex-col gap-0.5 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Mail size={12} /> {app.email}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {app.phone}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-bold text-sm text-gray-600">
                          {app.position}
                          <p className="text-[10px] text-gray-400">Exp: {app.experience}</p>
                        </td>
                        <td className="px-8 py-6">
                          <a
                            href={app.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-black text-brand-red hover:underline"
                          >
                            <Download size={14} /> Download
                          </a>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-gray-400">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </td>
                        <td className="px-8 py-6">
                          <select
                            value={app.status}
                            disabled={updatingAppId === app.id}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full border cursor-pointer ${app.status === 'Selected' ? 'bg-green-50 text-green-600 border-green-200' :
                              app.status === 'Rejected' ? 'bg-red-50 text-brand-red border-brand-red/10' :
                                app.status === 'Interview Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                  app.status === 'Under Review' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                    'bg-gray-50 text-gray-600 border-gray-200'
                              }`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Interview Scheduled">Interview</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="p-2 hover:bg-gray-100 text-gray-400 hover:text-brand-dark rounded-xl transition-all border border-transparent hover:border-gray-200"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteApp(app.id)}
                              className="p-2 hover:bg-red-50 hover:text-brand-red text-gray-300 rounded-xl transition-all border border-transparent hover:border-red-100"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'departments' && (
        <>
          <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="font-bold text-gray-500 text-sm">Add and delete organization departments. Any modifications will instantly sync with the compose forms.</div>
          </div>

          {loadingDepts ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <Layers size={48} className="mx-auto text-gray-200 mb-6" />
              <h3 className="text-xl font-black text-brand-dark mb-2">No departments created yet</h3>
              <p className="text-gray-400 font-medium max-w-sm mx-auto">Click &quot;Add Department&quot; to populate your domains.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Department Name</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date Added</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {departments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6 font-black text-brand-dark text-base">{dept.name}</td>
                        <td className="px-8 py-6 text-xs font-bold text-gray-400">
                          {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleDeleteDept(dept.id)}
                            className="p-2 hover:bg-red-50 hover:text-brand-red text-gray-300 rounded-xl transition-all border border-transparent hover:border-red-100"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ADD/EDIT JOB OPENING MODAL */}
      <AnimatePresence>
        {isJobModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeJobModal}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[40px] w-full max-w-3xl relative z-10 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-brand-dark p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center shadow-xl shadow-brand-red/20">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic">{editingJobId ? 'Edit Job Opening' : 'Compose Job Opening'}</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{editingJobId ? 'Updating Details' : 'Creation of Career Slot'}</p>
                  </div>
                </div>
                <button
                  onClick={closeJobModal}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <form className="space-y-8" onSubmit={handleJobSubmit}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Job Title */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                      <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4.5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        placeholder="e.g. Sales Executive"
                        required
                      />
                    </div>
                    {/* Department */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                      <select
                        value={jobForm.department}
                        onChange={(e) => setJobForm(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4.5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all cursor-pointer"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Location */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                      <input
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4.5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none"
                        required
                      />
                    </div>
                    {/* Experience */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Experience</label>
                      <input
                        type="text"
                        value={jobForm.experience}
                        onChange={(e) => setJobForm(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4.5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="e.g. 2-4 years"
                        required
                      />
                    </div>
                    {/* Employment Type */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Employment Type</label>
                      <select
                        value={jobForm.employmentType}
                        onChange={(e) => setJobForm(prev => ({ ...prev, employmentType: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4.5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Salary */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Salary (Optional)</label>
                      <input
                        type="text"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm(prev => ({ ...prev, salary: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4.5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="e.g. ₹3,00,000 - ₹5,00,000 P.A."
                      />
                    </div>
                    {/* Status */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                      <select
                        value={jobForm.status}
                        onChange={(e) => setJobForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4.5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none"
                      >
                        <option value="active">Active (Visible on public site)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description / Requirements</label>
                    <textarea
                      rows={6}
                      value={jobForm.description}
                      onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none resize-none"
                      placeholder="List details about the role, key responsibilities, qualifications, and core technical skills..."
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-6 pt-6">
                    <button
                      type="button"
                      onClick={closeJobModal}
                      className="flex-1 py-5 rounded-[20px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-50 transition-all cursor-pointer text-center"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={jobSubmitting}
                      className="flex-[2] bg-brand-dark hover:bg-brand-red text-white py-5 rounded-[20px] font-black text-lg transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50 cursor-pointer"
                    >
                      {jobSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          {editingJobId ? 'Update Opening' : 'Publish Opening'}
                          <Check size={20} className="group-hover:scale-125 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW APPLICATION DETAILS DETAILS MODAL */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[40px] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-brand-dark p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center shadow-xl shadow-brand-red/20">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic">Applicant Profile</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Detailed Evaluation View</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Candidate Name</span>
                    <p className="text-xl font-black text-brand-dark">{selectedApp.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Department</span>
                    <p className="text-xl font-black text-brand-red">{selectedApp.department || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Position Applied</span>
                    <p className="font-bold text-gray-600">{selectedApp.position}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Email Address</span>
                    <p className="font-bold text-gray-600">{selectedApp.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Phone Number</span>
                    <p className="font-bold text-gray-600">{selectedApp.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center border-y border-gray-100 py-6">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Experience</span>
                    <p className="font-black text-brand-dark text-base">{selectedApp.experience}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Current CTC</span>
                    <p className="font-black text-brand-dark text-base">{selectedApp.currentCTC}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Expected CTC</span>
                    <p className="font-black text-brand-dark text-base">{selectedApp.expectedCTC}</p>
                  </div>
                </div>

                {selectedApp.message && (
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">Cover Message</span>
                    <p className="bg-gray-50/50 p-6 rounded-2xl text-sm leading-relaxed text-gray-500 font-medium whitespace-pre-wrap border border-gray-100">
                      {selectedApp.message}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-400">
                      Applied: {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <a
                      href={selectedApp.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all"
                    >
                      <Download size={14} /> Resume File
                    </a>

                    <select
                      value={selectedApp.status}
                      onChange={(e) => handleUpdateAppStatus(selectedApp.id, e.target.value)}
                      className="flex-1 sm:flex-none text-xs font-black uppercase tracking-wider px-4 py-3 rounded-xl border bg-gray-50 border-gray-200"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Interview Scheduled">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD DEPARTMENT MODAL */}
      <AnimatePresence>
        {isDeptModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeptModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[40px] w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-brand-dark p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center shadow-xl shadow-brand-red/20">
                    <Layers size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic">Add Department</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Configure New Domain</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDeptModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <div className="p-8">
                <form className="space-y-6" onSubmit={handleDeptSubmit}>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department Name</label>
                    <input
                      type="text"
                      value={deptNameInput}
                      onChange={(e) => setDeptNameInput(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4.5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                      placeholder="e.g. Finance, Logistics"
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsDeptModalOpen(false)}
                      className="flex-1 py-4.5 rounded-[20px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-50 transition-all cursor-pointer text-center text-xs"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={deptSubmitting}
                      className="flex-[2] bg-brand-dark hover:bg-brand-red text-white py-4.5 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                    >
                      {deptSubmitting ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          Create
                          <Check size={16} className="group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
