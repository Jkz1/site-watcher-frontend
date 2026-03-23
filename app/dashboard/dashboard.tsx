"use client";
import { useEffect, useState } from 'react';
import { Play, Pause, Loader2, TrashIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AddSiteModal from '../components/dashboard/add-site-modal';
import { clearAuthCookie, getAuthCookie } from '../actions/auth';
import { deleteSite, getHistory, updateSiteStatus } from '../actions/site';
import { Site } from '../types/site';
import SiteAnalyticsDrawer from '../components/dashboard/site-analytics-drawer';
import { useSiteWatcher } from '../hook/useSiteWatcher';
import { DeleteSiteModal } from '../components/dashboard/delete-site-modal';


export default function Dashboard({ initialData, getSiteFunction }: { initialData: Site[], getSiteFunction: () => Promise<Site[]> }) {
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter();
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sites, setSites] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getAuthCookie().then((t) => {
      if (!t) {
        router.replace('/login');
      } else {
        setToken(t);
      }
    });
  }, []);

  const watcher = useSiteWatcher(token, setSites);

  const handleLogout = async () => {
    await clearAuthCookie();
    router.replace('/login');
  };

  const handleAddSite = async (site: { name: string; url: string }, e: React.FormEvent) => {
    e.preventDefault();
    const token = await getAuthCookie();
    try {
      const response = await fetch(`${baseurl}/sites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(site),
      });

      if (response.ok) {
        toast.success("Site added successfully!");
        setIsModalOpen(false);
        getSiteFunction().then((data) => setSites(data));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add site. Try again.");
      }
    } catch (error) {
      toast.error("Network error. Is your Go backend running?");
    }
  }
  const [isLoading, setIsLoading] = useState(false);

  const updateLocalSite = (siteId: number, is_active: boolean) => {
    setSites((prevSites) =>
      prevSites.map((s) => (s.id === siteId ? { ...s, is_active } : s))
    );


    if (activeSite?.id === siteId) {
      setActiveSite((prev) => prev ? { ...prev, is_active } : null);
    }
  };
  const handleToggle = async (idx: number) => {
    setIsLoading(true);
    try {
      const res = await updateSiteStatus(sites[idx].id, !sites[idx].is_active);
      if (res === false) {
        toast.error("Failed to update site status. Please try again.");
      } else {
        const updatedSites = [...sites];
        updatedSites[idx] = {
          ...updatedSites[idx],
          is_active: !updatedSites[idx].is_active
        };
        setSites(updatedSites);
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  const handleAnalytics = async (site: Site) => {
    setActiveSite(site);
    setAnalyticsOpen(true);
  }
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const handleDelete = (site: Site) => {
    setSiteToDelete(site);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      console.log(siteToDelete.id);
      await deleteSite(siteToDelete.id);
      toast.success("Site deleted successfully!");
      setSites((prev) => prev.filter((s) => s.id !== siteToDelete.id));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete site. Please try again.");
    }
    setLoading(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <DeleteSiteModal 
        isOpen={isDeleteModalOpen}
        siteName={siteToDelete?.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={loading}
      />
      <SiteAnalyticsDrawer
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        site={activeSite}
        onStatusUpdate={updateLocalSite}
      />

      <nav className="flex justify-between items-center px-8 py-4 border-b border-emerald-500/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <span className="text-xl font-bold text-white tracking-tight">
          Site<span className="text-emerald-400">Watcher</span>
        </span>
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-[#020617] font-bold text-xs">
              JD
            </div>
            <span className="text-sm font-medium text-slate-300">Admin</span>
          </button>


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

        <div className="space-y-4">
          {sites.map((site: Site, idx: number) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 items-center gap-6 transition-all"
            >

              <div className="flex items-center gap-4 md:col-span-4 min-w-0">
                <div className="relative shrink-0">
                  <div
                    key={`ping-${site.id}-${site.last_status}-${site.latency_ms}-${site.last_checked}`}
                    className="absolute w-full h-full rounded-full bg-emerald-500/50 animate-ping-once"
                  />

                  <div className={`w-3 h-3 rounded-full ${site.last_status === 200 ? 'bg-emerald-500' : 'bg-red-500'} ${site.is_active ? 'animate-pulse' : ''}`} />
                  <div className={`absolute inset-0 w-3 h-3 rounded-full blur-[6px] ${site.last_status === 200 ? 'bg-emerald-500/80' : 'bg-red-500/80'}`} />
                </div>
                <div className="truncate">
                  <h3 className="text-white font-bold text-lg leading-tight truncate">{site.name}</h3>
                  <p className="text-slate-500 text-xs font-mono truncate">{site.url}</p>
                </div>
              </div>


              <div className="flex justify-between md:justify-around md:col-span-5 border-y md:border-y-0 border-slate-800 py-4 md:py-0">
                <div className="text-center">
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 tracking-tighter font-mono">Status</p>
                  <p className={`text-sm font-mono ${site.last_status === 200 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {site.last_status === 200 ? 'HTTP 200' : `ERR ${site.last_status}`}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 tracking-tighter font-mono">Latency</p>
                  <p className={`font-mono text-sm ${site.last_status === 200 ? 'text-white' : 'text-slate-600'}`}>
                    {site.last_status === 200 ? `${site.latency_ms}ms` : '—'}
                  </p>
                </div>
                <div className="text-center hidden lg:block">
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 tracking-tighter font-mono">Monitored Since</p>
                  <p className="text-slate-300 font-mono text-sm">
                    {site.created_at.split('T')[0]}
                  </p>
                </div>
              </div>


              <div className="flex items-center justify-end gap-3 md:col-span-3">
                <button
                  onClick={() => handleToggle(idx)}
                  disabled={isLoading}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all duration-300 border backdrop-blur-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} ${site.is_active ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500/50'}`}
                >
                  <div className="relative w-3 h-3 flex items-center justify-center">
                    {isLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : site.is_active ? (
                      <>
                        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20"></span>
                        <Pause size={12} fill="currentColor" className="relative transition-transform group-hover:scale-110" />
                      </>
                    ) : (
                      <Play size={12} fill="currentColor" className="transition-transform group-hover:scale-110" />
                    )}
                  </div>
                  <span className="tracking-wider">{site.is_active ? 'Monitoring' : 'Paused'}</span>
                </button>

                <button onClick={() => handleAnalytics(site)} className="hidden sm:block px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-slate-700">
                  Analytics
                </button>

                <button onClick={() => handleDelete(site)} className="p-2 text-slate-500 hover:text-red-400 transition-colors shrink-0">
                  <TrashIcon />
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