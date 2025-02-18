import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user: null, // Stores user details like name, email, etc.
  token: null, // Stores the JWT token
  isAuthenticated: false, // Checks if the user is authenticated
  status: 'idle', // Tracks request status: 'idle', 'loading', 'succeeded', or 'failed'
  error: null, // Holds error messages or null if no error
};

// Signin action
export const signin = createAsyncThunk(
  'auth/signin',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signin`,
        formData
      );
      return response.data; // { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Signin failed. Please try again.'
      );
    }
  }
);

// Signup action
export const signup = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`,
        formData
      );
      return response.data; // { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    }
  }
);

// Signout action
export const signout = createAsyncThunk(
  'auth/signout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signout`
      );
      return; // No data to return
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Signout failed. Please try again.'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null; // Resets error to null
    },
  },
  extraReducers: (builder) => {
    builder
      // Signin cases
      .addCase(signin.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; // Store user details
        state.token = action.payload.token; // Store token
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.error = action.payload || 'Signin failed. Please try again.';
      })

      // Signup cases
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; // Store user details
        state.token = action.payload.token; // Store token
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.error = action.payload || 'Signup failed. Please try again.';
      })

      // Signout cases
      .addCase(signout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signout.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null; // Clear user data
        state.token = null; // Clear token
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Signout failed. Please try again.';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
