import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },

  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
      if (existingItemIndex !== -1) {
        state.items = state.items.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: item.quantity } : i
        );
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
      state.items = state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
