import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch articles from Express API
export const fetchArticles = createAsyncThunk(
  'blog/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5001/api/articles'); // Fetch from Express backend
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching articles');
    }
  }
);

// Initial state
const initialState = {
  articles: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addArticle: (state, action) => {
      state.articles.push(action.payload);
    },
    removeArticle: (state, action) => {
      state.articles = state.articles.filter(
        (article) => article._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { addArticle, removeArticle } = blogSlice.actions;

// Export reducer
export default blogSlice.reducer;
