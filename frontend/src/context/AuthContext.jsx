import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('chat_token'));

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('chat_user_profile');
      if (!savedUser || savedUser === "undefined" || savedUser === "null") {
        return null;
      }
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Data profil rusak, reset user:", error);
      return null;
    }
  });

  const handleLogin = (userToken, userProfile) => {
    localStorage.setItem('chat_token', userToken);
    localStorage.setItem('chat_user_profile', JSON.stringify(userProfile));
    setToken(userToken);
    setUser(userProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_token');
    localStorage.removeItem('chat_user_profile');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
