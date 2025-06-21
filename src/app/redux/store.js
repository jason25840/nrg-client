import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import carouselReducer from './slices/carouselSlice';
import articleReducer from './slices/articleSlice';
import eventReducer from './slices/eventSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    carousel: carouselReducer,
    article: articleReducer,
    events: eventReducer,
    chat: chatReducer,
  },
});
