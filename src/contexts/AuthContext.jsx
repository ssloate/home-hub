import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users and current session from localStorage
    const storedUsers = localStorage.getItem('homeapp_users');
    const storedSession = localStorage.getItem('homeapp_session');

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    if (storedSession) {
      const session = JSON.parse(storedSession);
      // Verify session is still valid
      if (storedUsers) {
        const usersData = JSON.parse(storedUsers);
        const validUser = usersData.find(u => u.id === session.userId);
        if (validUser) {
          setUser(validUser);
        }
      }
    }

    setLoading(false);
  }, []);

  const saveUsers = (newUsers) => {
    localStorage.setItem('homeapp_users', JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const register = async (name, email, password) => {
    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }

    const newUser = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      settings: {
        emailNotifications: true,
        notifyWeekBefore: true,
        notifyOnDueDate: true
      }
    };

    const newUsers = [...users, newUser];
    saveUsers(newUsers);

    // Auto login after registration
    setUser(newUser);
    localStorage.setItem('homeapp_session', JSON.stringify({ userId: newUser.id }));

    return newUser;
  };

  const login = async (email, password) => {
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    setUser(foundUser);
    localStorage.setItem('homeapp_session', JSON.stringify({ userId: foundUser.id }));

    return foundUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('homeapp_session');
  };

  const updateUser = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);

    saveUsers(updatedUsers);
    setUser(updatedUser);
  };

  const updateSettings = (settings) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      settings: { ...user.settings, ...settings }
    };

    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    saveUsers(updatedUsers);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      loading,
      register,
      login,
      logout,
      updateUser,
      updateSettings,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
