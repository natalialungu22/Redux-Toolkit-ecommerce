import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },

  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity = item.quantity;
      } else {
        state.items.push({ ...item });
      }
    },
    removeFromCart(state, action) {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex((i) => i.id === id);
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = Math.max(1, quantity);
      } else {
        // console.log(`Item ${id} not found in cart for update`);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
