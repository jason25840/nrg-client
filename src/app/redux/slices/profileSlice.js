import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Utility function to return the default profile structure
const defaultProfile = () => ({
  pursuits: [],
  accomplishments: [],
  socialMediaLinks: {
    instagram: '',
    tiktok: '',
    strava: '',
    youtube: '',
  },
});

const initialState = {
  profile: null, // Profile starts as null to indicate no profile exists
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk to fetch the profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Get JWT token from Redux state
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${userId}`,
        {
          headers: { 'x-auth-token': token }, // Send token in headers
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

// Async thunk to create the profile
export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async ({ userId, profileData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Get JWT token from Redux state
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile`,
        { userId, ...profileData },
        {
          headers: { 'x-auth-token': token }, // Send token in headers
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create profile'
      );
    }
  }
);

// Async thunk to update the profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, profileData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Get JWT token from Redux state
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${userId}`,
        profileData,
        {
          headers: { 'x-auth-token': token }, // Send token in headers
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

// Async thunk to delete the profile
export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Get JWT token from Redux state
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${userId}`,
        {
          headers: { 'x-auth-token': token }, // Send token in headers
        }
      );
      return userId; // Return userId to remove the profile from the Redux state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete profile'
      );
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setPursuits(state, action) {
      if (state.profile) {
        state.profile.pursuits = action.payload;
      }
    },
    setAccomplishments(state, action) {
      if (state.profile) {
        state.profile.accomplishments = action.payload;
      }
    },
    setSocialMediaLinks(state, action) {
      if (state.profile) {
        state.profile.socialMediaLinks = action.payload;
      }
    },
    clearProfile(state) {
      state.profile = null; // Clear the profile entirely
      state.status = 'idle';
      state.error = null;
    },
    initializeProfile(state) {
      state.profile = defaultProfile(); // Initialize a default profile structure
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.profile = null; // Explicitly set profile to null on fetch failure
        state.error = action.payload;
      })

      .addCase(createProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload; // Set the newly created profile
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(deleteProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.status = 'succeeded';
        state.profile = null; // Clear profile on successful deletion
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setPursuits,
  setAccomplishments,
  setSocialMediaLinks,
  clearProfile,
  initializeProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
