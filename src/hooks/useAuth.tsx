
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logger.auth.debug('Setting up authentication listeners', { domain: window.location.hostname });
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.auth.debug('Auth state changed', { event, hasSession: !!session, hasUser: !!session?.user });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Quick initial session check with short timeout
    const initSession = async () => {
      const timeout = setTimeout(() => {
        logger.auth.warn('Initial session check timed out after 15s - continuing with graceful degradation');
        setLoading(false);
      }, 15000);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.auth.error('Error getting session', { error });
          await supabase.auth.signOut({ scope: 'local' });
          setSession(null);
          setUser(null);
        } else {
          logger.auth.debug('Initial session loaded', { hasSession: !!session });
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        logger.auth.error('Error loading initial session', { err });
        setSession(null);
        setUser(null);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    initSession();

    return () => {
      logger.auth.debug('Cleaning up auth listeners');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      logger.auth.info('Signing out...');
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.auth.error('Error signing out', { error });
        throw error;
      }
      
      logger.auth.info('Sign out successful');
      
      // If on preview domain, redirect to production domain
      const isPreviewDomain = window.location.hostname.includes('lovableproject.com');
      if (isPreviewDomain) {
        window.location.href = 'https://fpkuniversity.com/login';
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      logger.auth.error('Sign out failed', { error });
      // Still redirect even on error to ensure user is logged out
      const isPreviewDomain = window.location.hostname.includes('lovableproject.com');
      if (isPreviewDomain) {
        window.location.href = 'https://fpkuniversity.com/login';
      } else {
        window.location.href = '/login';
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
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
