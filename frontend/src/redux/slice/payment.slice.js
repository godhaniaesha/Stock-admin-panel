import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:2221/api/a1/payment';

// Create payment
export const createPayment = createAsyncThunk(
    'payment/create',
    async (paymentData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/add`, paymentData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create payment');
        }
    }
);

// Get all payments
export const fetchPayments = createAsyncThunk(
    'payment/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/get`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
        }
    }
);

// Get payment by ID
export const fetchPaymentById = createAsyncThunk(
    'payment/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/get/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment');
        }
    }
);

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
    'payment/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/update/${id}`, { status }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update payment status');
        }
    }
);

// Delete payment
export const deletePayment = createAsyncThunk(
    'payment/delete',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete payment');
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payments: [],
        currentPayment: null,
        isLoading: false,
        error: null,
        success: false
    },
    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        },
        clearPaymentSuccess: (state) => {
            state.success = false;
        },
        resetCurrentPayment: (state) => {
            state.currentPayment = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create payment
            .addCase(createPayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.payments.unshift(action.payload.data);
                state.success = true;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Fetch all payments
            .addCase(fetchPayments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.payments = action.payload.data;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch payment by ID
            .addCase(fetchPaymentById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPaymentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentPayment = action.payload.data;
            })
            .addCase(fetchPaymentById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update payment status
            .addCase(updatePaymentStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.payments.findIndex(p => p._id === action.payload.data._id);
                if (index !== -1) {
                    state.payments[index] = action.payload.data;
                }
                state.success = true;
            })
            .addCase(updatePaymentStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Delete payment
            .addCase(deletePayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletePayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.payments = state.payments.filter(p => p._id !== action.payload);
            })
            .addCase(deletePayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearPaymentError, clearPaymentSuccess, resetCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
