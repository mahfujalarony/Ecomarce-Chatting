import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, name, price, imageUrl, merchantId, qty }
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, imageUrl, merchantId, merchant, qty = 1, stock } = action.payload;
      const numericPrice = Number(price);
      const numericQty = Number(qty);

      if (!Number.isFinite(numericPrice) || numericPrice < 0) return;
      
      const existing = state.items.find((it) => it.id === id);
      if (existing) {
        existing.qty = existing.qty + numericQty;
        if (stock !== undefined) existing.stock = Number(stock);
      } else {
        state.items.push({ 
          id, 
          name, 
          price: numericPrice,
          imageUrl, 
          merchantId: merchantId,
          qty: numericQty,
          ...(stock !== undefined ? { stock: Number(stock) } : {}),
        });
      }
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const existing = state.items.find((it) => it.id === id);
      if (existing && qty > 0) {
        existing.qty = Number(qty);
      }
    },
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      state.items = state.items.filter((it) => it.id !== id);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
