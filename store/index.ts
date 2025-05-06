import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 