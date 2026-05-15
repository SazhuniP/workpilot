import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, Button, Badge, Modal } from '../components/ui';
import { Users as UsersIcon, UserPlus, Mail, Shield, MoreVertical, Search, Filter, Calendar, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const teamMembers = [
  { id: 1, name: 'Sazhuni P', email: 'sazhuni@gmail.com', role: 'admin', status: 'Online', tasks: 12, joined: 'Jan 2024' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@workpilot.com', role: 'member', status: 'In Meeting', tasks: 8, joined: 'Mar 2024' },
  { id: 3, name: 'John Doe', email: 'john@workpilot.com', role: 'member', status: 'Offline', tasks: 4, joined: 'Feb 2024' },
  { id: 4, name: 'Emma Wilson', email: 'emma@workpilot.com', role: 'member', status: 'Online', tasks: 15, joined: 'May 2024' },
  { id: 5, name: 'Michael Ross', email: 'michael@workpilot.com', role: 'member', status: 'On Leave', tasks: 0, joined: 'Nov 2023' },
];

export default function Team() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);

  return (
    <DashboardLayout title="Team Management">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
           <div>
              <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Collaborators</h2>
              <p className="text-zinc-500 text-xs font-medium">Manage your team and their access levels.</p>
           </div>
           <Button 
              className="gap-2 px-6"
              onClick={() => alert('Invite member modal coming soon!')}
            >
              <UserPlus className="w-4 h-4" /> Invite Member
           </Button>
        </div>

        <div className="flex items-center gap-4">
           <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-white uppercase tracking-widest font-bold text-[10px]">
              <Search className="w-3.5 h-3.5" /> Use Global Search (⌘K)
           </Button>
           <Button variant="outline" size="sm" className="gap-2 ml-4">
              <Filter className="w-4 h-4" /> Filter
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {teamMembers.map((member, i) => (
             <motion.div
               key={member.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.05 }}
             >
               <Card 
                 onClick={() => setSelectedMember(member)}
                 className="p-6 hover:shadow-xl transition-all group hover:border-zinc-700 bg-zinc-900/50 cursor-pointer"
               >
                  <div className="flex items-start justify-between mb-6">
                     <div className="relative">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                          alt={member.name} 
                          className="w-14 h-14 rounded-2xl border border-zinc-800 shadow-xl"
                        />
                        <span className={cn(
                          "absolute -bottom-1 -right-1 w-4 h-4 border-2 border-zinc-900 rounded-full shadow-inner",
                          member.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : member.status === 'In Meeting' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-zinc-700'
                        )} />
                     </div>
                     <button className="text-zinc-600 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="mb-6">
                     <h3 className="text-base font-bold text-white mb-0.5 tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{member.name}</h3>
                     <p className="text-xs text-zinc-500 font-medium mb-4">{member.email}</p>
                     <div className="flex items-center gap-2">
                        <Badge variant={member.role === 'admin' ? 'info' : 'default'} className="text-[9px] uppercase tracking-widest font-bold">
                           {member.role}
                        </Badge>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">• {member.tasks} tasks</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="w-full text-[11px] font-bold gap-2 bg-zinc-900/50 hover:bg-zinc-800"
                       onClick={(e) => {
                         e.stopPropagation();
                         alert(`Starting chat with ${member.name}`);
                       }}
                     >
                        <Mail className="w-3 h-3" /> Message
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="w-full text-[11px] font-bold gap-2 bg-zinc-900/50 hover:bg-zinc-800"
                       onClick={(e) => {
                         e.stopPropagation();
                         alert(`Reviewing permissions for ${member.name}`);
                       }}
                     >
                        <Shield className="w-3 h-3" /> Auth
                     </Button>
                  </div>
               </Card>
             </motion.div>
           ))}

           <button 
             onClick={() => alert('Add member modal coming soon!')}
             className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-zinc-900/10 hover:bg-zinc-900/30 hover:border-zinc-700 transition-all group"
           >
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-lg">
                 <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-zinc-600 group-hover:text-white transition-colors uppercase tracking-[0.2em] leading-none">
                 Add New Member
              </span>
           </button>
        </div>

        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title="Member Details"
        >
          {selectedMember && (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedMember.name}&background=random&size=128`} 
                  alt={selectedMember.name} 
                  className="w-20 h-20 rounded-3xl border-4 border-zinc-800 shadow-2xl"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight uppercase">{selectedMember.name}</h3>
                  <p className="text-zinc-500 font-medium mb-2">{selectedMember.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedMember.role === 'admin' ? 'info' : 'default'} className="uppercase tracking-widest text-[10px]">
                      {selectedMember.role}
                    </Badge>
                    <Badge variant="success" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/10 uppercase tracking-widest">
                       {selectedMember.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1 text-zinc-500">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Tasks</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{selectedMember.tasks}</p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1 text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Joined</span>
                  </div>
                  <p className="text-xl font-bold text-white">{selectedMember.joined}</p>
                </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Member Bio</h4>
                 <p className="text-xs text-zinc-400 leading-relaxed">
                   Key contributor at WorkPilot. Expert in system optimization and technical leadership. 
                   Passionate about building scalable and intuitive user experiences.
                 </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Recent Activity</h4>
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-300">Completed task #24{i}</p>
                        <p className="text-[10px] text-zinc-600 font-medium">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <Button className="flex-1 gap-2 border-zinc-800 hover:bg-zinc-800" variant="outline">
                  <Mail className="w-4 h-4" /> Message
                </Button>
                <Button className="flex-1 gap-2 border-zinc-800 hover:bg-zinc-800" variant="outline">
                  <Shield className="w-4 h-4" /> Auth
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
