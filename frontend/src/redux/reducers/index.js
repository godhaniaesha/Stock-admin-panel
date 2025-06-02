import { combineReducers } from '@reduxjs/toolkit';
import addCategoryReducer from '../slice/addCategory.slice';
import categoryReducer from '../slice/category.slice';
import subcategoryReducer from '../slice/subCategory.slice';

export const rootReducer = combineReducers({
    addCategory: addCategoryReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer
});

export default rootReducer;
