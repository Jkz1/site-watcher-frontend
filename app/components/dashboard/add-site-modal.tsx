import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AddSiteModalProps {
  isModalOpen: boolean;
  onClose: (v: boolean) => void;
  onAdd: (site: { name: string; url: string }, e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddSiteModal({ isModalOpen, onClose, onAdd }: AddSiteModalProps) {
  const [formData, setFormData] = useState({ name: '', url: '' });
  return (
    <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onClose(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Slide-over Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-emerald-500/20 shadow-2xl z-[70] p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Add New <span className="text-emerald-400">Target</span></h2>
                <button onClick={() => onClose(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>

              <form className="space-y-6" onSubmit={(e) => onAdd(formData, e)}>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Auth Service"
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">Endpoint URL</label>
                  <input
                    type="url"
                    placeholder="https://api.example.com/health"
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500/50"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-xs text-emerald-400/80 leading-relaxed font-mono">
                    ⚡ SiteWatcher will ping this endpoint every 60 seconds from our Global Edge nodes.
                  </p>
                </div>

                <button type="submit" className="w-full py-4 bg-emerald-500 text-[#020617] rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  Add the Site
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
  );
}