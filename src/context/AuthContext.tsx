import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { UserProfile, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, fullName: string, role?: string) => Promise<any>;
  setGuestSession: (fullName: string, role: string) => Promise<void>;
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
      const storedUser = localStorage.getItem('user_profile');
      if (!storedUser) {
        setState({ user: null, loading: false, error: null });
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        setState({ user, loading: false, error: null });
      } catch (err) {
        localStorage.removeItem('user_profile');
        setState({ user: null, loading: false, error: null });
      }
    };

    checkAuth();
  }, []);

  const setGuestSession = async (fullName: string, role: string) => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      
      // We still "register" or find the user in the backend to keep data persistent
      // but without passwords. We'll use the name as a unique-ish ID for this demo
      const email = `${fullName.toLowerCase().replace(/\s+/g, '.')}@guest.local`;
      
      const result = await api.signup({
        fullName,
        email,
        password: 'no-password',
        role: role || 'member'
      });
      
      const user = { ...result.data.user, id: result.data.user._id || result.data.user.id };
      localStorage.setItem('user_profile', JSON.stringify(user));
      localStorage.setItem('token', result.token); // Still store a "token" for API compatibility
      
      setState({
        user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      // If user exists, try "login" with no password
      try {
        const email = `${fullName.toLowerCase().replace(/\s+/g, '.')}@guest.local`;
        const result = await api.login({ email, password: 'no-password' });
        const user = { ...result.data.user, id: result.data.user._id || result.data.user.id };
        localStorage.setItem('user_profile', JSON.stringify(user));
        localStorage.setItem('token', result.token);
        setState({
          user,
          loading: false,
          error: null,
        });
      } catch (loginErr: any) {
        setState(s => ({ ...s, loading: false, error: error.message }));
        throw error;
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    // Legacy support, redirected to guest session
    await setGuestSession(email.split('@')[0], 'member');
  };

  const signUpWithEmail = async (email: string, pass: string, fullName: string, role?: string) => {
    await setGuestSession(fullName, role || 'member');
    return { token: 'guest-token' };
  };

  const signOut = async () => {
    localStorage.removeItem('user_profile');
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
