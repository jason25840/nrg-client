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
  profile: null, // Profile starts as null
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ✅ Fetch User Profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticated } = getState().auth;
      if (!isAuthenticated) {
        console.warn('⚠️ Skipping profile fetch, user not authenticated');
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${userId}`,
        {
          withCredentials: true, // ✅ Ensures cookies are included
        }
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('⚠️ Unauthorized access to profile.');
        return rejectWithValue('Unauthorized');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

// ✅ Create Profile
export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async ({ userId, profileData }, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticated } = getState().auth;
      if (!isAuthenticated) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile`,
        { userId, ...profileData },
        {
          withCredentials: true, // ✅ Ensures cookies are sent
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

// ✅ Update Profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, profileData }, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticated } = getState().auth;
      if (!isAuthenticated) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${userId}`,
        profileData,
        {
          withCredentials: true, // ✅ Ensures cookies are sent
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

// ✅ Delete Profile
export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticated } = getState().auth;
      if (!isAuthenticated) {
        return rejectWithValue('User not authenticated');
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${userId}`,
        {
          withCredentials: true, // ✅ Ensures cookies are sent
        }
      );

      return userId; // Return userId to remove from Redux store
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete profile'
      );
    }
  }
);

// ✅ Profile Slice
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
      state.profile = null; // Clears profile
      state.status = 'idle';
      state.error = null;
    },
    initializeProfile(state) {
      state.profile = defaultProfile(); // Resets to default
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Profile Cases
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
        state.profile = null;
        state.error = action.payload;
        console.error('🚨 Profile Fetch Failed:', action.payload); // 👀 Show clear message
      })

      // ✅ Create Profile Cases
      .addCase(createProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ✅ Update Profile Cases
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

      // ✅ Delete Profile Cases
      .addCase(deleteProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.status = 'succeeded';
        state.profile = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// ✅ Export Actions & Reducer
export const {
  setPursuits,
  setAccomplishments,
  setSocialMediaLinks,
  clearProfile,
  initializeProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
