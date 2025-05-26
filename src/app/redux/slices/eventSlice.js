import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`,
        eventData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding event');
    }
  }
);

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

// ✅ Like Event (using cookie-based auth)
export const toggleLikeEvent = createAsyncThunk(
  'events/likeEvent',
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      if (!user || !user._id) {
        console.error('❌ No authenticated user found in state');
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/like`,
        { userId: user._id },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // ✅ Include JWT cookie
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        '❌ Error liking event:',
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || 'Error liking event');
    }
  }
);

// ✅ Toggle Bookmark for an Event
export const toggleBookmarkEvent = createAsyncThunk(
  'events/toggleBookmarkEvent',
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?._id;

      if (!userId) {
        console.error('❌ No userId found in state!');
        return rejectWithValue('User not authenticated');
      }

      if (!eventId) {
        console.error('❌ No eventId provided!');
        return rejectWithValue('Event ID missing');
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/bookmark`,
        { userId },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      return {
        eventId,
        bookmarks: response.data.event.bookmarks,
        action: response.data.action,
        _id: response.data.event._id, // Important for updating in reducer
      };
    } catch (error) {
      console.error(
        '❌ Error updating event bookmark:',
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || 'Error updating event bookmark'
      );
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: { events: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
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
      .addCase(toggleLikeEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(toggleBookmarkEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1) state.events[index] = action.payload;
      });
  },
});

export default eventsSlice.reducer;
