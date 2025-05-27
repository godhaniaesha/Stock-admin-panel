import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from '../component/Main';
import ProductGrid from '../component/ProductGrid';
import ProductList from '../component/ProductList';
import CategoryList from '../component/CategoryList';
import OrderList from '../component/OrderList';


function UserRoutes() {
    return (
        <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Main />} />
            <Route path="/Productgrid" element={<ProductGrid />} />
            <Route path="/Productlist" element={<ProductList />} />
            <Route path="/Categorylist" element={<CategoryList />} />
            <Route path="/Orderlist" element={<OrderList />} />


        </Routes>
    );
}

export default UserRoutes;