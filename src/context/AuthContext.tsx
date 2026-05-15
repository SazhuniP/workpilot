import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<any>;
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
    let unsubProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Cleanup previous profile listener if exists
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen for real-time updates to user profile (e.g. role changes)
        unsubProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            // Force admin role for the designated user in the DB if it's not set
            if (firebaseUser.email === 'sazhuni@gmail.com' && data.role !== 'admin') {
              setDoc(userDocRef, { role: 'admin' }, { merge: true }).catch(console.error);
            }
            setState({
              user: { ...data, uid: firebaseUser.uid }, // Ensure UID is preserved
              loading: false,
              error: null,
            });
          } else {
            // Create user profile if it doesn't exist
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || '',
              role: firebaseUser.email === 'sazhuni@gmail.com' ? 'admin' : 'member',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setDoc(userDocRef, newUser)
              .then(() => {
                setState({ user: newUser, loading: false, error: null });
              })
              .catch((err) => {
                console.error("Error creating profile:", err);
                setState(prev => ({ ...prev, loading: false, error: err.message }));
              });
          }
        }, (err) => {
          console.error("Profile snapshot error:", err);
          setState(prev => ({ ...prev, loading: false, error: err.message }));
        });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      setState(s => ({ ...s, loading: false, error: error.message }));
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      return cred;
    } catch (error: any) {
      setState(s => ({ ...s, loading: false, error: error.message }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setState(s => ({ ...s, loading: false, error: error.message }));
    }
  };

  const signOut = async () => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      await auth.signOut();
    } catch (error: any) {
      setState(s => ({ ...s, loading: false, error: error.message }));
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!state.user) return;
    try {
      const userDocRef = doc(db, 'users', state.user.uid);
      await setDoc(userDocRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (error: any) {
      setState(s => ({ ...s, error: error.message }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateProfile }}>
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
