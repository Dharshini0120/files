import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { logout } from './authSlice';

export const errorMiddleware: Middleware =
    ({ dispatch }: MiddlewareAPI) =>
        (next) =>
            (action) => {
                if (isRejectedWithValue(action) && action.payload && typeof action.payload === 'object' && 'status' in action.payload) {
                    if (action.payload.status === 401) {
                        dispatch(logout());
                        window.location.href = '/auth/signin';
                    }
                }

                return next(action);
            };