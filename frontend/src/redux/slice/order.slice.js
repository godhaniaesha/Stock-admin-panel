import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const API_BASE_URL = 'http://localhost:2221/api/a1/order';

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

// Fetch all orders
// export const fetchOrders = createAsyncThunk(
//     'order/fetchAll',
//     async (_, { rejectWithValue }) => {
//         try {
//             const { data } = await getAxios().get('/get');
//             return data.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

export const fetchOrders = createAsyncThunk(
    'order/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            // console.log('Making API call to fetch orders...');
            // const { data } = await getAxios().get('/seller');
            // console.log('API response:', data);
            // return data.data;
            const response = await axiosInstance.get('/order/seller');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
    'order/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/order/get/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create order
export const createOrder = createAsyncThunk(
    'order/create',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/order/add', orderData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update order
export const updateOrder = createAsyncThunk(
    'order/update',
    async ({ id, orderData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/order/update/${id}`, orderData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete order
export const deleteOrder = createAsyncThunk(
    'order/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/order/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get orders by user ID
export const fetchOrdersByUser = createAsyncThunk(
    'order/fetchByUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/order/user/${userId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        selectedOrder: null,
        userOrders: [],
        isLoading: false,
        error: null
    },
    reducers: {
        resetOrderState: (state) => {
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all orders
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch order by ID
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Create order
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update order
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete order
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(order => order._id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Fetch orders by user
            .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
                state.userOrders = action.payload;
            })
            .addCase(fetchOrdersByUser.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
