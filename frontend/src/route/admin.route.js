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
import ProductGrid from '../component/ProductGrid';
import ProductList from '../component/ProductList';
import CategoryList from '../component/CategoryList';
import OrderList from '../component/OrderList';

import Login from '../component/auth/Login';
import Register from '../component/auth/Register';
import ForgotPassword from '../component/auth/ForgotPassword';
import VerifyOTP from '../component/auth/VerifyOTP';
import ChangePassword from '../component/auth/ChangePassword';
import AddUser from '../pages/AddUser';
import UserList from '../component/UserList';
import Profile from '../component/Profile';
import CartList from '../component/CartList';
import CheckoutPage from '../component/CheckoutPage';
// Add new imports
import StockOverview from '../pages/StockOverview';
import StockAdjustments from '../pages/StockAdjustments';
import EditCoupon from '../pages/EditCoupon';
import UserRoles from '../pages/UserRoles';
import Wishlist from '../pages/Wishlist';
import SalesReport from '../pages/SalesReport';
import InventoryReport from '../pages/InventoryReport';
import Settings from '../pages/Settings';
import EditUser from '../pages/EditUser';
import StockAlert from '../component/StockAlert';
import ListCoupons from '../component/ListCoupons';
import Dashboard from '../component/Dashboard';
import Calendar from '../component/Calendar';
import SubcategoryList from '../component/SubcategoryList';
import PaymentList from '../component/PaymentList';
import FAQs from '../component/FAQs';
import TeamsNDConditions from '../component/TeamsNDConditions';

function UserRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Main />}>
                {/* Stock Management */}
                <Route index element={<Dashboard />} />
                <Route path="stock" element={<StockOverview />} />
                <Route path="stock/add" element={<AddInventory />} />
                <Route path="stock/adjust" element={<StockAdjustments />} />
                <Route path="stock/alerts" element={<StockAlert />} />

                {/* Categories */}
                <Route path="categories" element={<CategoryList />} />
                <Route path="categories/add" element={<AddCategory />} />
                <Route path="categories/edit" element={<EditCategory />} />

                {/* Subcategories */}
                <Route path="subcategories" element={<SubcategoryList />} />
                <Route path="subcategories/add" element={<AddSubcategory />} />
                <Route path="subcategories/edit" element={<EditSubcategory />} />
                {/* Products */}
                <Route path="products" element={<ProductGrid />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit" element={<EditProduct />} />
                <Route path="products/view" element={<ProductList />} />

                {/* Coupons */}
                <Route path="coupons" element={<ListCoupons />} />
                <Route path="coupons/add" element={<AddCoupon />} />
                <Route path="coupons/edit" element={<EditCoupon />} />

                {/* Orders */}
                <Route path="orders" element={<OrderList />} />
                <Route path="cart" element={<CartList />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="checkout" element={<CheckoutPage />} />

                {/* Users */}
                <Route path="users" element={<UserList />} />
                <Route path="user-roles" element={<UserRoles />} />
                <Route path="add-user" element={<AddUser />} />
                <Route path="edit-user" element={<EditUser />} />

                
                {/* Reports */}
                <Route path="sales-report" element={<SalesReport />} />
                <Route path="inventory-report" element={<InventoryReport />} />

                {/* Payment */}
                <Route path="paymentList" element={< PaymentList />} />


                {/* Settings */}
                <Route path="settings" element={<Settings />} />


                {/* Calendar */}
                <Route path="Calendar" element={<Calendar />} />
                <Route path="FAQs" element={<FAQs />} />
                <Route path="tearmsconditions" element={<TeamsNDConditions />} />

            </Route>

            {/* Auth Routes - These should remain outside of Main layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default UserRoutes;