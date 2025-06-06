/* This JavaScript code snippet is setting up a Redux slice for managing user data in a Redux store.
Here's a breakdown of what the code is doing: */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:2221/api/a1/user';

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

// Fetch all users
export const db_fetchUsers = createAsyncThunk(
    'user/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getAxios().get('/getallUsers');
            return data.data;
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
            const { data } = await getAxios().get(`/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create user
// export const db_createUser = createAsyncThunk(
//     'user/create',
//     async (formData, { rejectWithValue }) => {
//         try {
//             const { data } = await getAxios().post('/createUser', formData);
//             return data.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

export const db_createUser = createAsyncThunk(
    'user/create',
    async (formData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const { data } = await getAxios().post('/createUser', formData, config);
            return data.data;
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
            const { data } = await getAxios().put(`/${id}`, formData);
            return data.data;
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
            await getAxios().delete(`/${id}`);
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

            .addCase(db_fetchUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            })

            .addCase(db_createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })

            .addCase(db_updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })

            .addCase(db_deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
            })

            // Rejections
            .addCase(db_fetchUserById.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(db_createUser.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(db_updateUser.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(db_deleteUser.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { db_resetUserState } = userSlice.actions;
export default userSlice.reducer;
