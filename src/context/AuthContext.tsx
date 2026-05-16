import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { UserProfile, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, fullName: string, role?: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setState({ user: null, loading: false, error: null });
        return;
      }

      try {
        const user = await api.getProfile(token);
        setState({ user, loading: false, error: null });
      } catch (err) {
        localStorage.removeItem('token');
        setState({ user: null, loading: false, error: null });
      }
    };

    checkAuth();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      const result = await api.login({ email, password: pass });
      
      localStorage.setItem('token', result.token);
      setState({
        user: result.data.user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(s => ({ ...s, loading: false, error: error.message }));
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, fullName: string, role?: string) => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      const result = await api.signup({
        fullName,
        email,
        password: pass,
        role: role || 'member'
      });
      
      localStorage.setItem('token', result.token);
      setState({
        user: result.data.user,
        loading: false,
        error: null,
      });
      return result;
    } catch (error: any) {
      setState(s => ({ ...s, loading: false, error: error.message }));
      throw error;
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setState({ user: null, loading: false, error: null });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    // Note: Backend profile update API not implemented yet in this demo
    // We update local state for UI consistency
    if (state.user) {
      setState(s => ({
        ...s,
        user: s.user ? { ...s.user, ...data } : null
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signInWithEmail, signUpWithEmail, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
