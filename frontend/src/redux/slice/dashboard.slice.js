import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAxios } from '../../utils/axios';

export const getHeaderdata = createAsyncThunk(
    'dashboard/getHeaderdata',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAxios().get('/dashboard/get')
        
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const Sales_Performance = createAsyncThunk(
    'dashboard/Sales_Performance',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAxios().get('/dashboard/Sales_Performance')
           
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getAllSellerOrder = createAsyncThunk(
    'dashboard/getAllSellerOrder',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAxios().get('/dashboard/getAllSellerOrder')
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const dashboardSlice = createSlice({
    name: 'product',
    initialState: {
        dashboardHeader: null,
        dashboardSales: null,
        recentOrder: null,
        error: null,
        // success: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getHeaderdata.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getHeaderdata.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboardHeader = action.payload;
                state.success = true;
            })
            .addCase(getHeaderdata.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(Sales_Performance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(Sales_Performance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboardSales = action.payload;
                state.success = true;
            })
            .addCase(Sales_Performance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(getAllSellerOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getAllSellerOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recentOrder = action.payload;
                state.success = true;
            })
            .addCase(getAllSellerOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
    }
});


export default dashboardSlice.reducer; 