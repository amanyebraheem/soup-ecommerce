import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/cart");
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/cart/items/${itemId}`, {
        method: "DELETE",
      });

      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cart: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export default cartSlice.reducer;
