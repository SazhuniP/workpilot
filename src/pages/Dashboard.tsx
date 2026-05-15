import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Users as UsersIcon,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { collection, query, where, onSnapshot, collectionGroup } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, Badge, GlassCard } from '../components/ui';
import { useNavigate } from '../context/NavigationContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const data = [
  { name: 'Mon', tasks: 12 },
  { name: 'Tue', tasks: 19 },
  { name: 'Wed', tasks: 15 },
  { name: 'Thu', tasks: 22 },
  { name: 'Fri', tasks: 30 },
  { name: 'Sat', tasks: 10 },
  { name: 'Sun', tasks: 8 },
];

const projectStatusData = [
  { name: 'Completed', value: 400, color: '#10b981' }, // emerald-500
  { name: 'In Progress', value: 300, color: '#4f46e5' }, // indigo-600
  { name: 'Delayed', value: 300, color: '#f43f5e' }, // rose-500
];

const recentTasks = [
  { id: 1, title: 'Redesign Landing Page', project: 'WorkPilot UI', status: 'completed', priority: 'high', assignee: 'Alex Morgan' },
  { id: 2, title: 'Implement JWT Auth', project: 'WorkPilot Core', status: 'in-progress', priority: 'medium', assignee: 'John Doe' },
  { id: 3, title: 'Setup MongoDB Schema', project: 'Backend Refactor', status: 'todo', priority: 'low', assignee: 'Sarah Chen' },
  { id: 4, title: 'Fix CSS Grid Issues', project: 'WorkPilot UI', status: 'in-progress', priority: 'high', assignee: 'Alex Morgan' },
];

export default function Dashboard() {
  const { navigate } = useNavigate();
  const { user } = useAuth();
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Listen to projects
    const qProjects = query(
      collection(db, 'projects'),
      where('members', 'array-contains', user.uid)
    );
    const unsubProjects = onSnapshot(qProjects, (snap) => {
      setProjectCount(snap.size);
    }, (error) => {
      console.error("Dashboard projects error:", error);
    });

    // Simple task count - using collectionGroup to match TasksPage
    const qTasks = query(
      collectionGroup(db, 'tasks'),
      where('assigneeId', '==', user.uid)
    );
    const unsubTasks = onSnapshot(qTasks, (snap) => {
      setTaskCount(snap.size);
    }, (error) => {
      console.error("Dashboard tasks error:", error);
    });

    return () => {
      unsubProjects();
      unsubTasks();
    };
  }, [user]);

  return (
    <DashboardLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Projects" 
          value={projectCount.toString()} 
          trend="+2.5%" 
          icon={TrendingUp} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Total Tasks" 
          value={taskCount.toString()} 
          trend="+18%" 
          icon={CheckCircle2} 
          color="bg-sky-500" 
        />
        <StatCard 
          title="Team Members" 
          value="24" 
          trend="+4" 
          icon={UsersIcon} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Avg. Completion" 
          value="92%" 
          trend="-1.2%" 
          icon={Clock} 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 p-6 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Productivity Flow</h3>
              <p className="text-xs text-zinc-500">Task completions over the last 7 days</p>
            </div>
            <select className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/50">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                   <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#71717a' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#71717a' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTasks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 h-[400px] flex flex-col">
           <h3 className="text-base font-bold text-white tracking-tight mb-2">Project Health</h3>
           <p className="text-xs text-zinc-500 mb-6">Distribution of project statuses</p>
           <div className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 space-y-2 w-full">
                 {projectStatusData.map((entry, index) => (
                   <div key={index} className="flex items-center justify-between text-xs">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-zinc-500 font-medium">{entry.name}</span>
                     </div>
                     <span className="text-white font-bold">{Math.round((entry.value / 1000) * 100)}%</span>
                   </div>
                 ))}
              </div>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
               <h3 className="text-base font-bold text-white tracking-tight">Ongoing Tasks</h3>
               <button 
                 onClick={() => navigate('/tasks')}
                 className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-widest"
               >
                 View All
               </button>
            </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-900/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Task Name</th>
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4 text-center">Priority</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4">Assignee</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-zinc-800">
                   {recentTasks.map(task => (
                     <tr 
                       key={task.id} 
                       onClick={() => navigate('/tasks')}
                       className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                     >
                        <td className="px-6 py-4 font-semibold text-zinc-100">{task.title}</td>
                        <td className="px-6 py-4 text-zinc-500">{task.project}</td>
                        <td className="px-6 py-4 text-center">
                           <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'} className="lowercase">
                              {task.priority}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <Badge variant={task.status === 'completed' ? 'success' : 'info'} className="lowercase">
                              {task.status}
                           </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <img src={`https://ui-avatars.com/api/?name=${task.assignee}`} className="w-6 h-6 rounded-full border border-zinc-800" alt="avatar" />
                             <span className="text-zinc-400 font-medium text-xs">{task.assignee}</span>
                          </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </Card>

        <Card className="p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-white tracking-tight">Recent Activity</h3>
              <button className="p-1 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500">
                 <MoreHorizontal className="w-4 h-4" />
              </button>
           </div>
           <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-zinc-800">
              {[
                { user: 'Alex Morgan', action: 'completed', target: 'Task: Redesign Header', time: '2m ago' },
                { user: 'Sarah Chen', action: 'added', target: 'Project: Mobile App', time: '45m ago' },
                { user: 'John Doe', action: 'commented on', target: 'Auth API', time: '3h ago' },
                { user: 'WorkPilot System', action: 'deployed', target: 'v1.4.2 to Production', time: '12h ago' }
              ].map((activity, i) => (
                <div key={i} className="relative flex items-center gap-6 pl-8">
                   <span className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                   </span>
                   <div className="flex flex-col">
                      <p className="text-xs text-zinc-400 leading-tight">
                         <span className="font-bold text-white">{activity.user}</span> {activity.action} <span className="font-semibold text-zinc-300">{activity.target}</span>
                      </p>
                      <span className="text-[10px] items-center gap-1 inline-flex text-zinc-500 font-medium mt-1">
                        <Clock className="w-3 h-3 text-zinc-600" /> {activity.time}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, color }: any) {
  const isPositive = trend.startsWith('+');
  return (
    <Card className="p-6 group hover:border-zinc-700 transition-all cursor-default">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-xl text-white shadow-lg", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
          isPositive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
           {isPositive ? <ArrowUpRight className="w-3 h-3" /> : null}
           {trend}
        </div>
      </div>
      <div>
        <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-2xl font-bold text-white tracking-tight leading-none">{value}</p>
      </div>
    </Card>
  );
}
