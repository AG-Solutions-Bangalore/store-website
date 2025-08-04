// slices/CartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, size, operation, quantity } = action.payload;
      

      const existingItemIndex = state.items.findIndex(
        item => item.id === id && item.size === size
      );
      
      if (existingItemIndex !== -1) {

        const existingItem = state.items[existingItemIndex];
        
        if (operation === 'increment') {

          existingItem.quantity += quantity;
        } else if (operation === 'decrement') {

          existingItem.quantity -= quantity;
          

          if (existingItem.quantity <= 0) {
            state.items.splice(existingItemIndex, 1);
          }
        }
      } else {
        
        if (operation === 'increment' || !operation) {
          state.items.push({
            ...action.payload,

            operation: undefined
          });
        }
      }
    },
    updateCartItems: (state, action) => {
      state.items = action.payload;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    removeFromProductCart: (state, action) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(item => !(item.id === id && item.size === size));
    },
    
    
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateCartItems,removeFromProductCart } = CartSlice.actions;
export default CartSlice.reducer;