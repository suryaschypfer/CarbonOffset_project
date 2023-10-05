import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apislice.js'
import authSliceReducer from './authslice.js'

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store 