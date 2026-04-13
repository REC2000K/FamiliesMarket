import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  users: User[];
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin user
const DEFAULT_ADMIN = {
  id: 'admin-1',
  email: 'admin@revitlib.com',
  password: 'admin123',
  name: 'Администратор',
  role: 'admin' as const,
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load users and session from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('revitlib_users');
    const storedSession = localStorage.getItem('revitlib_session');
    
    let parsedUsers: any[] = [];
    
    if (storedUsers) {
      parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
    } else {
      // Initialize with default admin (without password in users list)
      const { password, ...adminWithoutPassword } = DEFAULT_ADMIN;
      const initialUsers = [adminWithoutPassword];
      localStorage.setItem('revitlib_users', JSON.stringify(initialUsers));
      localStorage.setItem('revitlib_credentials', JSON.stringify([{ 
        email: DEFAULT_ADMIN.email, 
        password: DEFAULT_ADMIN.password 
      }]));
      setUsers(initialUsers);
    }

    if (storedSession) {
      const session = JSON.parse(storedSession);
      setUser(session.user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const credentials = localStorage.getItem('revitlib_credentials');
    if (!credentials) return false;

    const parsedCredentials = JSON.parse(credentials);
    const match = parsedCredentials.find(
      (cred: any) => cred.email === email && cred.password === password
    );

    if (match) {
      const userData = users.find(u => u.email === email);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('revitlib_session', JSON.stringify({ user: userData }));
        return true;
      }
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('revitlib_users', JSON.stringify(updatedUsers));

    // Store credentials separately
    const credentials = localStorage.getItem('revitlib_credentials');
    const parsedCredentials = credentials ? JSON.parse(credentials) : [];
    parsedCredentials.push({ email, password });
    localStorage.setItem('revitlib_credentials', JSON.stringify(parsedCredentials));

    // Auto login after registration
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('revitlib_session', JSON.stringify({ user: newUser }));

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('revitlib_session');
  };

  const getAllUsers = () => users;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      users,
      getAllUsers
    }}>
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
