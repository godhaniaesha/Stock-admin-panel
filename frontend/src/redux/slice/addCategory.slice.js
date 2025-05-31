import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create async thunk for adding a new category
export const addCategory = createAsyncThunk(
  'category/add',
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Validate required fields
      if (!categoryData.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!categoryData.description?.trim()) {
        throw new Error('Description is required');
      }
      if (!categoryData.image) {
        throw new Error('Image is required');
      }

      // Append text fields
      formData.append('title', categoryData.title.trim());
      formData.append('description', categoryData.description.trim());
      
      // Append image file
      formData.append('image', categoryData.image);

      console.log('Sending data:', {
        title: categoryData.title.trim(),
        description: categoryData.description.trim(),
        hasImage: !!categoryData.image,
        imageName: categoryData.image?.name
      });

      const response = await fetch('http://localhost:2221/api/a1/category/createCategory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header when using FormData
          // The browser will set it automatically with the correct boundary
        },
        body: formData
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create category');
      }
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      return rejectWithValue(error.message || 'An error occurred while creating the category');
    }
  }
);

const addCategorySlice = createSlice({
  name: 'addCategory',
  initialState: {
    isLoading: false,
    error: null,
    success: false
  },
  reducers: {
    clearAddCategoryError: (state) => {
      state.error = null;
    },
    resetAddCategoryState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearAddCategoryError, resetAddCategoryState } = addCategorySlice.actions;
export default addCategorySlice.reducer;
