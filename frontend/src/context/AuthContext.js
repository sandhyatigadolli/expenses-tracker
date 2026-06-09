import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⭐ AUTO LOGIN CHECK (ON REFRESH)
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/auth/profile/me",
          { withCredentials: true }
        );

        setUser(res.data);
      } catch {
        setUser(null);
      }
    };

    checkLogin();
  }, []);

  // ⭐ LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const loggedUser = res.data.user || res.data;
      setUser(loggedUser);

      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ⭐ LOGOUT
  const logout = async () => {
    await axios.post(
      "http://localhost:8080/api/auth/logout",
      {},
      { withCredentials: true }
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};