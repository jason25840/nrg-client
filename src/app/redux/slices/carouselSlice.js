import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCardIndex: null, // Stores the index of the currently open card
};

const carouselSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {
    openCard: (state, action) => {
      state.activeCardIndex = action.payload;
    },
    closeCard: (state) => {
      state.activeCardIndex = null;
    },
  },
});

export const { openCard, closeCard } = carouselSlice.actions;
export default carouselSlice.reducer;
