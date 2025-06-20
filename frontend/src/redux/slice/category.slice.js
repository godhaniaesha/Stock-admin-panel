import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const API_URL = 'http://localhost:2221/api/a1/category';

// Create async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'category/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/category", {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);
export const WaccessCategories = createAsyncThunk(
  'category/WaccessCategories',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/category/getall', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);
// Create async thunk for updating a category
export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      console.log("Sending update request with data:", formData);
      
      const response = await axiosInstance.put(`/category/${id}`, formData);
      console.log("Update response:", response.data);
      
      return response.data;
    } catch (error) {
      console.error("Update error:", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

// Create async thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/category/${id}`);
      return id; // Return the deleted category's ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        } else {
          // If not found, add the updated/created category (handles upsert)
          state.categories.push(action.payload);
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(WaccessCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(WaccessCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(WaccessCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
      });
  }
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;