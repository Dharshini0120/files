import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionAuthStorage } from '@frontend/shared-utils';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
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
      sessionAuthStorage.setCredentials(token, user, 'admin');
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
      sessionAuthStorage.clearCredentials('admin');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = sessionAuthStorage.getToken('admin');
      const user = sessionAuthStorage.getUserInfo('admin');
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