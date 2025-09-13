import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import applicationSlice from './slices/applicationSlice';
import serviceSlice from './slices/serviceSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    applications: applicationSlice,
    services: serviceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
