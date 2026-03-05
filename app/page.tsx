"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#030712] px-6 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-600/10 blur-[120px] animate-pulse" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest">Global Pings Active</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Sleep better with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            SiteWatcher
          </span>
        </h1>

        <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
          Monitor your websites with 1-minute intervals. Get instant alerts before your customers even notice a crash.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 bg-emerald-500 text-black rounded-2xl font-bold hover:bg-emerald-400 transition-all hover:scale-105">
            Start Monitoring
          </Link>
          <Link href="/login" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold backdrop-blur-md hover:bg-white/10">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}