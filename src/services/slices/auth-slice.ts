import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

export interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const extractErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const loginUser = createAsyncThunk<
  TUser | null,
  TLoginData,
  { rejectValue: string }
>('auth/loginUser', async (data: TLoginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    }
    return rejectWithValue('Ошибка авторизации');
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, 'Ошибка авторизации'));
  }
});

export const registerUser = createAsyncThunk<
  TUser | null,
  TRegisterData,
  { rejectValue: string }
>('auth/registerUser', async (data: TRegisterData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    }
    return rejectWithValue('Ошибка регистрации');
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, 'Ошибка регистрации'));
  }
});

export const getUser = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    if (response.success) {
      return response.user;
    }
    return rejectWithValue('Ошибка получения данных пользователя');
  } catch (error: unknown) {
    return rejectWithValue(
      extractErrorMessage(error, 'Ошибка получения данных пользователя')
    );
  }
});

export const updateUser = createAsyncThunk<
  TUser | null,
  Partial<TRegisterData>,
  { rejectValue: string }
>(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user);
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Ошибка обновления данных пользователя');
    } catch (error: unknown) {
      return rejectWithValue(
        extractErrorMessage(error, 'Ошибка обновления данных пользователя')
      );
    }
  }
);

export const logoutUser = createAsyncThunk<null, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error: unknown) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(extractErrorMessage(error, 'Ошибка выхода'));
    }
  }
);

export const checkAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const token = getCookie('accessToken');
    if (!token) {
      return rejectWithValue('Нет токена');
    }
    const response = await getUserApi();
    if (response.success) {
      return response.user;
    }
    return rejectWithValue('Ошибка проверки авторизации');
  } catch (error: unknown) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return rejectWithValue(
      extractErrorMessage(error, 'Ошибка проверки авторизации')
    );
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state: AuthState) => {
      state.error = null;
    },
    setUser: (state: AuthState, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(loginUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state: AuthState, action: PayloadAction<TUser | null>) => {
          state.isLoading = false;
          state.user = action.payload || null;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(
        loginUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = (action.payload as string) || 'Ошибка входа';
          state.isAuthenticated = false;
        }
      )
      .addCase(registerUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state: AuthState, action: PayloadAction<TUser | null>) => {
          state.isLoading = false;
          state.user = action.payload || null;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(
        registerUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = (action.payload as string) || 'Ошибка регистрации';
          state.isAuthenticated = false;
        }
      )
      .addCase(getUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getUser.fulfilled,
        (state: AuthState, action: PayloadAction<TUser | null>) => {
          state.isLoading = false;
          state.user = action.payload || null;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(
        getUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error =
            (action.payload as string) ||
            'Ошибка получения данных пользователя';
          state.isAuthenticated = false;
        }
      )
      .addCase(updateUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateUser.fulfilled,
        (state: AuthState, action: PayloadAction<TUser | null>) => {
          state.isLoading = false;
          state.user = action.payload || null;
          state.error = null;
        }
      )
      .addCase(
        updateUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error =
            (action.payload as string) || 'Ошибка обновления данных';
        }
      )
      .addCase(logoutUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state: AuthState) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(
        logoutUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
          state.error = (action.payload as string) || 'Ошибка выхода';
        }
      )
      .addCase(checkAuth.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        checkAuth.fulfilled,
        (state: AuthState, action: PayloadAction<TUser | null>) => {
          state.isLoading = false;
          state.user = action.payload || null;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(
        checkAuth.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
          state.error =
            (action.payload as string) || 'Ошибка проверки авторизации';
        }
      );
  }
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
