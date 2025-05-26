import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//import { fetchProfile } from './profileSlice';

// ✅ Fetch Articles
export const fetchArticles = createAsyncThunk(
  'article/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5001/api/articles');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching articles');
    }
  }
);

// ✅ Create a New Article (Admin Only)
export const createArticle = createAsyncThunk(
  'article/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/articles',
        articleData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating article');
    }
  }
);

// ✅ Update an Existing Article
export const updateArticle = createAsyncThunk(
  'article/updateArticle',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/articles/${id}`,
        updates,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating article');
    }
  }
);

// ✅ Delete an Article
export const deleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5001/api/articles/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting article');
    }
  }
);

// ✅ Toggle Like for an Article
export const toggleLikeArticle = createAsyncThunk(
  'article/toggleLikeArticle',
  async (articleId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth.user?._id;
      if (!userId) return rejectWithValue('User not authenticated');

      const response = await axios.put(
        `http://localhost:5001/api/articles/${articleId}/like`,
        { userId },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // ✅ Include cookies
        }
      );

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
  const currentState = getState().article.likesModalOpen;
  dispatch(setLikesModal(currentState === articleId ? null : articleId));
};

// ✅ Toggle Bookmark for an Article
export const toggleBookmarkArticle = createAsyncThunk(
  'article/toggleBookmarkArticle',
  async (articleId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user || !user._id) {
        console.error('❌ No authenticated user found in state');
        return rejectWithValue('User not authenticated');
      }

      if (!articleId) {
        console.error('❌ No articleId provided');
        return rejectWithValue('Article ID missing');
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/${articleId}/bookmark`,
        {}, // ✅ no body needed
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // ✅ cookie-based auth
        }
      );

      return response.data; // returns { article, action }
    } catch (error) {
      console.error(
        '❌ Error bookmarking article:',
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || 'Error bookmarking article'
      );
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

const articleSlice = createSlice({
  name: 'article',
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
      // ✅ On Article Creation Success
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles.push(action.payload);
      })

      // ✅ On Article Update Success
      .addCase(updateArticle.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.articles.findIndex((a) => a._id === updated._id);
        if (index !== -1) {
          state.articles[index] = updated;
        }
      })

      // ✅ On Article Deletion
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter((a) => a._id !== action.payload);
      })
      // ✅ Handle Like Toggle Updates
      .addCase(toggleLikeArticle.fulfilled, (state, action) => {
        const { articleId, likes, likedBy } = action.payload;
        const article = state.articles.find((a) => a._id === articleId);
        if (article) {
          article.likes = likes;
          article.likedBy = likedBy;
        }
      })
      // ✅ Handle Bookmark Toggle Updates
      .addCase(toggleBookmarkArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload.article;
        const index = state.articles.findIndex(
          (a) => a._id === updatedArticle._id
        );
        if (index !== -1) state.articles[index] = updatedArticle;
      });
  },
});

// Export actions
export const { addArticle, removeArticle, setLikesModal } =
  articleSlice.actions;

// Export reducer
export default articleSlice.reducer;
