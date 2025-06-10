import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:2221/api/a1/wishlist';

// Async thunks for API calls
export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async ({ userId, productId }) => {
        const response = await axios.post(`${API_URL}/addWishlist`, { userId, productId });
        console.log(response, "response.data");
        
        return response.data;
    }
);

export const getAllWishlists = createAsyncThunk(
    'wishlist/getAllWishlists',
    async () => {
        const response = await axios.get(`${API_URL}/getAllWishlists`);
        return response.data;
    }
);


// Get wishlist product by ID
export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async (userId) => {
        console.log(userId, "userId");
        const response = await axios.get(`${API_URL}/getWishlist/${userId}`);
        return response.data;
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (id) => {
        const response = await axios.delete(`${API_URL}/removeWishlist/${id}`);
        return response.data;
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
