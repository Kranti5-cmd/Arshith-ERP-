import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../services/api';

const AuthContext = createContext();

export const ADMIN_USER = {
  id: 'usr-001',
  email: 'admin@arshithgroup.com',
  name: 'Farook',
  roleName: 'SUPER_ADMIN',
  department: 'Executive Management',
  designation: 'Managing Director & CEO',
  employeeId: 'EMP-0101',
  company: 'arshith',
};

export const CODELEKHO_ADMIN_USER = {
  id: 'usr-006',
  email: 'admin@codelekho.com',
  name: 'Farook',
  roleName: 'SUPER_ADMIN',
  department: 'CodeLekho Academic ERP',
  designation: 'Director & ERP Administrator',
  employeeId: 'CLK-0001',
  company: 'codelekho',
};

export const ARSHITH_FRESH_ADMIN_USER = {
  id: 'usr-007',
  email: 'admin@arshithfresh.com',
  name: 'Farook',
  roleName: 'SUPER_ADMIN',
  department: 'Arshith Fresh Supply Chain',
  designation: 'Managing Director & Supply Chain Admin',
  employeeId: 'AF-0001',
  company: 'arshithfresh',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('arshith_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [company, setCompany] = useState(() => localStorage.getItem('arshith_company') || 'arshith');
  const [token, setToken] = useState(() => localStorage.getItem('arshith_auth_token') || (localStorage.getItem('arshith_user') ? 'demo_token_admin' : null));

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const switchCompany = (newCompany) => {
    setCompany(newCompany);
    localStorage.setItem('arshith_company', newCompany);
    if (user) {
      const updatedUser = { ...user, company: newCompany };
      setUser(updatedUser);
      localStorage.setItem('arshith_user', JSON.stringify(updatedUser));
    }
  };

  const login = async (email, password, selectedCompany = 'arshith') => {
    try {
      const res = await api.login({ email, password, company: selectedCompany });
      if (res.success) {
        const enrichedUser = {
          ...res.user,
          company: selectedCompany,
        };
        setUser(enrichedUser);
        setCompany(selectedCompany);
        setToken(res.token);
        localStorage.setItem('arshith_user', JSON.stringify(enrichedUser));
        localStorage.setItem('arshith_company', selectedCompany);
        localStorage.setItem('arshith_auth_token', res.token);
        if (selectedCompany === 'arshithfresh') {
          localStorage.setItem('afims_token', res.token);
        }
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      // Local fallback for offline / immediate signin
      const isArshithAdmin = (email.toLowerCase() === 'admin@arshithgroup.com' || email.toLowerCase() === 'admin@arshith.com') && 
        (password === 'ArshithInventory' || password === 'admin123' || password === 'admin');
      const isCodeLekhoAdmin = (email.toLowerCase() === 'admin@codelekho.com' || email.toLowerCase() === 'admin@arshithgroup.com') &&
        (password === 'CodeLekho2026' || password === 'ArshithInventory' || password === 'admin123');
      const isFreshAdmin = (email.toLowerCase() === 'admin@arshithfresh.com' || email.toLowerCase() === 'admin@arshithgroup.com') &&
        (password === 'admin123' || password === 'ArshithInventory' || password === 'admin');

      if (selectedCompany === 'arshithfresh' && (isFreshAdmin || isArshithAdmin || isCodeLekhoAdmin)) {
        const fUser = { ...ARSHITH_FRESH_ADMIN_USER, email };
        setUser(fUser);
        setCompany('arshithfresh');
        setToken('demo_token_arshithfresh');
        localStorage.setItem('arshith_user', JSON.stringify(fUser));
        localStorage.setItem('arshith_company', 'arshithfresh');
        localStorage.setItem('arshith_auth_token', 'demo_token_arshithfresh');
        localStorage.setItem('afims_token', 'demo_token_arshithfresh');
        return { success: true };
      }

      if (selectedCompany === 'codelekho' && (isCodeLekhoAdmin || isArshithAdmin || isFreshAdmin)) {
        const cUser = { ...CODELEKHO_ADMIN_USER, email };
        setUser(cUser);
        setCompany('codelekho');
        setToken('demo_token_codelekho');
        localStorage.setItem('arshith_user', JSON.stringify(cUser));
        localStorage.setItem('arshith_company', 'codelekho');
        localStorage.setItem('arshith_auth_token', 'demo_token_codelekho');
        return { success: true };
      }

      if (selectedCompany === 'arshith' && (isArshithAdmin || isCodeLekhoAdmin || isFreshAdmin)) {
        const aUser = { ...ADMIN_USER, email };
        setUser(aUser);
        setCompany('arshith');
        setToken('demo_token_admin');
        localStorage.setItem('arshith_user', JSON.stringify(aUser));
        localStorage.setItem('arshith_company', 'arshith');
        localStorage.setItem('arshith_auth_token', 'demo_token_admin');
        return { success: true };
      }

      return { success: false, message: err.message || 'Invalid administrator credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('arshith_user');
    localStorage.removeItem('arshith_auth_token');
    localStorage.removeItem('afims_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      company, 
      switchCompany, 
      isAuthenticated: Boolean(user), 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
