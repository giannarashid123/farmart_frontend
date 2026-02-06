import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    const token = localStorage.getItem('access_token');
    
    if (saved && token) {
      try {
        const user = JSON.parse(saved);
        return user;
      } catch (e) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
      }
    }
    return null;
  });
  
  const isAuthenticated = !!currentUser;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('access_token');
    }
  }, [currentUser]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        if (user && typeof user === 'object') {
          setCurrentUser(user);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const access_token = userData.access_token || userData.token;
    const user = userData.user || userData.data || userData;
    
    setCurrentUser(user);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
