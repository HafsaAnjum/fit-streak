
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    async function getInitialSession() {
      setLoading(true);
      
      // Check if we have a session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        toast.error('Error loading your session. Please try again.');
      }
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setLoading(false);
    }
    
    getInitialSession();
    
    // Check for URL hash indicating email confirmation
    const hash = window.location.hash;
    if (hash && hash.includes('#access_token=')) {
      toast.success('Email verified successfully! Logging you in...', {
        duration: 5000,
      });
      setIsNewUser(true);
      // Handle the redirect in a clean way
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user || null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if it's a new user
          const isNew = await checkIfNewUser(session.user.id);
          if (isNew) {
            setIsNewUser(true);
          }
          
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const checkIfNewUser = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error checking if user is new:', error);
      return false;
    }
    
    // If profile was created less than 30 seconds ago, consider it a new user
    if (data) {
      const createdAt = new Date(data.created_at);
      const now = new Date();
      const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000;
      return diffSeconds < 30;
    }
    
    return false;
  };
  
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    setProfile(data);
  };
  
  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (data?.user && !data?.session) {
        // Email confirmation required
        toast.success('Account created! Please check your email to verify your account.', {
          duration: 6000,
        });
      } else {
        // Auto-sign in (if email verification is disabled in Supabase)
        toast.success('Account created successfully!');
        setIsNewUser(true);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile,
      loading, 
      isNewUser,
      setIsNewUser,
      signIn, 
      signUp, 
      signOut,
      refreshProfile
    }}>
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
