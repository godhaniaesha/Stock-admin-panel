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



function UserRoutes() {
    return (
        <Routes>
            {/* <Route path="/" element={<Home />} /> */}
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



        </Routes>
    );
}

export default UserRoutes;