import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:2221/api/a1/coupon';

// Axios instance with auth header
const getAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Fetch all coupons
export const fetchCoupons = createAsyncThunk(
    'coupon/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getAxios().get('/get');
            console.log(data.data,"data");
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch coupon by ID
export const fetchCouponById = createAsyncThunk(
    'coupon/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await getAxios().get(`/get/${id}`);
            console.log(data.data,"data");
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create coupon
export const createCoupon = createAsyncThunk(
    'coupon/create',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await getAxios().post('/add', formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update coupon
export const updateCoupon = createAsyncThunk(
    'coupon/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await getAxios().put(`/update/${id}`, formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete coupon
export const deleteCoupon = createAsyncThunk(
    'coupon/delete',
    async (id, { rejectWithValue }) => {
        try {
            await getAxios().delete(`/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Activate coupon
export const activateCoupon = createAsyncThunk(
    'coupon/activate',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await getAxios().post('/active', { id });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const couponSlice = createSlice({
    name: 'coupon',
    initialState: {
        coupons: [],
        selectedCoupon: null,
        isLoading: false,
        error: null
    },
    reducers: {
        resetCouponState: (state) => {
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(fetchCouponById.fulfilled, (state, action) => {
                state.selectedCoupon = action.payload;
            })

            .addCase(createCoupon.fulfilled, (state, action) => {
                state.coupons.push(action.payload); // <-- this line throws the error
            })
            

            .addCase(updateCoupon.fulfilled, (state, action) => {
                const index = state.coupons.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
            })

            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload);
            })

            .addCase(activateCoupon.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.coupons.findIndex(coupon => coupon._id === updated._id);
                if (index !== -1) {
                    state.coupons[index] = updated;
                }
            })

            // Rejections
            .addCase(fetchCouponById.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(activateCoupon.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { resetCouponState } = couponSlice.actions;
export default couponSlice.reducer;
