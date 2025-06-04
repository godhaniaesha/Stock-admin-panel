import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const db_token = localStorage.getItem('token');
    const db_user = localStorage.getItem('user');

    // Check if both token and user exist
    if (db_token && db_user) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
