import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Message } from '@/lib/ai-service';

interface ConversationState {
  images: string[];
  userInput: string;
  conversationId: string;
  round: number;
  prompt: Message[];
}

const initialState: ConversationState = {
  images: [],
  userInput: "",
  conversationId: "",
  round: 0,
  prompt: [],
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
    setConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },
    setRound: (state, action: PayloadAction<number>) => {
      state.round = action.payload;
    },
    setPrompt: (state, action: PayloadAction<Message[]>) => {
      state.prompt = action.payload;
    },
  },
});

export const { addImage, removeImage, clearImages, setUserInput, setConversationId, setRound, setPrompt } = conversationSlice.actions;
export default conversationSlice.reducer; 