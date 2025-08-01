import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    queryFilters: null,
    imageBaseUrl: '',
    noImageUrl: '',
  },
  reducers: {
    setProducts: (state, action) => {
      const { products, imageBaseUrl, noImageUrl } = action.payload;
      state.items = products;
      state.filteredItems = products;
      state.imageBaseUrl = imageBaseUrl;
      state.noImageUrl = noImageUrl;
      state.loading = false;
    },
    filterProducts: (state, action) => {
      state.filteredItems = action.payload;
    },
    setQueryFilters: (state, action) => {
      state.queryFilters = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setProducts, 
  filterProducts, 
  setQueryFilters,
  setLoading, 
  setError 
} = productSlice.actions;
export default productSlice.reducer;