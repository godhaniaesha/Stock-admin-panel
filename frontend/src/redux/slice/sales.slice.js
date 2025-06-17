import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:2221/api/a1/sales';

// export const fetchSalesMetrics = createAsyncThunk(
//     'sales/fetchMetrics',
//     async (_, { rejectWithValue }) => {
//         try {
//             const token = localStorage.getItem('token');
//             console.log(token)
//             const response = await axios.get(`${API_URL}/salesMetrics`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             console.log(response.data)
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );


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
export const fetchInventoryMetrics = createAsyncThunk(
    'sales/InventoryMetrics',
    async (params = {}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/InventoryMetrics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    period: params.period || 'last_7_days',
                    startDate: params.startDate,
                    endDate: params.endDate
                }
            });
            console.log(response.data);
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
            const response = await axios.get(`${API_URL}/ProductMovement`, {
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
    inventory: {
        TotalProducts: 0,
        TotalOutStock: 0,
        TotalStockValue: 0,
        TotalLowStock: 0,
        StockByCategory: []
    },
    salesData: [],
    ordersData: [],
    dashboardData: [],
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
            .addCase(fetchInventoryMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInventoryMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.inventory = action.payload;
            })
            .addCase(fetchInventoryMetrics.rejected, (state, action) => {
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
