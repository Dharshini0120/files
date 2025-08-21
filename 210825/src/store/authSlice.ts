import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionAuthStorage } from '@frontend/shared-utils';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    facilities?: Array<{
        facility_id: string;
        services: string[];
        _id: string;
    }>;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
            const { token, user } = action.payload;
            sessionAuthStorage.setCredentials(token, user, 'user');
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            sessionAuthStorage.clearCredentials('user');
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        initializeAuth: (state) => {
            const token = sessionAuthStorage.getToken('user');
            const user = sessionAuthStorage.getUserInfo('user');
            if (token && user) {
                state.token = token;
                state.user = user;
                state.isAuthenticated = true;
            }
        },
    },
});

export const { setCredentials, setLoading, setError, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;