import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getOrdersApi } from '../../utils/burger-api';

const extractErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export interface UserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('userOrders/fetchUserOrders', async (_: void, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response || [];
  } catch (error: unknown) {
    return rejectWithValue(
      extractErrorMessage(error, 'Ошибка загрузки заказов')
    );
  }
});

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearError: (state: UserOrdersState) => {
      state.error = null;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchUserOrders.pending, (state: UserOrdersState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state: UserOrdersState, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchUserOrders.rejected,
        (state: UserOrdersState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = (action.payload as string) || 'Ошибка загрузки заказов';
        }
      );
  }
});

export const { clearError } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;
