import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch Events (sorted by date)
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching events');
    }
  }
);

// ✅ Like Event (Fixed)
export const likeEvent = createAsyncThunk(
  'events/likeEvent',
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      if (!user) throw new Error('Unauthorized');
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/like`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error liking event');
    }
  }
);

// ✅ Bookmark Event (Fixed)
export const bookmarkEvent = createAsyncThunk(
  'events/bookmarkEvent',
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      if (!user) throw new Error('Unauthorized');
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error bookmarking event');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: { events: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likeEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(bookmarkEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1) state.events[index] = action.payload;
      });
  },
});

export default eventsSlice.reducer;
