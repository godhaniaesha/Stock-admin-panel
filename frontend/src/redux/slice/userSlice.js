/* This JavaScript code snippet is setting up a Redux slice for managing user data in a Redux store.
Here's a breakdown of what the code is doing: */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all users
export const db_fetchUsers = createAsyncThunk(
    'user/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/register/getAllUsers');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch user by ID
export const db_fetchUserById = createAsyncThunk(
    'user/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/register/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create user
export const db_createUser = createAsyncThunk(
    'user/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/register/createUser', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update user by ID
export const db_updateUser = createAsyncThunk(
    'user/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/register/updateUser/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete user by ID
export const db_deleteUser = createAsyncThunk(
    'user/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/register/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        selectedUser: null,
        isLoading: false,
        error: null
    },
    reducers: {
        db_resetUserState: (state) => {
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(db_fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(db_fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(db_fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch User by ID
            .addCase(db_fetchUserById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(db_fetchUserById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedUser = action.payload;
            })
            .addCase(db_fetchUserById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update User
            .addCase(db_updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(db_updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.selectedUser = action.payload;
            })
            .addCase(db_updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Delete User
            .addCase(db_deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(db_deleteUser.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { db_resetUserState } = userSlice.actions;
export default userSlice.reducer;
