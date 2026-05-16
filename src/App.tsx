import { useAuth } from './context/AuthContext';
import { useNavigate } from './context/NavigationContext';
import { motion, AnimatePresence } from 'motion/react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Team from './pages/Team';
import TasksPage from './pages/TasksPage';
import Profile from './pages/Profile';

import Signup from './pages/Signup';

export default function App() {
  const { user, loading } = useAuth();
  const { currentPath, navigate } = useNavigate();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-zinc-500 font-medium tracking-tight animate-pulse uppercase text-[10px] tracking-[0.2em]">Initializing WorkPilot</p>
      </div>
    );
  }

  if (!user && currentPath === '/') {
    return <Landing onSignIn={() => navigate('/login')} />;
  }

  if (!user) {
    if (currentPath === '/signup') {
      return <Signup />;
    }
    return <Login />;
  }

  // Basic Routing
  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
           key={currentPath}
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           transition={{ duration: 0.2, ease: "easeOut" }}
           className="flex-1 flex flex-col min-h-0"
        >
          {(() => {
            switch (currentPath) {
              case '/':
                return <Dashboard />;
              case '/projects':
                return <Projects />;
              case '/tasks':
                return <TasksPage />;
              case '/team':
                return <Team />;
              case '/profile':
                return <Profile />;
              default:
                return <Dashboard />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return renderContent();
}
