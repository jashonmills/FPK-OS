import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPassword: boolean;
  refreshPasswordStatus: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check password status when user changes
        if (session?.user) {
          setTimeout(() => {
            checkPasswordStatus(session.user.id);
          }, 0);
        } else {
          setHasPassword(true); // Reset to true when no user
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        checkPasswordStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPasswordStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('password_set')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setHasPassword(data.password_set ?? true);
      }
    } catch (error) {
      console.error('Error checking password status:', error);
      setHasPassword(true); // Default to true on error to avoid blocking access
    }
  };

  const signOut = async () => {
    try {
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      // Try to sign out from Supabase, but don't block on errors
      await supabase.auth.signOut();
    } catch (error) {
      // Ignore errors - session might already be invalid (403 errors are common)
      console.log('Sign out error (ignored):', error);
    } finally {
      // Always clear local storage and navigate, regardless of API response
      localStorage.removeItem('sb-blkcxbyloxzmgwjbbcqd-auth-token');
      navigate('/auth');
    }
  };

  const refreshPasswordStatus = async () => {
    if (user) {
      await checkPasswordStatus(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, hasPassword, refreshPasswordStatus, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
