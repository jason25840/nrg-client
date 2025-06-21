import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    usersOnline: 0,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateReactions: (state, action) => {
      const { messageId, reactions } = action.payload;
      const msg = state.messages.find((m) => m._id === messageId);
      if (msg) msg.reactions = reactions;
    },
    setUsersOnline: (state, action) => {
      state.usersOnline = action.payload;
    },
  },
});

export const { setMessages, addMessage, updateReactions, setUsersOnline } =
  chatSlice.actions;

export default chatSlice.reducer;
