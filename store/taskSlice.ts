import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskState {
  images: string[];
}

const initialState: TaskState = {
  images: [],
};

export const taskSlice = createSlice({
  name: 'task',
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
  },
});

export const { addImage, removeImage, clearImages } = taskSlice.actions;
export default taskSlice.reducer; 