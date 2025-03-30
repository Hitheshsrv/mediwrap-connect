
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define user interface
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  { id: 1, email: 'patient@example.com', password: 'password', name: 'John Doe', role: 'patient' },
  { id: 2, email: 'doctor@example.com', password: 'password', name: 'Dr. Sarah Johnson', role: 'doctor' },
  { id: 3, email: 'admin@example.com', password: 'password', name: 'Admin User', role: 'admin' },
];

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('mediwrap-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('mediwrap-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Set user in state
      setUser(userWithoutPassword);
      
      // Save to localStorage
      localStorage.setItem('mediwrap-user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : 'An error occurred during login',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup function
  const signup = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user (in a real app, this would be handled by the backend)
      const newUserId = mockUsers.length + 1;
      const newUser: User & { password: string } = {
        id: newUserId,
        email: userData.email || '',
        password: userData.password,
        name: userData.name || '',
        role: userData.role || 'patient',
      };
      
      // Add to mock users (in a real app, this would be saved in the database)
      mockUsers.push(newUser);
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Set user in state
      setUser(userWithoutPassword);
      
      // Save to localStorage
      localStorage.setItem('mediwrap-user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during signup');
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : 'An error occurred during signup',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('mediwrap-user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
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
