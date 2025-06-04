import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import categoryReducer from './slice/category.slice'
import subcategoryReducer from './slice/subCategory.slice'
import productReducer from './slice/product.slice'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['category', 'subcategory', 'product']
}

const rootReducer = combineReducers({
    category: categoryReducer,
    subcategory: subcategoryReducer,
    product: productReducer
})

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
