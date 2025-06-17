import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { rootReducer } from "./reducers/index";
// import categoryReducer from './slice/category.slice'
// import subcategoryReducer from './slice/subCategory.slice'
// import productReducer from './slice/product.slice'
// import salesReducer from './slice/sales.slice'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['category', 'subcategory', 'product', 'sales']
}

// const rootReducer = combineReducers({
//     category: categoryReducer,
//     subcategory: subcategoryReducer,
//     product: productReducer
// })
// const rootReducer = combineReducers({
//     category: categoryReducer,
//     subcategory: subcategoryReducer,
//     product: productReducer,
//     sales: salesReducer
// })

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureAppStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        })
    })
    const persistor = persistStore(store)
    return { store, persistor }
}
