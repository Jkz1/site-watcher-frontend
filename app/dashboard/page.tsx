"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [sites, setSites] = useState([
    { id: 1, name: "Main API", url: "api.mysite.com", status: "Online", uptime: "99.9%", latency: "42ms" },
    { id: 2, name: "Storefront", url: "shop.mysite.com", status: "Online", uptime: "98.2%", latency: "120ms" },
    { id: 3, name: "Legacy Blog", url: "blog.old.com", status: "Error", uptime: "45.0%", latency: "—" },
  ]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      <nav className="flex justify-between items-center px-8 py-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl">
        <span className="text-xl font-bold text-white">Site<span className="text-emerald-400">Watcher</span></span>
        <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-bold hover:bg-emerald-500 hover:text-black transition-all">
          + Add New Site
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Infrastructure</h1>
            <p className="text-slate-400">Monitoring {sites.length} targets with 1m pings</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Status</span>
            <p className="text-emerald-400 font-bold">Mostly Operational</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sites.map((site) => (
            <motion.div 
              key={site.id}
              whileHover={{ x: 5 }}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${site.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} animate-pulse`} />
                <div>
                  <h3 className="text-white font-bold">{site.name}</h3>
                  <p className="text-slate-500 text-sm">{site.url}</p>
                </div>
              </div>

              <div className="flex gap-12 text-center">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Uptime</p>
                  <p className="text-white font-mono">{site.uptime}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Latency</p>
                  <p className="text-white font-mono">{site.latency}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Interval</p>
                  <p className="text-white font-mono">1m</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">Settings</button>
                <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400">Pause</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}