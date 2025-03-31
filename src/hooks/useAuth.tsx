
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, User } from '@supabase/supabase-js';

// Define user interface
export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
}

// Auth context interface
interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { email: string, password: string, name: string, role?: 'patient' | 'doctor' | 'admin' }) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session && session.user) {
            try {
              // Fetch user profile
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              // Create user data object
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.name || session.user.email?.split('@')[0] || '',
                role: (profile?.role as 'patient' | 'doctor' | 'admin') || 'patient'
              });
            } catch (err) {
              console.error('Error fetching user profile:', err);
              // If profile fetch fails, use basic user data
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || '',
                role: 'patient'
              });
            }
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      );
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        try {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // Create user data object
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.email?.split('@')[0] || '',
            role: (profile?.role as 'patient' | 'doctor' | 'admin') || 'patient'
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // If profile fetch fails, use basic user data
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || '',
            role: 'patient'
          });
        }
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
    } catch (error) {
      let errorMessage = 'An error occurred during login';
      if (error instanceof AuthError) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup function
  const signup = async ({ email, password, name, role = 'patient' }: { email: string, password: string, name: string, role?: 'patient' | 'doctor' | 'admin' }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Register the user
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (!newUser) {
        throw new Error('Failed to create user account');
      }
      
      // Create user profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: newUser.id,
          name,
          role
        }
      ]);
      
      if (profileError) {
        throw profileError;
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
    } catch (error) {
      let errorMessage = 'An error occurred during signup';
      if (error instanceof AuthError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
