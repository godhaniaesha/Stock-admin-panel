import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const API_URL = 'http://localhost:2221/api/a1/cart';

// Async thunks for API calls
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/addCart`, { userId, productId, quantity });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error adding to cart');
        }
    }
);

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (userId) => {
        const response = await axiosInstance.get(`/cart/getCart/${userId}`);
        return response.data;
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/cart/updateCart/${id}`, { quantity });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error updating cart');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (id) => {
        const response = await axiosInstance.delete(`/cart/removeCart/${id}`);
        return response.data;
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
    totalItems: 0,
    totalAmount: 0,
    stockLimitReached: false
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
            state.stockLimitReached = false;
        },
        calculateTotals: (state) => {
            state.totalItems = state.items.length;
            state.totalAmount = state.items.reduce((total, item) => {
                return total + (item.productId?.price * item.quantity);
            }, 0);
        },
        checkStockLimit: (state, action) => {
            const { productId, currentQuantity, availableStock } = action.payload;
            state.stockLimitReached = currentQuantity >= availableStock;
        }
    },
    extraReducers: (builder) => {
        builder
            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                const existingItem = state.items.find(
                    item => item.productId._id === action.payload.data.productId._id
                );
                if (existingItem) {
                    existingItem.quantity += action.payload.data.quantity;
                } else {
                    state.items.push(action.payload.data);
                }
                cartSlice.caseReducers.calculateTotals(state);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.stockLimitReached = true;
            })
            // Get cart
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                cartSlice.caseReducers.calculateTotals(state);
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item._id === action.payload.data._id);
                if (index !== -1) {
                    state.items[index] = action.payload.data;
                }
                cartSlice.caseReducers.calculateTotals(state);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.stockLimitReached = true;
            })
            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item._id !== action.meta.arg);
                cartSlice.caseReducers.calculateTotals(state);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearCart, calculateTotals, checkStockLimit } = cartSlice.actions;
export default cartSlice.reducer;
