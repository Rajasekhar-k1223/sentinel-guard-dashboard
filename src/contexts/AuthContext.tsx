import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'analyst' | 'viewer' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: { [key: string]: User } = {
  'admin@sentinel.ai': {
    id: '1',
    email: 'admin@sentinel.ai',
    name: 'Admin User',
    role: 'admin',
    organization: 'SentinelAI Corp'
  },
  'analyst@sentinel.ai': {
    id: '2',
    email: 'analyst@sentinel.ai',
    name: 'Security Analyst',
    role: 'analyst',
    organization: 'SentinelAI Corp'
  },
  'enterprise@company.com': {
    id: '3',
    email: 'enterprise@company.com',
    name: 'Enterprise User',
    role: 'enterprise',
    organization: 'Enterprise Corp'
  },
  'viewer@company.com': {
    id: '4',
    email: 'viewer@company.com',
    name: 'Viewer User',
    role: 'viewer',
    organization: 'Company Inc'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('sentinel-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would call your backend
    const foundUser = mockUsers[email];
    if (foundUser && password.length > 0) {
      setUser(foundUser);
      localStorage.setItem('sentinel-user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sentinel-user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};