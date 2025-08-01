// slices/recentlyViewedSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addToRecentlyViewed: (state, action) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingIndex >= 0) {
        // Remove existing item to move it to the front
        state.items.splice(existingIndex, 1);
      }
      
      // Add new item to the beginning
      state.items.unshift(action.payload);
      
      // Keep only the last 10 viewed items
      if (state.items.length > 10) {
        state.items = state.items.slice(0, 10);
      }
    },
    removeFromRecentlyViewed: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
    }
  }
});

export const { addToRecentlyViewed, removeFromRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;