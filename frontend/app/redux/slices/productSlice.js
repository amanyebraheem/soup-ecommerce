import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();

      if (params.category) {
        searchParams.append("category", params.category);
      }

      if (params.minPrice) {
        searchParams.append("minPrice", params.minPrice);
      }

      if (params.search) {
        searchParams.append("search", params.search);
      }

      const query = searchParams.toString();

      const data = await apiRequest(
        `/products${query ? `?${query}` : ""}`
      );

      return data.products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
