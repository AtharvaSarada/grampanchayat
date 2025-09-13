/**
 * Draft save/load functionality for form data
 */

// Generate a unique draft key for a service and user
const getDraftKey = (serviceType, userId) => {
  return `draft_${serviceType}_${userId}`;
};

// Save draft data to localStorage
export const saveDraft = (serviceType, userId, formData) => {
  try {
    const draftKey = getDraftKey(serviceType, userId);
    const draftData = {
      formData,
      lastSaved: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem(draftKey, JSON.stringify(draftData));
    return true;
  } catch (error) {
    console.error('Error saving draft:', error);
    return false;
  }
};

// Load draft data from localStorage
export const loadDraft = (serviceType, userId) => {
  try {
    const draftKey = getDraftKey(serviceType, userId);
    const draftString = localStorage.getItem(draftKey);
    
    if (!draftString) return null;
    
    const draftData = JSON.parse(draftString);
    
    // Check if draft is not too old (e.g., older than 30 days)
    const lastSaved = new Date(draftData.lastSaved);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (lastSaved < thirtyDaysAgo) {
      clearDraft(serviceType, userId);
      return null;
    }
    
    return draftData.formData;
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
};

// Clear draft data
export const clearDraft = (serviceType, userId) => {
  try {
    const draftKey = getDraftKey(serviceType, userId);
    localStorage.removeItem(draftKey);
    return true;
  } catch (error) {
    console.error('Error clearing draft:', error);
    return false;
  }
};

// Check if draft exists
export const hasDraft = (serviceType, userId) => {
  const draftKey = getDraftKey(serviceType, userId);
  return localStorage.getItem(draftKey) !== null;
};

// Get all draft keys for a user (for cleanup)
export const getUserDrafts = (userId) => {
  try {
    const drafts = [];
    const prefix = `draft_`;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix) && key.endsWith(`_${userId}`)) {
        const serviceType = key.replace(prefix, '').replace(`_${userId}`, '');
        const draftString = localStorage.getItem(key);
        
        if (draftString) {
          try {
            const draftData = JSON.parse(draftString);
            drafts.push({
              serviceType,
              lastSaved: draftData.lastSaved,
              key
            });
          } catch (e) {
            console.warn('Invalid draft data found:', key);
          }
        }
      }
    }
    
    return drafts;
  } catch (error) {
    console.error('Error getting user drafts:', error);
    return [];
  }
};

// Clean up old drafts for a user
export const cleanupOldDrafts = (userId, daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const userDrafts = getUserDrafts(userId);
    let cleanedCount = 0;
    
    userDrafts.forEach(draft => {
      const lastSaved = new Date(draft.lastSaved);
      if (lastSaved < cutoffDate) {
        localStorage.removeItem(draft.key);
        cleanedCount++;
      }
    });
    
    return cleanedCount;
  } catch (error) {
    console.error('Error cleaning up drafts:', error);
    return 0;
  }
};

// Auto-save hook for React components
// Note: This should be used in a React component, not in utils
// For now, commented out to avoid import issues
/*
export const useAutoSave = (serviceType, userId, formData, enabled = true, delay = 2000) => {
  const [lastSaveTime, setLastSaveTime] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  
  React.useEffect(() => {
    if (!enabled || !formData || !userId || !serviceType) return;
    
    // Don't save if no data or only empty strings
    const hasData = Object.values(formData).some(value => {
      if (typeof value === 'string') return value.trim() !== '';
      return value !== null && value !== undefined;
    });
    
    if (!hasData) return;
    
    const timeoutId = setTimeout(() => {
      setIsSaving(true);
      const success = saveDraft(serviceType, userId, formData);
      if (success) {
        setLastSaveTime(new Date());
      }
      setIsSaving(false);
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [formData, serviceType, userId, enabled, delay]);
  
  return { lastSaveTime, isSaving };
};
*/

export default {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  getUserDrafts,
  cleanupOldDrafts
};
