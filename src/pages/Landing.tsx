import React from 'react';
import { motion } from 'motion/react';
import { Button, GlassCard } from '../components/ui';
import { Zap, CheckCircle2, Shield, ArrowRight, BarChart3, Users, Clock } from 'lucide-react';

export default function Landing({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Decorative Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex items-center justify-between border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">WorkPilot</span>
        </div>
        <div className="flex items-center gap-8">
           <a href="#features" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Features</a>
           <a href="#pricing" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Pricing</a>
           <Button onClick={onSignIn} variant="primary" size="sm" className="hidden sm:inline-flex">Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Now in Public Beta
            </span>
            <h1 className="text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-8">
              The project platform <br />
              <span className="text-zinc-600">for modern teams.</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Streamline your workflow with intuitive task management, real-time collaboration, and advanced analytics. Built for precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={onSignIn} size="lg" className="px-10 h-14 text-base gap-2 font-bold w-full sm:w-auto">
                Start for Free <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-10 h-14 text-base font-bold w-full sm:w-auto">
                View Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <GlassCard intensity="low" className="p-2 border-zinc-800 shadow-[0_0_100px_rgba(79,70,229,0.1)] relative z-10 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20" />
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                alt="WorkPilot Dashboard" 
                className="rounded-[22px] border border-zinc-800 shadow-inner group-hover:scale-[1.01] transition-transform duration-700"
              />
            </GlassCard>
            
            {/* Floaties */}
            <div className="hidden lg:block absolute -top-10 -right-10 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-30 animate-bounce group-hover:animate-none">
              <BarChart3 className="w-6 h-6 text-indigo-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Mini */}
      <section id="features" className="py-24 bg-zinc-900/30 border-y border-zinc-900 relative z-10">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center sm:text-left">
           {[
             { icon: BarChart3, title: 'In-depth Analytics', desc: 'Real-time charts and metrics to track your projects progress accurately.' },
             { icon: Users, title: 'Team Collaboration', desc: 'Assign tasks, share feedback, and keep everyone aligned in one place.' },
             { icon: Shield, title: 'Enterprise Security', desc: 'Role-based access control and secure data encryption by default.' }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center sm:items-start gap-4 group">
               <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:border-indigo-500/50 transition-colors">
                 <item.icon className="w-7 h-7 text-indigo-400" />
               </div>
               <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
               <p className="text-zinc-500 leading-relaxed max-w-xs">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-32 px-8 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 block">Workflow Optimized</span>
            <h2 className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Manage projects at <br /> the speed of light.
            </h2>
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed font-light">
              WorkPilot was built with an obsession for speed and clarity. No clutter, no distractions. Just your team and your work.
            </p>
            <ul className="space-y-4 mb-10">
              {['Smart task prioritization', 'Effortless team onboarding', 'Automated progress reports', 'Mobile responsive design'].map(text => (
                <li key={text} className="flex items-center gap-3 text-zinc-400 font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <Button onClick={onSignIn} variant="outline" className="gap-2 h-12 px-6">
              Explore Modules <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <GlassCard intensity="low" className="p-8 aspect-square flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <Clock className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                </div>
                <div>
                   <h4 className="font-bold text-xl mb-1 text-white">Timeline</h4>
                   <p className="text-xs text-zinc-500">Visual deadline management.</p>
                </div>
             </GlassCard>
             <GlassCard intensity="low" className="p-8 aspect-square flex flex-col justify-between translate-y-12 group hover:border-indigo-500/30 transition-all">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <Users className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                </div>
                <div>
                   <h4 className="font-bold text-xl mb-1 text-white">Team Sync</h4>
                   <p className="text-xs text-zinc-500">Real-time collaboration tools.</p>
                </div>
             </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-800/50 bg-zinc-900/10 relative z-10">
         <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
              <span className="text-xl font-bold tracking-tight text-white">WorkPilot</span>
            </div>
            <p className="text-zinc-500 text-sm">© 2026 WorkPilot SaaS. All rights reserved.</p>
            <div className="flex gap-8">
               {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
                 <a key={social} href="#" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">{social}</a>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
}
