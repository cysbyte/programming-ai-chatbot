import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConversationState {
  images: string[];
  userInput: string;
}

const initialState: ConversationState = {
  images: [],
  userInput: "",
};

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<string>) => {
      if (state.images.length < 3) {
        state.images.push(action.payload);
      }
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.images.splice(action.payload, 1);
    },
    clearImages: (state) => {
      state.images = [];
    },
    setUserInput: (state, action: PayloadAction<string>) => {
      state.userInput = action.payload;
    },
  },
});

export const { addImage, removeImage, clearImages, setUserInput } = conversationSlice.actions;
export default conversationSlice.reducer; 