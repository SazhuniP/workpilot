import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, Button, Input, GlassCard } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Camera, Github, Twitter, Linkedin } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8 pt-20">
          <div className="h-48 w-full bg-linear-to-r from-indigo-600 to-sky-600 rounded-3xl absolute top-0 left-0 -z-10 shadow-lg" />
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.fullName}&background=random&size=200`} 
                  alt={user.fullName} 
                  className="w-32 h-32 rounded-3xl border-4 border-zinc-950 shadow-2xl object-cover"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-indigo-600 rounded-xl border border-indigo-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight uppercase">{user.fullName}</h2>
                  <p className="text-zinc-500 font-medium">{user.designation || 'Product Designer'}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-2">
                    <Shield className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.role}</span>
                  </div>
                  <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-2">
                    <Mail className="w-3 h-3 text-sky-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="p-8">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
                  <Input value={user.fullName} readOnly />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                  <Input value={user.email} readOnly />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Designation</label>
                  <Input value={user.designation || 'Member'} readOnly />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Organization</label>
                  <Input value="WorkPilot Team" readOnly />
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                Account Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <div>
                    <h4 className="text-sm font-bold text-white">Password</h4>
                    <p className="text-xs text-zinc-500">Change your account password regularly for security</p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <div>
                    <h4 className="text-sm font-bold text-white">Two-Factor Authentication</h4>
                    <p className="text-xs text-zinc-500">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Connect</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                  <span className="text-xs font-bold">GitHub</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                  <span className="text-xs font-bold">Twitter</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                  <span className="text-xs font-bold">LinkedIn</span>
                </button>
              </div>
            </Card>

            <GlassCard className="p-8 bg-indigo-600/10 border-indigo-600/20">
              <h4 className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-widest">Storage Plan</h4>
              <p className="text-2xl font-bold text-white mb-4">Pro Plan</p>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>Usage</span>
                  <span>75%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-3/4 rounded-full" />
                </div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest">Upgrade</Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
