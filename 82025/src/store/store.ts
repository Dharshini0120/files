import { configureStore } from '@reduxjs/toolkit';
import { errorMiddleware } from './errorMiddleware';
import authReducer from './authSlice';
import assessmentReducer from './assessmentSlice';
import templateReducer from './templateSlice';

export const store = configureStore({
  reducer: {
        auth: authReducer,
        assessment: assessmentReducer,
        template: templateReducer,
  },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
