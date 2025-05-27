import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from '../component/Main';
import Login from '../component/auth/Login';
import Register from '../component/auth/Register';
import ForgotPassword from '../component/auth/ForgotPassword';
import VerifyOTP from '../component/auth/VerifyOTP';
import ChangePassword from '../component/auth/ChangePassword';

function UserRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
    );
}

export default UserRoutes;