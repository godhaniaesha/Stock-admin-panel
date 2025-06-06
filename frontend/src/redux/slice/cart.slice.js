import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:2221/api/a1/cart';

// Async thunks for API calls
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ userId, productId, quantity }) => {
        const response = await axios.post(`${API_URL}/addCart`, { userId, productId, quantity });
        return response.data;
    }
);

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (userId) => {
        const response = await axios.get(`${API_URL}/getCart/${userId}`);
        return response.data;
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ id, quantity }) => {
        const response = await axios.put(`${API_URL}/updateCart/${id}`, { quantity });
        return response.data;
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (id) => {
        const response = await axios.delete(`${API_URL}/removeCart/${id}`);
        return response.data;
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
    totalItems: 0,
    totalAmount: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
        },
        calculateTotals: (state) => {
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => {
                return total + (item.productId?.price * item.quantity);
            }, 0);
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
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get cart
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
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
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item._id !== action.meta.arg);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
