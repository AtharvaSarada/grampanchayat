import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Custom hook for auto-saving form drafts to localStorage
 * @param {string} formId - Unique identifier for the form (e.g., 'birth-certificate')
 * @param {Object} initialData - Initial form data
 * @param {number} debounceMs - Debounce time in milliseconds (default: 1000ms)
 */
export const useFormDraft = (formId, initialData = {}, debounceMs = 1000) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(initialData);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Generate unique storage key for this user and form
  const getStorageKey = useCallback(() => {
    if (!currentUser?.uid) return null;
    return `draft_${formId}_${currentUser.uid}`;
  }, [formId, currentUser]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft.data);
        setLastSaved(new Date(parsedDraft.timestamp));
        console.log('📄 Draft loaded:', formId, 'Last saved:', new Date(parsedDraft.timestamp).toLocaleString());
        toast.success('Draft loaded from previous session', { duration: 3000 });
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, [formId, getStorageKey]);

  // Save draft to localStorage with debounce
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    const timeoutId = setTimeout(() => {
      try {
        setIsSaving(true);
        const draftData = {
          data: formData,
          timestamp: new Date().toISOString(),
          formId,
          userId: currentUser.uid
        };
        localStorage.setItem(storageKey, JSON.stringify(draftData));
        setLastSaved(new Date());
        console.log('💾 Draft auto-saved:', formId);
      } catch (error) {
        console.error('Error saving draft:', error);
        toast.error('Failed to save draft');
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [formData, formId, currentUser, debounceMs, getStorageKey]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      localStorage.removeItem(storageKey);
      setLastSaved(null);
      console.log('🗑️ Draft cleared:', formId);
      toast.success('Draft cleared');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [formId, getStorageKey]);

  // Manual save function
  const saveDraft = useCallback(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      const draftData = {
        data: formData,
        timestamp: new Date().toISOString(),
        formId,
        userId: currentUser.uid
      };
      localStorage.setItem(storageKey, JSON.stringify(draftData));
      setLastSaved(new Date());
      toast.success('Draft saved manually');
      console.log('💾 Draft saved manually:', formId);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  }, [formData, formId, currentUser, getStorageKey]);

  // Check if draft exists
  const hasDraft = useCallback(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return false;
    return localStorage.getItem(storageKey) !== null;
  }, [getStorageKey]);

  return {
    formData,
    setFormData,
    lastSaved,
    isSaving,
    clearDraft,
    saveDraft,
    hasDraft: hasDraft()
  };
};

/**
 * Get all drafts for current user
 */
export const getAllDrafts = (userId) => {
  if (!userId) return [];

  const drafts = [];
  const prefix = `draft_`;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix) && key.includes(userId)) {
        const draftData = JSON.parse(localStorage.getItem(key));
        drafts.push({
          key,
          formId: draftData.formId,
          timestamp: draftData.timestamp,
          data: draftData.data
        });
      }
    }
  } catch (error) {
    console.error('Error getting drafts:', error);
  }

  return drafts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Clear all drafts for current user
 */
export const clearAllDrafts = (userId) => {
  if (!userId) return;

  const prefix = `draft_`;
  const keysToRemove = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix) && key.includes(userId)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    toast.success(`Cleared ${keysToRemove.length} draft(s)`);
  } catch (error) {
    console.error('Error clearing drafts:', error);
    toast.error('Failed to clear drafts');
  }
};

export default useFormDraft;
