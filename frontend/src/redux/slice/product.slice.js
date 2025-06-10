import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:2221/api/a1/product';

// Create product
export const createProduct = createAsyncThunk(
    'product/create',
    async (productData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/addProduct`, productData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create product');
        }
    }
);

// Get all products
export const fetchProducts = createAsyncThunk(
    'product/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/getProduct`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data,"fetch product");
            return response.data;
            
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

// Get product by ID
export const fetchProductById = createAsyncThunk(
    'product/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/get/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

// Update product
export const updateProduct = createAsyncThunk(
    'product/update',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/update/${id}`, productData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update product');
        }
    }
);

// Delete product
export const deleteProduct = createAsyncThunk(
    'product/delete',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        currentProduct: null,
        isLoading: false,
        error: null,
        success: false
    },
    reducers: {
        clearProductError: (state) => {
            state.error = null;
        },
        clearProductSuccess: (state) => {
            state.success = false;
        },
        resetCurrentProduct: (state) => {
            state.currentProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create product
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products.unshift(action.payload.data);
                state.success = true;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Fetch all products
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.data;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentProduct = action.payload.data;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.products.findIndex(p => p._id === action.payload.data._id);
                if (index !== -1) {
                    state.products[index] = action.payload.data;
                }
                state.success = true;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = state.products.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProductError, clearProductSuccess, resetCurrentProduct } = productSlice.actions;
export default productSlice.reducer; 