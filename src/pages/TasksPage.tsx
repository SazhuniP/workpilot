import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Task, Project } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, Badge, Button, Modal, Input } from '../components/ui';
import { MoreHorizontal, Plus, Search, Filter, Calendar } from 'lucide-react';
import { motion, Reorder } from 'motion/react';
import { cn } from '../lib/utils';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const projs = await api.getProjects();
        setProjects(projs);
        
        const params = new URLSearchParams(window.location.search);
        const urlProjectId = params.get('projectId');
        
        if (urlProjectId && projs.some((p: any) => p.id === urlProjectId || p._id === urlProjectId)) {
          setSelectedProjectId(urlProjectId);
        } else if (projs.length > 0) {
          setSelectedProjectId(projs[0]._id || projs[0].id);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const tasksData = await api.getTasks();
        // Filter by project if selected
        const filteredTasks = selectedProjectId 
          ? tasksData.filter((t: any) => t.projectId === selectedProjectId)
          : tasksData;
        setTasks(filteredTasks);
      } catch (err) {
        console.error("Tasks fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, selectedProjectId]);

  const handleCreateTask = async (e: React.FormEvent, forceStatus?: string) => {
    e.preventDefault();
    if (!user || !newTaskTitle.trim() || !selectedProjectId) return;

    setIsCreating(true);
    try {
      const status = forceStatus || 'todo';
      await api.createTask({
        title: newTaskTitle.trim(),
        description: 'Newly created task',
        status: status,
        priority: 'medium',
        projectId: selectedProjectId,
      });
      
      // Refresh tasks
      const tasksData = await api.getTasks();
      const filteredTasks = selectedProjectId 
        ? tasksData.filter((t: any) => t.projectId === selectedProjectId)
        : tasksData;
      setTasks(filteredTasks);
      
      setNewTaskTitle('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const columns = [
    { title: 'Todo', status: 'todo', color: 'bg-zinc-500' },
    { title: 'In Progress', status: 'in-progress', color: 'bg-indigo-500' },
    { title: 'Completed', status: 'completed', color: 'bg-emerald-500' },
  ];

  return (
    <DashboardLayout title="Tasks Board">
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4 flex-1">
              <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-white uppercase tracking-widest font-bold text-[10px]">
                 <Search className="w-3.5 h-3.5" /> Use Global Search (⌘K)
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                 <Filter className="w-4 h-4" /> Filter
              </Button>
           </div>
           <Button onClick={() => setIsModalOpen(true)} className="gap-2 px-6">
             <Plus className="w-4 h-4" /> New Task
           </Button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Task"
        >
          <form onSubmit={(e) => handleCreateTask(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Project</label>
              <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all appearance-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Task Title</label>
              <Input 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isCreating}
              disabled={!newTaskTitle.trim() || !selectedProjectId}
            >
              Add Task
            </Button>
          </form>
        </Modal>

        <div className="flex gap-6 flex-1 overflow-x-auto pb-4 custom-scrollbar min-h-0">
          {columns.map(column => (
            <div key={column.status} className="flex flex-col min-w-[340px] max-w-[340px] bg-zinc-900/30 rounded-3xl p-5 border border-zinc-800/50">
               <div className="flex items-center justify-between mb-6 px-1">
                  <div className="flex items-center gap-2.5">
                     <span className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]", column.color)} />
                     <h3 className="text-sm font-bold text-white tracking-widest uppercase">{column.title}</h3>
                     <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold border border-zinc-700/50">
                        {tasks.filter(t => t.status === column.status).length}
                     </span>
                  </div>
                  <button className="text-zinc-500 hover:text-white transition-colors">
                     <MoreHorizontal className="w-4 h-4" />
                  </button>
               </div>

               <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                  {tasks.filter(t => t.status === column.status).length === 0 && !loading && (
                    <div className="h-24 border border-dashed border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-700 text-xs font-medium">
                      No tasks in this lane
                    </div>
                  )}
                  {tasks.filter(t => t.status === column.status).map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  <button 
                    onClick={() => {
                      setIsModalOpen(true);
                      // In a real app we'd pre-select the status, 
                      // but for now we just open the general modal
                    }}
                    className="w-full py-4 border border-dashed border-zinc-800 rounded-2xl text-zinc-600 text-xs font-bold hover:border-zinc-700 hover:text-zinc-400 hover:bg-zinc-800/20 transition-all flex items-center justify-center gap-2 group"
                  >
                     <Plus className="w-4 h-4 group-hover:scale-110 transition-transform text-zinc-700 group-hover:text-zinc-400" />
                     Add Task
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function TaskCard({ task }: { task: Task, key?: React.Key }) {
  return (
    <motion.div
      layoutId={task.id}
      whileHover={{ y: -4 }}
      className="bg-zinc-900 p-5 rounded-2xl shadow-xl border border-zinc-800/80 cursor-grab active:cursor-grabbing group hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
         <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'} className="lowercase text-[9px] px-2.5">
            {task.priority}
         </Badge>
         <button className="text-zinc-700 group-hover:text-zinc-500 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
         </button>
      </div>
      
      <h4 className="text-sm font-bold text-zinc-100 mb-2 leading-snug group-hover:text-white transition-colors tracking-tight">{task.title}</h4>
      <p className="text-[11px] text-zinc-500 line-clamp-2 mb-6 leading-relaxed">
         {task.description || 'Focusing on delivering high-quality results for this project segment.'}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
         <div className="flex items-center gap-2 text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
         </div>
         <div className="flex -space-x-2">
            <img 
              src={`https://ui-avatars.com/api/?name=${task.assigneeId}&background=random`} 
              className="w-6 h-6 rounded-full border-2 border-zinc-900 shadow-sm" 
              alt="avatar" 
            />
         </div>
      </div>
    </motion.div>
  );
}
