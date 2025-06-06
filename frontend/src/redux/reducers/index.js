import { combineReducers } from '@reduxjs/toolkit';
import addCategoryReducer from '../slice/addCategory.slice';
import categoryReducer from '../slice/category.slice';
import authReducer from '../slice/auth.slice';
import subcategoryReducer from '../slice/subCategory.slice';
import productReducer from '../slice/product.slice';
import couponReducer from '../slice/coupon.slice';
import wishlistReducer from '../slice/wishlist.slice';
import cartReducer from '../slice/cart.slice';


export const rootReducer = combineReducers({
    addCategory: addCategoryReducer,
    category: categoryReducer,
    auth: authReducer,
    subcategory: subcategoryReducer,
    product: productReducer,
    coupon:couponReducer,
    wishlist:wishlistReducer,
    cart:cartReducer
});

export default rootReducer;
