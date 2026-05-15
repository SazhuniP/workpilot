# WorkPilot - Premium SaaS Project Management

WorkPilot is a polished, high-performance project management platform built for modern teams. It features a technical yet elegant aesthetic inspired by tools like Linear and Notion, combined with real-time teamwork capabilities and robust analytics.

## ✨ Key Features

- **Intuitive Dashboard**: At-a-glance analytics with productivity charts (Recharts) and real-time status tracking.
- **Kanban Task Board**: Fluid, status-driven task management with priority badges and member assignment.
- **Project Workspaces**: Manage complex projects with nested tasks, progress indicators, and team membership.
- **Real-time Sync**: Powered by Firebase Firestore for instantaneous updates across the team.
- **Premium UI/UX**: Built with a custom design system focusing on glassmorphism, clean typography (Inter), and Framer Motion animations.
- **Role-Based Access**: Secure user profiles with Admin and Member roles.

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express (proxy mode for Vite).
- **Database**: Firebase Firestore.
- **Authentication**: Firebase Authentication (Google OAuth).
- **Deployment**: Configured for Railway-style deployments (Vite + Express).

## 🚀 Getting Started

1. **Environment Variables**: Configure `GEMINI_API_KEY` in your environment (AI Studio handles secrets automatically).
2. **Installation**:
   ```bash
   npm install
   ```
3. **Development**:
   ```bash
   npm run dev
   ```
4. **Build**:
   ```bash
   npm run build
   ```

## 📐 Project Structure

- `/src/pages`: Main application views (Dashboard, Projects, Board, etc).
- `/src/components`: UI library and layout components.
- `/src/context`: Auth state management.
- `/src/lib`: Core utilities and Firebase initialization.
- `/src/services`: Data orchestration and seeding.

---
*Built with precision for the next generation of productivity.*
