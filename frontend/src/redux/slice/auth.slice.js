import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:2221/api/a1';

// ========== THUNKS ========== //

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred during registration.');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred during login.');
  }
});

export const getAllUsers = createAsyncThunk('auth/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/getAllregister`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch users');
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred while fetching users.');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (phone, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/forgotPassword/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to send OTP');
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred while sending OTP.');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/forgotPassword/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'OTP verification failed');
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred during OTP verification.');
  }
});

export const resendOtp = createAsyncThunk('auth/resendOtp', async (phone, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/forgotPassword/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to resend OTP');
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred while resending OTP.');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ phone, otp, newPassword }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/forgotPassword/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, newPassword })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Password reset failed');
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred during password reset.');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/logoutUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: userId })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Logout failed');
    }
    localStorage.removeItem('token');
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred during logout.');
  }
});

// ========== SLICE ========== //

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    users: [],
    loading: false,
    error: null,
    success: false,
    message: ''
  },
  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    clearUserData: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Register User ---
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Registering user...';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'Registration failed.';
      })

      // --- Login User ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Logging in...';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data;
        state.message = action.payload.message || 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'Login failed.';
      })

      // --- Get All Users ---
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Fetching all users...';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = action.payload.data || [];
        state.message = action.payload.message || 'Users fetched successfully.';
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'Failed to fetch users.';
      })

      // --- Forgot Password (Send OTP) ---
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Sending OTP...';
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'OTP sent successfully.';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'Failed to send OTP.';
      })

      // --- Verify OTP ---
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Verifying OTP...';
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'OTP verified successfully.';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'OTP verification failed.';
      })

      // --- Resend OTP ---
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Resending OTP...';
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'New OTP sent successfully.';
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'Failed to resend OTP.';
      })

      // --- Reset Password ---
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Resetting password...';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Password reset successfully.';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'Password reset failed.';
      })

      // --- Logout User ---
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Logging out...';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.success = true;
        state.message = action.payload.message || 'User logged out successfully.';
        localStorage.removeItem('token');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'Logout failed.';
      });
  }
});

export const { clearAuthState, clearUserData } = authSlice.actions;
export default authSlice.reducer;