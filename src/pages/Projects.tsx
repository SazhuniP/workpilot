import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '../context/NavigationContext';
import { Project } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, Button, Badge, Modal, Input } from '../components/ui';
import { Plus, MoreVertical, Users, CheckCircle2, Clock, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Projects() {
  const { user } = useAuth();
  const { navigate } = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'projects'),
      where('members', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Removed handleSeed function

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProjectName.trim()) return;

    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        name: newProjectName.trim(),
        description: 'New workspace created for ' + newProjectName,
        members: [user.uid],
        ownerId: user.uid,
        status: 'active',
        progress: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewProjectName('');
      setIsModalOpen(false);
      navigate(`/tasks?projectId=${docRef.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout title="Projects">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">Active Workspaces</h2>
            <p className="text-zinc-500 text-xs font-medium">You have {projects.length} active projects</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> New Workspace
            </Button>
          </div>
        </div>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Create New Workspace"
        >
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Workspace Name</label>
              <Input 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g. Acme Marketing"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isCreating}
              disabled={!newProjectName.trim()}
            >
              Create Project
            </Button>
          </form>
        </Modal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
             <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <BarChart2 className="w-8 h-8 text-zinc-700" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
             <p className="text-sm text-zinc-500 mb-8 max-w-xs text-center font-medium leading-relaxed">
                Create your first project to start managing tasks and collaborating with your team.
             </p>
             <Button onClick={() => setIsModalOpen(true)} variant="primary">Create Your First Project</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project, i) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={i} 
                  onOpen={() => navigate(`/tasks?projectId=${project.id}`)} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project, index: number, onOpen: () => void, key?: React.Key }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        onClick={onOpen}
        className="group hover:border-zinc-700 transition-all cursor-pointer p-6"
      >
        <div className="flex items-start justify-between mb-8">
           <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all shadow-inner">
              <BarChart2 className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
           </div>
           <Badge variant={project.status === 'active' ? 'success' : 'default'}>
              {project.status}
           </Badge>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:translate-x-1 transition-transform">{project.name}</h3>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed h-8">
            {project.description}
          </p>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Progress</span>
              <span className="text-indigo-400">{project.progress}%</span>
           </div>
           <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
              />
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
           <div className="flex -space-x-2">
              {project.members.map((m, i) => (
                <img 
                  key={i} 
                  src={`https://ui-avatars.com/api/?name=${m}&background=random`} 
                  className="w-7 h-7 rounded-full border-2 border-zinc-950 ring-1 ring-zinc-800 shadow-sm" 
                  alt="member" 
                />
              ))}
              <div className="w-7 h-7 rounded-full border-2 border-zinc-950 ring-1 ring-zinc-800 bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                +2
              </div>
           </div>
           <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-widest">Open</span>
              <CheckCircle2 className="w-4 h-4" />
           </div>
        </div>
      </Card>
    </motion.div>
  );
}
