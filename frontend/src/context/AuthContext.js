import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { loginSuccess, logout as logoutAction, loginStart } from '../store/slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set a maximum timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Auth initialization timeout - setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        clearTimeout(timeout); // Clear timeout since auth state changed
        
        if (firebaseUser) {
          dispatch(loginStart());
          
          // Get Firebase ID token
          const token = await firebaseUser.getIdToken();
          
          // For now, use basic Firebase user data since backend profile system needs to be set up properly
          const basicUserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            role: 'user' // Default role
          };
          
          setCurrentUser(basicUserData);
          dispatch(loginSuccess({ user: basicUserData, token }));
          localStorage.setItem('authToken', token);
        } else {
          setCurrentUser(null);
          dispatch(logoutAction());
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        toast.error('Authentication error');
      } finally {
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [dispatch]);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      dispatch(logoutAction());
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const value = {
    currentUser,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
