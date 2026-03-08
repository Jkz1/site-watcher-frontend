"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { setAuthCookie } from '../actions/auth';

export default function LoginPage() {
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL

  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${baseurl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token
        setAuthCookie(token); 
        toast.success("Login successfully!"); 
        console.log(token);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Login failed. Try again."); 
      }
    } catch (error) {
      toast.error("Network error. Is your Go backend running?");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020617] px-4 overflow-hidden">
      {/* Consistent Emerald Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/15 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-emerald-500/10 backdrop-blur-xl shadow-2xl">
          
          <div className="mb-8 text-center">
            <div className="inline-block w-12 h-12 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4 flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">System Login</h2>
            <p className="text-slate-400 mt-2 text-sm">Enter your credentials to access the console.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none" 
              required 
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <button 
              type="submit" 
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)]"
            >
              Authorize Access
            </button>
          </form>

          <div className="mt-8 flex justify-between items-center text-xs text-slate-500 uppercase tracking-widest font-bold">
            <Link href="/register" className="hover:text-emerald-400 transition-colors">Create Account</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Forgot Access?</Link>
          </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
           <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em]">Encrypted Connection Active</p>
        </div>
      </motion.div>
    </div>
  );
}