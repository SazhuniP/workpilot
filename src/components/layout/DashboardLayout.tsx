import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from '../../context/NavigationContext';
import { Button, Badge, Modal } from '../ui';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { currentPath, navigate } = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Briefcase, path: '/projects' },
    { name: 'My Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Team', icon: Users, path: '/team' },
  ];

  return (
    <div className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen overflow-hidden">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">WorkPilot</span>
      </div>

      <div className="px-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Quick search..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Main Menu</p>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-zinc-900 text-indigo-400 border border-zinc-800 shadow-sm shadow-black/20" 
                  : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/50"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
              {item.name}
              {isActive && (
                <motion.div layoutId="sidebar-active" className="ml-auto w-1 h-1 bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="mt-4 flex items-center gap-3 px-2 py-3 border-t border-zinc-800">
          <img 
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`} 
            alt="User" 
            className="w-8 h-8 rounded-full border border-zinc-800 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.displayName}</p>
            <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
          </div>
          <button onClick={signOut} className="text-zinc-500 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Header({ title }: { title: string }) {
  const { user } = useAuth();
  const { navigate } = useNavigate();
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = React.useState<{ id: string, title: string, type: 'project' | 'task', path: string }[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim() || !user) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const projectsRef = collection(db, 'projects');
        const qProjects = query(
          projectsRef, 
          where('members', 'array-contains', user.uid),
          limit(5)
        );
        const projectsSnap = await getDocs(qProjects);
        const projectResults = projectsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as any))
          .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(p => ({ id: p.id, title: p.name, type: 'project' as const, path: '/projects' }));

        setResults(projectResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, user]);

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.history.back()}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => window.history.forward()}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
             <span className="hover:text-zinc-100 cursor-pointer transition-colors" onClick={() => navigate('/')}>WorkPilot</span>
             <ChevronRight className="w-3 h-3 text-zinc-800" />
             <span className="text-zinc-200 font-medium">{title}</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-3 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 hover:text-white hover:border-zinc-700 transition-all font-medium group"
        >
          <Search className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
          <span className="text-xs">Search...</span>
          <span className="ml-4 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 tracking-tighter opacity-50 group-hover:opacity-100 uppercase">⌘K</span>
        </button>

        <Modal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          title="Global Search"
        >
          <div className="space-y-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                autoFocus
                type="text"
                placeholder="Find projects, tasks, or members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
              />
            </div>

            <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              {isSearching ? (
                <div className="p-8 text-center text-zinc-500 animate-pulse text-xs uppercase tracking-widest">Searching...</div>
              ) : searchTerm ? (
                results.length > 0 ? (
                  results.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        setShowSearchModal(false);
                        setSearchTerm('');
                        navigate(item.path);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-600/10 border border-transparent hover:border-indigo-500/20 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        {item.type === 'project' ? <Briefcase className="w-4 h-4 text-indigo-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{item.title}</span>
                      </div>
                      <Badge variant={item.type === 'project' ? 'default' : 'success'} className="text-[9px] uppercase">{item.type}</Badge>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-600 text-xs italic">No matches found for "{searchTerm}"</div>
                )
              ) : (
                <div className="p-4 space-y-4">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Navigation Suggestions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Dashboard', path: '/' },
                      { name: 'Tasks', path: '/tasks' },
                      { name: 'Team', path: '/team' }
                    ].map(nav => (
                      <button 
                        key={nav.path}
                        onClick={() => {
                          setShowSearchModal(false);
                          navigate(nav.path);
                        }}
                        className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-500 hover:text-white hover:border-zinc-700 transition-all text-center"
                      >
                        {nav.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>

        <div className="flex -space-x-2 mr-4 opacity-70 hover:opacity-100 transition-opacity">
          {[1,2,3].map(i => (
            <img 
              key={i} 
              src={`https://i.pravatar.cc/150?u=${i}`} 
              className="w-7 h-7 rounded-full border-2 border-zinc-950" 
              alt="avatar" 
            />
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400">
            +5
          </div>
        </div>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all text-zinc-500 hover:text-white">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full border-2 border-zinc-950" />
        </button>

        <Button 
          size="sm" 
          className="gap-2 h-9 px-4"
          onClick={() => navigate('/tasks')}
        >
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>
    </header>
  );
}

export function DashboardLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="flex bg-zinc-950 text-zinc-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
