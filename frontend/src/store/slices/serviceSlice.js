import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: '',
  categories: [],
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    fetchServicesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchServicesSuccess: (state, action) => {
      state.loading = false;
      state.services = action.payload;
      state.error = null;
    },
    fetchServicesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentService: (state, action) => {
      state.currentService = action.payload;
    },
    addService: (state, action) => {
      state.services.push(action.payload);
    },
    updateService: (state, action) => {
      const index = state.services.findIndex(service => service.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
      if (state.currentService?.id === action.payload.id) {
        state.currentService = action.payload;
      }
    },
    deleteService: (state, action) => {
      state.services = state.services.filter(service => service.id !== action.payload);
      if (state.currentService?.id === action.payload) {
        state.currentService = null;
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchServicesStart,
  fetchServicesSuccess,
  fetchServicesFailure,
  setCurrentService,
  addService,
  updateService,
  deleteService,
  setSearchQuery,
  setSelectedCategory,
  setCategories,
  clearError,
} = serviceSlice.actions;

export default serviceSlice.reducer;
