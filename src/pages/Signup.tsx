import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '../context/NavigationContext';
import { Button, GlassCard } from '../components/ui';
import { Zap, Loader2, User, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function Signup() {
  const { signUpWithEmail, loading, error } = useAuth();
  const { navigate } = useNavigate();
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;
    try {
      // Pass fake email/password to keep context method signature
      const fakeEmail = `${fullName.toLowerCase().replace(/\s+/g, '.')}@guest.local`;
      await signUpWithEmail(fakeEmail, 'no-password', fullName, role);
      navigate('/');
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      
      <div className="w-full max-w-md relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to WorkPilot</h1>
            <p className="text-zinc-500 font-medium tracking-tight">Enter your name to start managing</p>
          </div>

          <GlassCard className="p-8 border-zinc-800 shadow-2xl bg-zinc-900/40">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Sazhuni P"
                    required
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Choose Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('member')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                      role === 'member' 
                        ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' 
                        : 'bg-zinc-950/30 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                      role === 'admin' 
                        ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' 
                        : 'bg-zinc-950/30 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </button>
                </div>
              </div>

              <Button 
                type="submit"
                variant="primary" 
                className="w-full h-12 text-sm font-bold shadow-[0_0_20px_rgba(79,70,229,0.15)] mt-4"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Started'}
              </Button>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-red-500 text-center leading-relaxed">
                    {error}
                  </p>
                </div>
              )}
            </form>
          </GlassCard>

          <p className="text-center mt-10 text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600">
            Powered by WorkPilot v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
