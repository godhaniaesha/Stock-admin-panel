import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

// Async thunks for API calls
export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/wishlist/addWishlist', { userId, productId });
            console.log(response, "response.data");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
        }
    }
);

export const getAllWishlists = createAsyncThunk(
    'wishlist/getAllWishlists',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/wishlist/getAllWishlists');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlists');
        }
    }
);

// Get wishlist product by ID
export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async (userId, { rejectWithValue }) => {
        try {
            console.log(userId, "userId");
            const response = await axiosInstance.get(`/wishlist/getWishlist/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/wishlist/removeWishlist/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add to wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get all wishlists
            .addCase(getAllWishlists.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllWishlists.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(getAllWishlists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get wishlist
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Remove from wishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item._id !== action.meta.arg);
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default wishlistSlice.reducer;
