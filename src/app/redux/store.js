import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import carouselReducer from './slices/carouselSlice';
import blogReducer from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    carousel: carouselReducer,
    blog: blogReducer,
  },
});
