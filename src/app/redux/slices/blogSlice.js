import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { fetchProfile } from './profileSlice'; // adjust path if needed

// ✅ Fetch Articles
export const fetchArticles = createAsyncThunk(
  'blog/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5001/api/articles');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching articles');
    }
  }
);

// ✅ Toggle Like for an Article
export const toggleLikeArticle = createAsyncThunk(
  'blog/toggleLikeArticle',
  async (articleId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth.user?._id;
      if (!userId) return rejectWithValue('User not authenticated');

      console.log('🔵 Sending Like Request:', { articleId, userId });

      const response = await axios.put(
        `http://localhost:5001/api/articles/${articleId}/like`,
        { userId },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // ✅ Include cookies
        }
      );

      console.log('🟢 Like Response:', response.data);

      return {
        articleId,
        likes: response.data.likes,
        likedBy: response.data.likedBy, // ✅ Update liked users
      };
    } catch (error) {
      console.error(
        '❌ Error updating like:',
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || 'Error updating like');
    }
  }
);

// ✅ Toggle Like Modal (Opens full like list)
export const toggleLikesModal = (articleId) => (dispatch, getState) => {
  const currentState = getState().blog.likesModalOpen;
  dispatch(setLikesModal(currentState === articleId ? null : articleId));
};

// ✅ Toggle Bookmark for an Article
export const toggleBookmarkArticle = createAsyncThunk(
  'blog/toggleBookmarkArticle',
  async (articleId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth.user?._id;

      if (!userId) {
        console.error('❌ No userId found in state!');
        return rejectWithValue('User not authenticated');
      }
      if (!articleId) {
        console.error('❌ No articleId provided!');
        return rejectWithValue('Article ID missing');
      }

      console.log('🔵 Sending Bookmark Request:', { articleId, userId });

      const response = await axios.put(
        `http://localhost:5001/api/articles/${articleId}/bookmark`,
        { userId },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // ✅ Important for session-based auth
        }
      );
      console.log('🟢 Bookmark Response:', response.data);

      return {
        articleId,
        bookmarks: response.data.bookmarks,
        bookmarkedBy: response.data.bookmarkedBy,
      };
    } catch (error) {
      console.error(
        '❌ Error updating bookmark:',
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || 'Error updating bookmark');
    }
  }
);

// ✅ Initial Redux State
const initialState = {
  articles: [],
  loading: false,
  error: null,
  likesModalOpen: null, // Stores which article’s like list is open
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
    setLikesModal: (state, action) => {
      state.likesModalOpen = action.payload;
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
      })
      // ✅ Handle Like Toggle Updates
      .addCase(toggleLikeArticle.fulfilled, (state, action) => {
        const { articleId, likes, likedBy } = action.payload;
        const article = state.articles.find((a) => a._id === articleId);
        if (article) {
          article.likes = likes;
          article.likedBy = likedBy; // ✅ Properly update liked users
        }
      })
      // ✅ Handle Bookmark Toggle Updates
      .addCase(toggleBookmarkArticle.fulfilled, (state, action) => {
        const { articleId, bookmarks, bookmarkedBy } = action.payload;
        const article = state.articles.find((a) => a._id === articleId);
        if (article) {
          article.bookmarks = bookmarks;
          article.bookmarkedBy = bookmarkedBy;
        }
      });
  },
});

// Export actions
export const { addArticle, removeArticle, setLikesModal } = blogSlice.actions;

// Export reducer
export default blogSlice.reducer;
