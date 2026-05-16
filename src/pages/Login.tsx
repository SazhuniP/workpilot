import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '../context/NavigationContext';
import { Button, GlassCard } from '../components/ui';
import { Zap, ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';

export default function Login() {
  const { navigate } = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

      <div className="w-full max-w-sm relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-600/20">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-4 uppercase">WorkPilot</h1>
          <p className="text-zinc-500 font-medium mb-12 uppercase tracking-[0.2em] text-[10px]">Next Gen Workspace Management</p>
          
          <Button 
            onClick={() => navigate('/signup')}
            variant="primary" 
            className="w-full h-14 text-sm font-bold shadow-[0_0_30px_rgba(79,70,229,0.2)] mb-4"
          >
            Enter Workspace
          </Button>
          
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 mt-8">
            No authentication required • Version 2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
