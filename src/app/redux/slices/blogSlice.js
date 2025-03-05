import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
      const userId = state.auth.user?._id; // Ensure we have a logged-in user
      if (!userId) return rejectWithValue('User not authenticated');

      const response = await axios.put(
        `http://localhost:5001/api/articles/${articleId}/like`
      );
      return {
        articleId,
        likes: response.data.likes,
        likedBy: response.data.likedBy,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating like');
    }
  }
);

// ✅ Toggle Like Modal (Opens full like list)
export const toggleLikesModal = (articleId) => (dispatch, getState) => {
  const currentState = getState().blog.likesModalOpen;
  dispatch(setLikesModal(currentState === articleId ? null : articleId));
};

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
          article.likedBy = likedBy; // Update liked users
        }
      });
  },
});

// Export actions
export const { addArticle, removeArticle, setLikesModal } = blogSlice.actions;

// Export reducer
export default blogSlice.reducer;
