"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020617] px-4 overflow-hidden">
      {/* Emerald Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-emerald-500/10 backdrop-blur-xl shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Secure your <span className="text-emerald-400">Stack</span>
            </h2>
            <p className="text-slate-400 mt-2 text-sm">Start monitoring your infrastructure in seconds.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ml-1">Admin Name</label>
              <input type="text" placeholder="John Doe" className="w-full p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" required />
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ml-1">Email Endpoint</label>
              <input type="email" placeholder="admin@company.com" className="w-full p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" required />
            </div>
            
            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ml-1">Access Key</label>
              <input type="password" placeholder="••••••••" className="w-full p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" required />
            </div>

            <button type="submit" className="w-full py-4 mt-4 bg-emerald-500 hover:bg-emerald-400 text-[#020617] rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              Create Admin Account
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Already registered?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}