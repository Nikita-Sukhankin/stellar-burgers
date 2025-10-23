import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';

export interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder | null,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredients: string[], { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    return response.order || null;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка создания заказа'
    );
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder | null,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number: number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response.orders?.[0] || null;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка загрузки заказа'
    );
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state: OrderState) => {
      state.orderModalData = null;
    },
    clearError: (state: OrderState) => {
      state.error = null;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(createOrder.pending, (state: OrderState) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state: OrderState, action: any) => {
        state.orderRequest = false;
        state.orderModalData = action.payload || null;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state: OrderState, action: any) => {
        state.orderRequest = false;
        state.error = (action.payload as string) || 'Ошибка создания заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state: OrderState) => {
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state: OrderState, action: any) => {
          state.currentOrder = action.payload || null;
          state.error = null;
        }
      )
      .addCase(
        fetchOrderByNumber.rejected,
        (state: OrderState, action: any) => {
          state.error = (action.payload as string) || 'Ошибка загрузки заказа';
        }
      );
  }
});

export const { closeOrderModal, clearError } = orderSlice.actions;
export default orderSlice.reducer;
