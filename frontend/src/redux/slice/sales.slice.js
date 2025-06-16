import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:2221/api/a1/sales';
const API_URL_ORDER = 'http://localhost:2221/api/a1/order';

export const fetchSalesMetrics = createAsyncThunk(
    'sales/fetchMetrics',
    async (params = {}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/salesMetrics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    period: params.period || 'last_7_days',
                    startDate: params.startDate,
                    endDate: params.endDate
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchOrdersBySeller = createAsyncThunk(
    'sales/fetchOrdersBySeller',
    async (sellerId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL_ORDER}/seller/${sellerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchProductMovement = createAsyncThunk(
    'sales/fetchProductMovement',
    async (params = {}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/getProductMovement`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    startDate: params.startDate,
                    endDate: params.endDate
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    metrics: {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        conversionRate: 0,
    },
    salesData: [],
    ordersData: [],
    dashboardData: [],
    sellerOrders: [],
    productMovement: [],
    loading: false,
    error: null,
};

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSalesMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload;
                state.metrics = action.payload.metrics;
                state.salesData = action.payload.salesData;
                state.ordersData = action.payload.ordersData;
            })
            .addCase(fetchSalesMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrdersBySeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersBySeller.fulfilled, (state, action) => {
                state.loading = false;
                state.sellerOrders = action.payload.data;
            })
            .addCase(fetchOrdersBySeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductMovement.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductMovement.fulfilled, (state, action) => {
                state.loading = false;
               
                state.productMovement = action.payload;
            })
            .addCase(fetchProductMovement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default salesSlice.reducer;
