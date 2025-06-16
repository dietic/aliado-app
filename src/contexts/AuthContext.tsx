'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabaseClient';
import { ProviderDTO } from '@/types/provider/provider.dto';

// TODO: move to types
interface AuthContextType {
  user: User | null;
  session: Session | null;
  provider: ProviderDTO | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getAccessToken: () => string | null;
  refreshSession: () => Promise<{ session: Session | null; user: User | null }>;
  refreshProvider: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [provider, setProvider] = useState<ProviderDTO | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProviderData = async (userId: string): Promise<ProviderDTO | null> => {
    try {
      const {
        data: { session: currentSession },
      } = await supabaseClient.auth.getSession();

      if (!currentSession) {
        return null;
      }
      const response = await fetch('/api/providers/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentSession.access_token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        console.error('API request failed:', response.status, response.statusText);
        const errorText = await response.text();
        return null;
      }

      const data = await response.json();

      if (data.error) {
        return null;
      }

      return data.provider;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(async () => {
          const providerData = await fetchProviderData(session.user.id);
          setProvider(providerData);
          setLoading(false);
        }, 100);
      } else {
        setProvider(null);
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const providerData = await fetchProviderData(session.user.id);
        setProvider(providerData);
      } else {
        setProvider(null);
      }

      setLoading(false);

      if (event === 'SIGNED_IN') {
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('supabase.auth.token');
      } else if (event === 'TOKEN_REFRESHED') {
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const getAccessToken = () => {
    return session?.access_token ?? null;
  };

  const refreshSession = async () => {
    const { data, error } = await supabaseClient.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
    return data;
  };

  const refreshProvider = async () => {
    if (user) {
      const providerData = await fetchProviderData(user.id);
      setProvider(providerData);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    provider,
    loading,
    signOut,
    getAccessToken,
    refreshSession,
    refreshProvider,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
