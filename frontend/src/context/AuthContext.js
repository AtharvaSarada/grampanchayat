import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { loginSuccess, logout as logoutAction, loginStart } from '../store/slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { logLogin, logLogout } from '../services/auditService';
import { notifyWelcomeNewUser } from '../services/notificationService';

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
          
          // Fetch user data from Firestore to get role and other profile info
          let userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            role: 'user' // Default role
          };

          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              const firestoreData = userDocSnap.data();
              userData = {
                ...userData,
                name: firestoreData.name || userData.displayName,
                role: firestoreData.role || 'user',
                phone: firestoreData.phone || '',
                ...firestoreData
              };
            } else {
              // Create user document if it doesn't exist
              const newUserData = {
                name: userData.displayName,
                email: userData.email,
                role: 'user',
                phone: '',
                createdAt: new Date(),
                updatedAt: new Date()
              };
              
              await setDoc(userDocRef, newUserData);
              userData = { ...userData, ...newUserData };
              
              // Send welcome notification for new users
              try {
                await notifyWelcomeNewUser(userData.uid, userData.displayName);
              } catch (notificationError) {
                console.error('Error sending welcome notification:', notificationError);
              }
            }
          } catch (firestoreError) {
            console.error('Error fetching user data from Firestore:', firestoreError);
            toast.error('Error loading user profile');
          }
          
          setCurrentUser(userData);
          dispatch(loginSuccess({ user: userData, token }));
          localStorage.setItem('authToken', token);
          
          // Log successful login
          try {
            await logLogin(userData, null, navigator.userAgent);
          } catch (auditError) {
            console.error('Error logging login audit:', auditError);
          }
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
      // Log logout before signing out
      if (currentUser) {
        try {
          await logLogout(currentUser, null, navigator.userAgent);
        } catch (auditError) {
          console.error('Error logging logout audit:', auditError);
        }
      }
      
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

  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const firestoreData = userDocSnap.data();
        const updatedUserData = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || 'User',
          name: firestoreData.name || auth.currentUser.displayName,
          role: firestoreData.role || 'user',
          phone: firestoreData.phone || '',
          ...firestoreData
        };
        
        setCurrentUser(updatedUserData);
        
        // Get fresh token and update Redux store
        const token = await auth.currentUser.getIdToken(true); // Force refresh
        dispatch(loginSuccess({ user: updatedUserData, token }));
        localStorage.setItem('authToken', token);
        
        toast.success('Profile updated successfully');
        return updatedUserData;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      toast.error('Error refreshing profile');
    }
  };

  const value = {
    currentUser,
    loading,
    logout,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
