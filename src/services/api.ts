const AUTH_URL = '/api/auth';
const PROJECTS_URL = '/api/projects';
const TASKS_URL = '/api/tasks';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async signup(data: any) {
    const res = await fetch(`${AUTH_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    let result;
    const text = await res.text();
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('JSON Parse Error. Server response:', text);
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 50)}...`);
    }

    if (!res.ok) throw new Error(result.message || 'Signup failed');
    return result;
  },

  async login(data: any) {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    let result;
    const text = await res.text();
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('JSON Parse Error. Server response:', text);
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 50)}...`);
    }

    if (!res.ok) throw new Error(result.message || 'Login failed');
    return result;
  },

  async getProfile(token: string) {
    const res = await fetch(`${AUTH_URL}/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch profile');
    const user = result.data.user;
    return { ...user, id: user._id };
  },

  async getUsers() {
    const res = await fetch(`${AUTH_URL}/users`, { headers: getHeaders() });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch users');
    return result.data.users.map((u: any) => ({ ...u, id: u._id }));
  },

  // Projects
  async getProjects() {
    const res = await fetch(PROJECTS_URL, { headers: getHeaders() });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch projects');
    return result.data.projects.map((p: any) => ({ ...p, id: p._id }));
  },

  async createProject(data: any) {
    const res = await fetch(PROJECTS_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create project');
    const project = result.data.project;
    return { ...project, id: project._id };
  },

  // Tasks
  async getTasks() {
    const res = await fetch(TASKS_URL, { headers: getHeaders() });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch tasks');
    return result.data.tasks.map((t: any) => ({ ...t, id: t._id }));
  },

  async createTask(data: any) {
    const res = await fetch(TASKS_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create task');
    const task = result.data.task;
    return { ...task, id: task._id };
  },

  async updateTaskStatus(id: string, status: string) {
    const res = await fetch(`${TASKS_URL}/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update task');
    return result.data.task;
  }
};
