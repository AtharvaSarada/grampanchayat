/**
 * Admin authentication and role management utilities
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

// Check if user is an admin
export const checkIfAdmin = async (userId) => {
  try {
    if (!userId) return false;
    
    const adminRef = doc(db, 'admins', userId);
    const adminSnap = await getDoc(adminRef);
    
    return adminSnap.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get admin role and permissions
export const getAdminRole = async (userId) => {
  try {
    if (!userId) return null;
    
    const adminRef = doc(db, 'admins', userId);
    const adminSnap = await getDoc(adminRef);
    
    if (!adminSnap.exists()) return null;
    
    return adminSnap.data();
  } catch (error) {
    console.error('Error getting admin role:', error);
    return null;
  }
};

// Admin roles and permissions
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  OFFICER: 'officer',
  STAFF: 'staff'
};

export const PERMISSIONS = {
  // Application permissions
  VIEW_ALL_APPLICATIONS: 'view_all_applications',
  APPROVE_APPLICATIONS: 'approve_applications',
  REJECT_APPLICATIONS: 'reject_applications',
  DELETE_APPLICATIONS: 'delete_applications',
  
  // User permissions
  VIEW_ALL_USERS: 'view_all_users',
  MANAGE_USERS: 'manage_users',
  DELETE_USERS: 'delete_users',
  
  // Service permissions
  MANAGE_SERVICES: 'manage_services',
  
  // System permissions
  VIEW_REPORTS: 'view_reports',
  SYSTEM_CONFIG: 'system_config',
  MANAGE_ADMINS: 'manage_admins'
};

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  [ADMIN_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ADMIN_ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ALL_APPLICATIONS,
    PERMISSIONS.APPROVE_APPLICATIONS,
    PERMISSIONS.REJECT_APPLICATIONS,
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SERVICES,
    PERMISSIONS.VIEW_REPORTS
  ],
  [ADMIN_ROLES.OFFICER]: [
    PERMISSIONS.VIEW_ALL_APPLICATIONS,
    PERMISSIONS.APPROVE_APPLICATIONS,
    PERMISSIONS.REJECT_APPLICATIONS,
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.VIEW_REPORTS
  ],
  [ADMIN_ROLES.STAFF]: [
    PERMISSIONS.VIEW_ALL_APPLICATIONS,
    PERMISSIONS.VIEW_ALL_USERS
  ]
};

// Check if user has specific permission
export const hasPermission = (adminRole, permission) => {
  if (!adminRole || !adminRole.role) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[adminRole.role] || [];
  return rolePermissions.includes(permission);
};

// Check if user can access admin dashboard
export const canAccessAdminDashboard = (adminRole) => {
  return adminRole && Object.values(ADMIN_ROLES).includes(adminRole.role);
};

// Get service-specific permissions
export const getServicePermissions = (adminRole, serviceType) => {
  if (!adminRole) return { canView: false, canApprove: false, canReject: false };
  
  // Check if admin has service-specific restrictions
  const serviceRestrictions = adminRole.serviceRestrictions;
  
  if (serviceRestrictions && serviceRestrictions.length > 0) {
    // Admin is restricted to specific services
    if (!serviceRestrictions.includes(serviceType)) {
      return { canView: false, canApprove: false, canReject: false };
    }
  }
  
  return {
    canView: hasPermission(adminRole, PERMISSIONS.VIEW_ALL_APPLICATIONS),
    canApprove: hasPermission(adminRole, PERMISSIONS.APPROVE_APPLICATIONS),
    canReject: hasPermission(adminRole, PERMISSIONS.REJECT_APPLICATIONS)
  };
};

// Admin context hook
export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [adminRole, setAdminRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { currentUser } = useAuth();
  
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setAdminRole(null);
        setLoading(false);
        return;
      }
      
      try {
        const role = await getAdminRole(currentUser.uid);
        setIsAdmin(!!role);
        setAdminRole(role);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setAdminRole(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [currentUser]);
  
  return { isAdmin, adminRole, loading };
};

// Protected route wrapper for admin pages
export const AdminProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
  const { isAdmin, adminRole, loading } = useAdminStatus();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  if (requiredPermission && !hasPermission(adminRole, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  if (requiredRole && adminRole.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default {
  checkIfAdmin,
  getAdminRole,
  hasPermission,
  canAccessAdminDashboard,
  getServicePermissions,
  useAdminStatus,
  AdminProtectedRoute,
  ADMIN_ROLES,
  PERMISSIONS
};
