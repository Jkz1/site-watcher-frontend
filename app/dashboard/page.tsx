"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AddSiteModal from '../components/dashboard/add-site-modal';
import { getAuthCookie } from '../actions/auth';

export default function Dashboard() {
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL

  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sites, setSites] = useState([
    { id: 1, name: "Main API", url: "api.mysite.com", status: "Online", uptime: "99.9%", latency: "42ms" },
    { id: 2, name: "Storefront", url: "shop.mysite.com", status: "Online", uptime: "98.2%", latency: "120ms" },
    { id: 3, name: "Legacy Blog", url: "blog.old.com", status: "Error", uptime: "45.0%", latency: "—" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleAddSite = async (site: { name: string; url: string }, e: React.FormEvent) => {
    e.preventDefault();
    const token = await getAuthCookie();
    console.log(token);
    console.log(site);
    try {
      const response = await fetch(`${baseurl}/sites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(site),
      });

      if (response.ok) {
        toast.success("Site added successfully!"); // 2. Success Toast
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add site. Try again."); // 3. Error Toast
      }
    } catch (error) {
      toast.error("Network error. Is your Go backend running?");
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-emerald-500/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <span className="text-xl font-bold text-white tracking-tight">
          Site<span className="text-emerald-400">Watcher</span>
        </span>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-[#020617] font-bold text-xs">
              JD
            </div>
            <span className="text-sm font-medium text-slate-300">Admin</span>
          </button>
          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 py-2 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-xl"
              >
                <div className="px-4 py-2 border-b border-slate-800 mb-2">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Account</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Infrastructure</h1>
            <p className="text-slate-400 mt-1 font-mono text-sm">Monitoring {sites.length} targets active</p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-[#020617] rounded-xl font-bold hover:bg-emerald-400 transform active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="text-xl leading-none">+</span>
            Add Target Site
          </button>
        </div>

        {/* Global Health Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Overall Health</p>
            <p className="text-emerald-400 text-xl font-bold mt-1">92.4% Optimal</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Average Latency</p>
            <p className="text-white text-xl font-bold mt-1">81ms</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Incident Reports</p>
            <p className="text-red-400 text-xl font-bold mt-1">1 Critical</p>
          </div>
        </div>

        {/* Sites List */}
        <div className="space-y-4">
          {sites.map((site) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-6 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${site.status === 'Online' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                  <div className={`absolute inset-0 w-3 h-3 rounded-full blur-[6px] ${site.status === 'Online' ? 'bg-emerald-500/80' : 'bg-red-500/80'}`} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{site.name}</h3>
                  <p className="text-slate-500 text-xs font-mono">{site.url}</p>
                </div>
              </div>

              <div className="flex flex-1 justify-center gap-12">
                <div className="text-center">
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 tracking-tighter">Uptime</p>
                  <p className="text-white font-mono text-sm">{site.uptime}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 tracking-tighter">Latency</p>
                  <p className={`font-mono text-sm ${site.status === 'Online' ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {site.latency}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-slate-700">
                  Analytics
                </button>
                <button className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <AddSiteModal isModalOpen={isModalOpen} onClose={setIsModalOpen} onAdd={handleAddSite} />
    </div>
  );
}