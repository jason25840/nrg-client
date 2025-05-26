import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProfile } from './profileSlice';
import axios from 'axios';

// ✅ Base API URL (Uses Next.js environment variables)
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

// Initial state
const initialState = {
  user: null, // Stores user details
  isAuthenticated: false, // Tracks authentication status
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Holds error messages
  hasFetchedUser: false, // Tracks if fetchUser() has completed at least once
};

// ✅ Fetch user session (Runs on page refresh)
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      // console.log('🔍 Fetching user from API...');
      const response = await axios.get(`${API_URL}/api/auth/user`, {
        withCredentials: true, // ✅ Ensures cookies persist
      });
      return response.data; // { user }
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('⚠️ No active session found. User is logged out.');
        return null; // ✅ Return `null` instead of rejecting
      }

      console.error('❌ FetchUser error:', error);
      return rejectWithValue('Failed to fetch user');
    }
  }
);

// ✅ Signin action (Saves session in HTTP-only cookies)
export const signin = createAsyncThunk(
  'auth/signin',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signin`,
        formData,
        { withCredentials: true }
      );

      const user = response.data.user;

      // ✅ Immediately fetch the user's profile after sign-in
      const profileResponse = await dispatch(fetchProfile(user._id));

      // Optional: handle profile failure if needed
      if (fetchProfile.rejected.match(profileResponse)) {
        console.warn('⚠️ Profile fetch failed after sign in');
      }

      return user; // Still return the user data to auth slice
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Signin failed. Please try again.'
      );
    }
  }
);

// ✅ Signup action (Saves session in HTTP-only cookies)
export const signup = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        formData,
        { withCredentials: true }
      );

      return response.data; // ✅ { user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Signup failed. Please try again.'
      );
    }
  }
);

// ✅ Signout action (Clears cookies & session)
export const signout = createAsyncThunk(
  'auth/signout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚀 Sending signout request...');

      const response = await axios.post(
        `${API_URL}/api/auth/signout`,
        {}, // Empty body
        { withCredentials: true } // ✅ Ensures cookies are sent
      );

      console.log('✅ Signout successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Signout error:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || 'Signout failed. Please try again.'
      );
    }
  }
);

// ✅ Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null; // ✅ Clears error messages
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch User Cases (Runs on page load)
      .addCase(fetchUser.pending, (state) => {
        console.log('🚀 FetchUser pending...');
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        // console.log('✅ FetchUser fulfilled:', action.payload); // Debugging

        if (action.payload) {
          // ✅ Fix avatar URL if necessary
          let avatar = action.payload.avatar;
          if (avatar?.startsWith('//')) {
            avatar = `https:${avatar}`;
          }

          state.user = { ...action.payload, avatar }; // ✅ Update user with fixed avatar
          // ✅ At this point, user is set — socket connection can safely be established
          state.isAuthenticated = true;
          state.status = 'succeeded'; // ✅ Set status to "succeeded"
        } else {
          console.log('⚠️ No active session found. User is logged out.');

          state.user = null;
          state.isAuthenticated = false;
          state.status = 'succeeded'; // ✅ Mark fetch complete to avoid re-dispatch loop
        }

        state.hasFetchedUser = true;

        // console.log('📝 Updated Redux Auth State:', state);
      })
      .addCase(fetchUser.rejected, (state) => {
        console.log('❌ FetchUser rejected - No user found');
        state.status = 'failed'; // 🔁 Prevents retry loop
        state.user = null;
        state.isAuthenticated = false;
        state.hasFetchedUser = true;
      })

      // ✅ Signin Cases
      .addCase(signin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.error = action.payload || 'Signin failed. Please try again.';
      })

      // ✅ Signup Cases
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; // ✅ because 'user' is nested
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.error = action.payload || 'Signup failed. Please try again.';
      })

      // ✅ Signout Cases
      .addCase(signout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signout.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
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
