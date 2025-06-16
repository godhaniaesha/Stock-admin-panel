import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:2221/api/a1';

// ========== THUNKS ========== //

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    console.log(data,"data");
    localStorage.setItem('token',data.accessToken)
    localStorage.setItem('user',data.data._id)
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
    console.log(data,"data");
    localStorage.setItem("user",data.finduser._id)
    localStorage.setItem("token",data.accessToken)
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred during login.');
  }
});

export const getAllUsers = createAsyncThunk('auth/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/getAllUsers`);
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
    localStorage.setItem('forgot-phone',phone)
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
    console.log(phone,otp,'verify-otp');
    const data = await response.json();
    localStorage.setItem('storedOtp',otp)
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
    console.log(phone,otp,newPassword,'verify-otp');
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
    localStorage.removeItem('user');
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred during logout.');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/updateUser/${id}`, {
      method: 'PUT',
      body: formData, 
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Profile update failed');
    }
    console.log(data,"data");
    
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'An unknown error occurred during profile update.');
  }
});

export const verifyGST = createAsyncThunk('auth/verifyGST', async ({ gstNumber, userId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/verify-gst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gstNumber, userId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'GST verification failed');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addBusinessDetails = createAsyncThunk('auth/addBusinessDetails', async ({ userId, ...businessDetails }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/add-business-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...businessDetails })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add business details');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const sendOTP = createAsyncThunk('auth/sendOTP', async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ userId, otp }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'OTP verification failed');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addStoreDetails = createAsyncThunk('auth/addStoreDetails', async ({ userId, ...storeDetails }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/add-store-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...storeDetails })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add store details');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addBankDetails = createAsyncThunk('auth/addBankDetails', async ({ userId, ...bankDetails }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/add-bank-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...bankDetails })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add bank details');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addPickupAddress = createAsyncThunk('auth/addPickupAddress', async ({ userId, ...addressDetails }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/add-pickup-address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...addressDetails })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add pickup address');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const acceptTermsAndConditions = createAsyncThunk('auth/acceptTerms', async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/register/accept-terms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to accept terms and conditions');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});
export const checkSellerStatus = createAsyncThunk('auth/checkSellerStatus', async (userId, { rejectWithValue }) => {
  try {
      const response = await fetch(`${BASE_URL}/register/check-seller-status/${userId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to check seller status');
      return data;
  } catch (err) {
      return rejectWithValue(err.message);
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
    message: '',
    currentStep: 0,
    gstVerified: false,
    businessDetailsAdded: false,
    otpSent: false,
    otpVerified: false,
    storeDetailsAdded: false,
    bankDetailsAdded: false,
    pickupAddressAdded: false,
    termsAccepted: false,
  },
  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
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
      })

      // --- Update Profile ---
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = 'Updating profile...';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data;
        state.message = action.payload.message || 'Profile updated successfully.';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload || 'Profile update failed.';
      })

      // --- Verify GST ---
      .addCase(verifyGST.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyGST.fulfilled, (state, action) => {
        state.loading = false;
        state.gstVerified = true;
        state.message = action.payload.message;
      })
      .addCase(verifyGST.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Add Business Details ---
      .addCase(addBusinessDetails.fulfilled, (state, action) => {
        state.businessDetailsAdded = true;
        state.user = action.payload.data;
      })

      // --- Send OTP ---
      .addCase(sendOTP.fulfilled, (state) => {
        state.otpSent = true;
      })

      // --- Verify OTP ---
      .addCase(verifyOTP.fulfilled, (state) => {
        state.otpVerified = true;
      })

      // --- Add Store Details ---
      .addCase(addStoreDetails.fulfilled, (state, action) => {
        state.storeDetailsAdded = true;
        state.user = action.payload.data;
      })

      // --- Add Bank Details ---
      .addCase(addBankDetails.fulfilled, (state, action) => {
        state.bankDetailsAdded = true;
        state.user = action.payload.data;
      })

      // --- Add Pickup Address ---
      .addCase(addPickupAddress.fulfilled, (state, action) => {
        state.pickupAddressAdded = true;
        state.user = action.payload.data;
      })

      // --- Accept Terms And Conditions ---
      .addCase(acceptTermsAndConditions.fulfilled, (state, action) => {
        state.termsAccepted = true;
        state.user = action.payload.data;
      })
      .addCase(checkSellerStatus.fulfilled, (state, action) => {
        const { registrationStatus, completedSteps, isRegistrationComplete } = action.payload.data;
        state.gstVerified = registrationStatus.gstVerified;
        state.businessDetailsAdded = registrationStatus.businessDetailsAdded;
        state.storeDetailsAdded = registrationStatus.storeDetailsAdded;
        state.bankDetailsAdded = registrationStatus.bankDetailsAdded;
        state.pickupAddressAdded = registrationStatus.pickupAddressAdded;
        state.termsAccepted = registrationStatus.termsAccepted;
        state.currentStep = completedSteps;
    });
  }
});

export const { clearAuthState, setCurrentStep } = authSlice.actions;
export default authSlice.reducer;