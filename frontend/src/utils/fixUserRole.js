import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Fix user role in Firestore
 */
export const fixUserRole = async (role = 'admin') => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ No authenticated user');
      return false;
    }

    console.log('🔧 Fixing user role for:', user.email);
    
    const userDocRef = doc(db, 'users', user.uid);
    
    // Get existing user data
    const userDoc = await getDoc(userDocRef);
    const existingData = userDoc.exists() ? userDoc.data() : {};
    
    // Update user document with admin role
    const userData = {
      ...existingData,
      uid: user.uid,
      email: user.email,
      name: user.displayName || existingData.name || 'Admin User',
      role: role,
      updatedAt: new Date(),
      createdAt: existingData.createdAt || new Date()
    };
    
    await setDoc(userDocRef, userData, { merge: true });
    
    console.log('✅ User role updated successfully:', {
      uid: user.uid,
      email: user.email,
      role: role
    });
    
    // Refresh the page to reload auth context
    console.log('🔄 Please refresh the page to apply changes');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to fix user role:', error);
    return false;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.fixUserRole = fixUserRole;
}
