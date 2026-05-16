import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from './src/models/User';
import authRoutes from './src/routes/auth';
import projectRoutes from './src/routes/projects';
import taskRoutes from './src/routes/tasks';

dotenv.config();

const PORT = 3000;

async function seedData() {
  try {
    const adminEmail = 'admin@test.com';
    const memberEmail = 'member@test.com';

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        fullName: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        designation: 'System Administrator'
      });
      console.log('Seeded admin account');
    }

    const memberExists = await User.findOne({ email: memberEmail });
    if (!memberExists) {
      const hashedPassword = await bcrypt.hash('member123', 12);
      await User.create({
        fullName: 'Member User',
        email: memberEmail,
        password: hashedPassword,
        role: 'member',
        designation: 'Team Member'
      });
      console.log('Seeded member account');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

async function startServer() {
  const app = express();

  // API Logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());
  app.use(cors());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(), 
      db: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected',
      env: process.env.NODE_ENV
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);

  // Catch-all for API to prevent falling through to SPA serving
  app.all('/api/*', (req, res) => {
    console.warn(`API Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
      status: 'error',
      message: `API Route ${req.method} ${req.url} not found`
    });
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Internal Server Error'
    });
  });

  // MongoDB Connection in background to not block boot
  const connectDB = async () => {
    let MONGODB_URI = process.env.MONGODB_URI;
    
    const isValidUri = (uri: string | undefined): uri is string => {
      return !!uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'));
    };
    
    if (!isValidUri(MONGODB_URI)) {
      if (MONGODB_URI && MONGODB_URI !== '123') {
         console.warn(`Invalid MONGODB_URI detected: ${MONGODB_URI}. Falling back to In-Memory instance.`);
      } else {
         console.warn('No valid MONGODB_URI found. Starting In-Memory MongoDB Server...');
      }
      
      try {
        const mongoServer = await MongoMemoryServer.create();
        MONGODB_URI = mongoServer.getUri();
        console.log('In-Memory MongoDB URI generated');
      } catch (err) {
        console.error('Failed to start In-Memory MongoDB:', err);
      }
    }

    if (isValidUri(MONGODB_URI)) {
      try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI, { 
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000
        });
        console.log('MongoDB connected successfully');
        await seedData();
      } catch (err) {
        console.error('MongoDB connection error:', err);
        // Important: disable buffering so requests fail fast instead of hanging
        mongoose.set('bufferCommands', false);
        
        // Secondary fallback if the "valid" looking URI fails at runtime
        console.log('Attempting fallback to In-Memory MongoDB...');
        try {
          const mongoServer = await MongoMemoryServer.create();
          const fallbackUri = mongoServer.getUri();
          await mongoose.disconnect();
          await mongoose.connect(fallbackUri);
          console.log('Connected to In-Memory MongoDB fallback');
          await seedData();
        } catch (fallbackErr) {
          console.error('Final Mongo connection failed:', fallbackErr);
        }
      }
    }
  };

  connectDB();

  // SPA Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, we assume we are running from dist/server.cjs or root
    // Try to find index.html in dist or current directory
    const possibleDistPaths = [
      path.join(process.cwd(), 'dist'),
      path.join(process.cwd()),
      path.dirname(new URL(import.meta.url).pathname) // fallback if bundled weirdly
    ];
    
    let distPath = possibleDistPaths[0];
    
    // Simplest approach: just use process.cwd() / dist
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // If it started with /api, it shouldn't reach here because of the catch-all above
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
