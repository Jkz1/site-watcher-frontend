"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Clock, Globe, Zap, AlertCircle, CheckCircle2, Loader2, Pause, Play } from 'lucide-react';
import { Site, SiteHealth } from '@/app/types/site';
import { useSiteHistory } from '@/app/hook/useHistory';
import { updateSiteStatus } from '@/app/actions/site';
import { toast } from 'sonner';


interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate: (siteId: number, is_active: boolean) => void;
    site: Site | null;
}

export default function SiteAnalyticsDrawer({ isOpen, onClose, onStatusUpdate, site }: DrawerProps) {
    if (!site) return null;
    
    const { history, isLoading, refresh } = useSiteHistory(site.id);

    const isUp = site.last_status === 200;
    const [isToggleLoading, setIsToggleLoading] = useState(false);
    const handleToggleStatus = async () => {
        setIsToggleLoading(true);
        try {
            const res = await updateSiteStatus(site.id, !site.is_active);
            if (res === false) {
                toast.error("Failed to update site status. Please try again.");
            } else {
                onStatusUpdate(site.id, !site.is_active);
                toast.success(`Site monitoring ${site.is_active ? 'paused' : 'resumed'} successfully.`);
            }
        } catch {
            toast.error("An unexpected error occurred. Please try again.");
        }
        setIsToggleLoading(false);
    }

    const handleRefresh = () => {
        console.log(site);
        refresh();
        console.log("After ref");
        console.log(site);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md md:max-w-lg bg-slate-950 border-l border-slate-800 shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {site.name}
                                    <span className={`w-2 h-2 rounded-full ${isUp ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                                </h2>
                                <p className="text-slate-500 font-mono text-xs mt-1 truncate max-w-[250px]">{site.url}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-2">
                                        <Zap size={14} className="text-emerald-400" /> Latency
                                    </div>
                                    <div className="text-2xl font-mono text-white">{site.latency_ms}<span className="text-sm text-slate-500 ml-1">ms</span></div>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-2">
                                        <Activity size={14} className="text-blue-400" /> Uptime
                                    </div>
                                    <div className="text-2xl font-mono text-white">99.9<span className="text-sm text-slate-500 ml-1">%</span></div>
                                </div>
                            </div>
                            <div className={`p-4 rounded-2xl border transition-all ${site.is_active ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center justify-center">
                                            <div className={`w-3 h-3 rounded-full ${site.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                            {site.is_active && <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500/50 blur-[4px]" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                {site.is_active ? 'Monitoring Active' : 'Monitoring Paused'}
                                            </p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                                                {isUp ? 'System Online' : 'System Down'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* THE TOGGLE BUTTON */}
                                    <button
                                        onClick={handleToggleStatus}
                                        disabled={isToggleLoading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${site.is_active
                                            ? 'bg-slate-800 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-transparent'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                            }`}
                                    >
                                        {isToggleLoading ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : site.is_active ? (
                                            <>
                                                <Pause size={14} fill="currentColor" /> Pause
                                            </>
                                        ) : (
                                            <>
                                                <Play size={14} fill="currentColor" /> Resume
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {/* Status Section */}
                            <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isUp ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                {isUp ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
                                <div>
                                    <p className={`font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isUp ? 'Operational' : 'Service Outage'}
                                    </p>
                                    <p className="text-xs text-slate-400">Verified via HTTP {site.last_status}</p>
                                </div>
                            </div>

                            {/* History List */}
                            <div>
                                <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2">
                                    <Clock size={16} /> Check History
                                </h3>
                                <div className="space-y-2">
                                    {history.map((log) => (
                                        <div
                                            key={log.id}
                                            className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${log.status_code === 200 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                <div>
                                                    <p className="text-sm font-mono text-slate-200">HTTP {log.status_code}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase">{new Date(log.checked_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-xs font-mono text-slate-400 group-hover:text-emerald-400 transition-colors">
                                                {log.latency_ms}ms
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                            <button onClick={handleRefresh} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                Refresh Analysis
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}