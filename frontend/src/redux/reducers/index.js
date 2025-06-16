import { combineReducers } from '@reduxjs/toolkit';
import addCategoryReducer from '../slice/addCategory.slice';
import categoryReducer from '../slice/category.slice';
import authReducer from '../slice/auth.slice';
import subcategoryReducer from '../slice/subCategory.slice';
import productReducer from '../slice/product.slice';
import couponReducer from '../slice/coupon.slice';
import wishlistReducer from '../slice/wishlist.slice';
import cartReducer from '../slice/cart.slice';
import userReducer from '../slice/userSlice';
import inventoryReducer from '../slice/inventory.Slice';
import orderReducer from '../slice/order.slice';
import paymentReducer from '../slice/payment.slice';
import dashboardReducer from '../slice/dashboard.slice';


export const rootReducer = combineReducers({
    addCategory: addCategoryReducer,
    category: categoryReducer,
    auth: authReducer,
    subcategory: subcategoryReducer,
    product: productReducer,
    coupon:couponReducer,
    wishlist:wishlistReducer,
    cart:cartReducer,
    user:userReducer,
    inventory:inventoryReducer,
    order:orderReducer,
    payment:paymentReducer,
    dashboard:dashboardReducer
});

export default rootReducer;
