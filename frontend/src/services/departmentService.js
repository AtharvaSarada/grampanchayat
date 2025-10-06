import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

// Department categories
export const DEPARTMENT_CATEGORIES = {
  CIVIL: 'Civil Registration',
  REVENUE: 'Revenue',
  HEALTH: 'Health & Sanitation',
  EDUCATION: 'Education',
  AGRICULTURE: 'Agriculture',
  WELFARE: 'Social Welfare',
  INFRASTRUCTURE: 'Infrastructure',
  FINANCE: 'Finance & Accounts',
  GENERAL: 'General Administration'
};

// Create a new department
export const createDepartment = async (departmentData) => {
  try {
    const department = {
      ...departmentData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const docRef = await addDoc(collection(db, 'departments'), department);
    return { id: docRef.id, ...department };
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Get all departments
export const getDepartments = async () => {
  try {
    const departmentsQuery = query(
      collection(db, 'departments'),
      orderBy('name')
    );
    
    const snapshot = await getDocs(departmentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Get active departments only
export const getActiveDepartments = async () => {
  try {
    const departmentsQuery = query(
      collection(db, 'departments'),
      where('isActive', '==', true),
      orderBy('name')
    );
    
    const snapshot = await getDocs(departmentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching active departments:', error);
    throw error;
  }
};

// Update department
export const updateDepartment = async (departmentId, updateData) => {
  try {
    const departmentRef = doc(db, 'departments', departmentId);
    const updatedData = {
      ...updateData,
      updatedAt: new Date()
    };
    
    await updateDoc(departmentRef, updatedData);
    return { id: departmentId, ...updatedData };
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

// Delete department (soft delete)
export const deleteDepartment = async (departmentId) => {
  try {
    const departmentRef = doc(db, 'departments', departmentId);
    await updateDoc(departmentRef, {
      isActive: false,
      deletedAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// Assign user to department
export const assignUserToDepartment = async (userId, departmentId, role = 'staff') => {
  try {
    // Update user document with department assignment
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      departmentId,
      departmentRole: role,
      updatedAt: new Date()
    });

    // Add to department members collection
    const memberData = {
      userId,
      departmentId,
      role,
      assignedAt: new Date(),
      isActive: true
    };

    await addDoc(collection(db, 'department_members'), memberData);
    return memberData;
  } catch (error) {
    console.error('Error assigning user to department:', error);
    throw error;
  }
};

// Get department members
export const getDepartmentMembers = async (departmentId) => {
  try {
    const membersQuery = query(
      collection(db, 'department_members'),
      where('departmentId', '==', departmentId),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(membersQuery);
    const memberIds = snapshot.docs.map(doc => doc.data().userId);
    
    if (memberIds.length === 0) return [];

    // Get user details for members
    const usersQuery = query(
      collection(db, 'users'),
      where('__name__', 'in', memberIds)
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Combine member data with user details
    return snapshot.docs.map(doc => {
      const memberData = doc.data();
      const userData = users.find(user => user.id === memberData.userId);
      return {
        id: doc.id,
        ...memberData,
        user: userData,
        assignedAt: memberData.assignedAt?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error('Error fetching department members:', error);
    throw error;
  }
};

// Get user's department
export const getUserDepartment = async (userId) => {
  try {
    const membersQuery = query(
      collection(db, 'department_members'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(membersQuery);
    if (snapshot.empty) return null;

    const memberData = snapshot.docs[0].data();
    
    // Get department details
    const departmentRef = doc(db, 'departments', memberData.departmentId);
    const departmentDoc = await getDocs(query(collection(db, 'departments'), where('__name__', '==', memberData.departmentId)));
    
    if (departmentDoc.empty) return null;

    const departmentData = departmentDoc.docs[0].data();
    return {
      id: memberData.departmentId,
      ...departmentData,
      memberRole: memberData.role,
      assignedAt: memberData.assignedAt?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error fetching user department:', error);
    throw error;
  }
};

// Remove user from department
export const removeUserFromDepartment = async (userId, departmentId) => {
  try {
    // Update department member record
    const membersQuery = query(
      collection(db, 'department_members'),
      where('userId', '==', userId),
      where('departmentId', '==', departmentId),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(membersQuery);
    if (!snapshot.empty) {
      const memberDoc = snapshot.docs[0];
      await updateDoc(memberDoc.ref, {
        isActive: false,
        removedAt: new Date()
      });
    }

    // Update user document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      departmentId: null,
      departmentRole: null,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error removing user from department:', error);
    throw error;
  }
};

// Get applications by department
export const getApplicationsByDepartment = async (departmentId) => {
  try {
    const applicationsQuery = query(
      collection(db, 'applications'),
      where('departmentId', '==', departmentId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(applicationsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching applications by department:', error);
    throw error;
  }
};

// Assign application to department
export const assignApplicationToDepartment = async (applicationId, departmentId, assignedBy) => {
  try {
    const applicationRef = doc(db, 'applications', applicationId);
    await updateDoc(applicationRef, {
      departmentId,
      assignedBy,
      assignedAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error assigning application to department:', error);
    throw error;
  }
};

// Get department statistics
export const getDepartmentStatistics = async (departmentId) => {
  try {
    const applications = await getApplicationsByDepartment(departmentId);
    const members = await getDepartmentMembers(departmentId);
    
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'Pending').length,
      underReviewApplications: applications.filter(app => app.status === 'Under Review').length,
      approvedApplications: applications.filter(app => app.status === 'Approved').length,
      rejectedApplications: applications.filter(app => app.status === 'Rejected').length,
      totalMembers: members.length,
      activeMembers: members.filter(member => member.isActive).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching department statistics:', error);
    throw error;
  }
};
