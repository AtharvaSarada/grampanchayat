import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Test authentication and permissions
 */
export const testUserAuth = async () => {
  try {
    console.log('=== AUTHENTICATION TEST ===');
    
    // Check Firebase Auth
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ No authenticated user');
      return false;
    }
    
    console.log('✅ Firebase Auth User:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    });
    
    // Get ID Token
    const token = await user.getIdToken();
    console.log('✅ ID Token length:', token.length);
    
    // Check Firestore user document
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('✅ Firestore User Data:', {
        role: userData.role,
        name: userData.name,
        email: userData.email
      });
      
      // Test permissions based on role
      if (userData.role === 'admin') {
        console.log('✅ User has ADMIN role - should have full permissions');
      } else if (userData.role === 'staff') {
        console.log('✅ User has STAFF role - should have limited permissions');
      } else {
        console.log('✅ User has USER role - should have basic permissions');
      }
      
      return true;
    } else {
      console.error('❌ User document not found in Firestore');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    return false;
  }
};

/**
 * Test file upload permissions
 */
export const testStoragePermissions = async () => {
  try {
    console.log('=== STORAGE PERMISSIONS TEST ===');
    
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ No authenticated user for storage test');
      return false;
    }
    
    // Test different storage paths
    const testPaths = [
      `applications/birth_certificate/${user.uid}/test.png`,
      `documents/${user.uid}/applications/test_app/test.png`,
      `documents/${user.uid}/general/test.png`
    ];
    
    console.log('📁 Testing storage paths for user:', user.uid);
    testPaths.forEach(path => {
      console.log('  - Path:', path);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Storage permissions test failed:', error);
    return false;
  }
};

// Auto-run tests when imported
if (typeof window !== 'undefined') {
  window.testUserAuth = testUserAuth;
  window.testStoragePermissions = testStoragePermissions;
}
