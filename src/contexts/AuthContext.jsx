import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.data()
          });
        } else {
          // User exists in Auth but not in Firestore (edge case)
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: '',
            settings: {
              emailNotifications: true,
              notifyWeekBefore: true,
              notifyOnDueDate: true
            }
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user document in Firestore
    const userData = {
      name,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      settings: {
        emailNotifications: true,
        notifyWeekBefore: true,
        notifyOnDueDate: true
      }
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    setUser({
      id: firebaseUser.uid,
      ...userData
    });

    return { id: firebaseUser.uid, ...userData };
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    const fullUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      ...userData
    };

    setUser(fullUser);
    return fullUser;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUser = async (updates) => {
    if (!user) return;

    await updateDoc(doc(db, 'users', user.id), updates);
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = async (settings) => {
    if (!user) return;

    const newSettings = { ...user.settings, ...settings };
    await updateDoc(doc(db, 'users', user.id), { settings: newSettings });
    setUser(prev => ({ ...prev, settings: newSettings }));
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
    } catch (error) {
      throw new Error('Current password is incorrect');
    }

    await updatePassword(auth.currentUser, newPassword);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      updateUser,
      updateSettings,
      changePassword,
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
