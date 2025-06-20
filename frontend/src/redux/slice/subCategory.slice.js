import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all subcategories
export const fetchSubcategories = createAsyncThunk(
    'subcategory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/subcategory/getSubcategories');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subcategories');
        }
    }
);

export const WaccesssubCategories = createAsyncThunk(
    'subcategory/WaccesssubCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/subcategory/getall');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subcategories');
        }
    }
);

// Create subcategory
export const createSubcategory = createAsyncThunk(
    'subcategory/create',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.post(
                '/subcategory/CreateSubcat',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create subcategory');
        }
    }
);

// Delete subcategory
export const deleteSubcategory = createAsyncThunk(
    'subcategory/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/subcategory/deleteSubcategory/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete subcategory');
        }
    }
);

// Update subcategory
export const updateSubcategory = createAsyncThunk(
    'subcategory/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/subcategory/updateSubcategory/${id}`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update subcategory');
        }
    }
);

const subcategorySlice = createSlice({
    name: 'subcategory',
    initialState: {
        subcategories: [],
        isLoading: false,
        error: null
    },
    reducers: {
        clearSubcategoryError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch subcategories
            .addCase(fetchSubcategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSubcategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subcategories = action.payload;
            })
            .addCase(fetchSubcategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create subcategory
            .addCase(createSubcategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSubcategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subcategories.push(action.payload);
            })
            .addCase(createSubcategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete subcategory
            .addCase(deleteSubcategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteSubcategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subcategories = state.subcategories.filter(
                    subcategory => subcategory._id !== action.payload
                );
            })
            .addCase(deleteSubcategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update subcategory
            .addCase(updateSubcategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateSubcategory.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.subcategories.findIndex(sub => sub._id === action.payload._id);
                if (index !== -1) {
                    state.subcategories[index] = action.payload;
                }
            })
            .addCase(updateSubcategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(WaccesssubCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(WaccesssubCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subcategories = action.payload;
            })
            .addCase(WaccesssubCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            ;

    }
});

export const { clearSubcategoryError } = subcategorySlice.actions;
export default subcategorySlice.reducer;
