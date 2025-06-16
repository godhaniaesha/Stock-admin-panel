import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
 
const API_URL = 'http://localhost:2221/api/a1/inventory';
 
// Create product
export const createInventory = createAsyncThunk(
    'inventory/create',
    async (inventoryData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/create`, inventoryData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create product');
        }
    }
);
// GET ALL
export const fetchInventories = createAsyncThunk(
    'inventory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
        }
    }
);
 
// GET SINGLE
export const fetchInventoryById = createAsyncThunk(
    'inventory/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
        }
    }
);

// UPDATE
export const updateInventory = createAsyncThunk(
    'inventory/update',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            console.log("Sending update request with:", { id, updatedData });
            
            const response = await axios.put(`${API_URL}/${id}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            console.log("Update response:", response.data);
            
            // After successful update, fetch the updated inventory
            const updatedResponse = await axios.get(`${API_URL}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            console.log("Fetched updated inventory:", updatedResponse.data);
            return updatedResponse.data;
        } catch (error) {
            console.error("Update error:", error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update inventory');
        }
    }
);

// DELETE
export const deleteInventory = createAsyncThunk(
    'inventory/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete inventory');
        }
    }
);

// ✅ Get Low Inventory Thunk
export const getLowInventory = createAsyncThunk(
    'inventory/getLow',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/getlow`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Filter products where quantity is less than or equal to lowStockLimit
        const lowInventory = response.data.filter(item => item.quantity <= item.lowStockLimit);
        return lowInventory;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch low inventory');
      }
    }
);

// Get Product Movement Thunk
export const getProductMovement = createAsyncThunk(
    'inventory/getProductMovement',
    async (period, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/product-movement?period=${period}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product movement data');
        }
    }
);
 
const productSlice = createSlice({
    name: 'inventory',
    initialState: {
        inventory: [],
        lowInventory: [],
        isLoading: false,
        error: null,
        success: false
    },
    reducers: {
        clearProductError: (state) => {
            state.error = null;
        },
        clearProductSuccess: (state) => {
            state.success = false;
        },
        resetCurrentProduct: (state) => {
            state.currentProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create product
            .addCase(createInventory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createInventory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.inventory.unshift(action.payload.data);
                state.success = true;
            })
            .addCase(createInventory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            // FETCH ALL
            .addCase(fetchInventories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInventories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.inventory = action.payload;
            })
            .addCase(fetchInventories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // FETCH ONE
            .addCase(fetchInventoryById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInventoryById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singleInventory = action.payload;
            })
            .addCase(fetchInventoryById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // UPDATE
            .addCase(updateInventory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateInventory.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update the inventory in the state with the new data
                const index = state.inventory.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.inventory[index] = action.payload;
                }
                state.success = true;
            })
            .addCase(updateInventory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // DELETE
            .addCase(deleteInventory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteInventory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.inventory = state.inventory.filter((item) => item._id !== action.payload);
                state.success = true;
            })
            .addCase(deleteInventory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            
            .addCase(getLowInventory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
              })
              .addCase(getLowInventory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lowInventory = action.payload; // store low inventory data separately
              })
              .addCase(getLowInventory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
              })

            // Product Movement
            .addCase(getProductMovement.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProductMovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productMovement = action.payload.productMovement;
            })
            .addCase(getProductMovement.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});
 
export const { clearProductError, clearProductSuccess, resetCurrentProduct } = productSlice.actions;
export default productSlice.reducer;