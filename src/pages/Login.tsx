import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { Button, Card, GlassCard } from '../components/ui';
import { Zap, ArrowLeft, Loader2 } from 'lucide-react';

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, error, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      if (isSignUp) {
        const { updateProfile } = await import('firebase/auth');
        const userCredential = await signUpWithEmail(email, password);
        // Wait for profile listener or manually update display name
        if (auth.currentUser && fullName) {
          await updateProfile(auth.currentUser, { displayName: fullName });
        }
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="absolute top-8 left-8">
        <a href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </a>
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-zinc-500 font-medium tracking-tight">
              {isSignUp ? 'Start managing your projects today' : 'Access your project workspace'}
            </p>
          </div>

          <GlassCard className="p-8 border-zinc-800 shadow-2xl bg-zinc-900/40">
            <div className="space-y-6">
              <Button 
                onClick={signInWithGoogle} 
                className="w-full h-12 gap-3 text-base shadow-[0_0_20px_rgba(79,70,229,0.15)]" 
                variant="primary"
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest leading-none">
                  <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required={isSignUp}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                  />
                </div>
                <Button 
                  type="submit"
                  variant="secondary" 
                  className="w-full h-12 text-sm font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign in with Email'
                  )}
                </Button>
              </form>

              <div className="text-center">
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-widest"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-500 text-xs text-center font-medium">{error}</p>
                </div>
              )}
            </div>
          </GlassCard>

          <p className="mt-8 text-center text-xs text-zinc-600">
            By signing in, you agree to our <br />
            <a href="#" className="text-zinc-400 font-bold hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="text-zinc-400 font-bold hover:text-white transition-colors">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
