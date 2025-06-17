import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAxios } from '../../utils/axios';
import axiosInstance from '../../utils/axiosInstance';

export const getHeaderdata = createAsyncThunk(
    'dashboard/getHeaderdata',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/dashboard/get')
        
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        dashboardHeader: {},
        error: null,
        isLoading:false,
        success: false
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
                console.log(action.payload,"sdddddddddddddddd");
                state.isLoading = false;
                state.dashboardHeader = action.payload;
                state.success = true;
            })
            .addCase(getHeaderdata.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
           
    }
});


export default dashboardSlice.reducer; 