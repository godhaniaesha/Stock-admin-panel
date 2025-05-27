import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from '../component/Main';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import AddCategory from '../pages/AddCategory';
import EditCategory from '../pages/EditCategory';
import AddSubcategory from '../pages/AddSubcategory';
import EditSubcategory from '../pages/EditSubcategory';
import AddInventory from '../pages/AddInventory';
import EditInventory from '../pages/EditInventory';
import AddCoupon from '../pages/AddCoupon';


import Login from '../component/auth/Login';
import Register from '../component/auth/Register';
import ForgotPassword from '../component/auth/ForgotPassword';
import VerifyOTP from '../component/auth/VerifyOTP';
import ChangePassword from '../component/auth/ChangePassword';

function UserRoutes() {
    return (
        <Routes>
            {/* aesha */}
            <Route path="/" element={<Main />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            <Route path="/EditProduct" element={<EditProduct />} />
            <Route path="/AddCategory" element={<AddCategory />} />
            <Route path="/EditCategory" element={<EditCategory />} />
            <Route path="/AddSubcategory" element={<AddSubcategory />} />
            <Route path="/EditSubcategory" element={<EditSubcategory />} />
            <Route path="/AddInventory" element={<AddInventory />} />
            <Route path="/EditInventory" element={<EditInventory />} />
            <Route path="/AddCoupon" element={<AddCoupon />} />


            {/* denisha */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
    );
}

export default UserRoutes;