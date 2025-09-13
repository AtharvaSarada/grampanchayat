import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload.applications;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.currentPage;
      state.error = null;
    },
    fetchApplicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentApplication: (state, action) => {
      state.currentApplication = action.payload;
    },
    updateApplicationStatus: (state, action) => {
      const { applicationId, status, remarks } = action.payload;
      const application = state.applications.find(app => app.id === applicationId);
      if (application) {
        application.status = status;
        application.remarks = remarks;
        application.updatedAt = new Date().toISOString();
      }
      if (state.currentApplication?.id === applicationId) {
        state.currentApplication.status = status;
        state.currentApplication.remarks = remarks;
        state.currentApplication.updatedAt = new Date().toISOString();
      }
    },
    addApplication: (state, action) => {
      state.applications.unshift(action.payload);
      state.totalCount += 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchApplicationsFailure,
  setCurrentApplication,
  updateApplicationStatus,
  addApplication,
  clearError,
  setPage,
} = applicationSlice.actions;

export default applicationSlice.reducer;
