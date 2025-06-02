import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all subcategories
export const fetchSubcategories = createAsyncThunk(
    'subcategory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:2221/api/a1/subcategory/getSubcategories', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch subcategories');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create subcategory
export const createSubcategory = createAsyncThunk(
    'subcategory/create',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:2221/api/a1/subcategory/createSubcategory', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create subcategory');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete subcategory
export const deleteSubcategory = createAsyncThunk(
    'subcategory/delete',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:2221/api/a1/subcategory/deleteSubcategory/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete subcategory');
            }
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
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
            });
    }
});

export const { clearSubcategoryError } = subcategorySlice.actions;
export default subcategorySlice.reducer;
