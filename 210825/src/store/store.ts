import { configureStore } from '@reduxjs/toolkit';
import { errorMiddleware } from './errorMiddleware';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;