import { expect, test, describe } from '@jest/globals';
import userOrdersReducer, { clearError } from './user-orders-slice';
import { fetchUserOrders } from './user-orders-slice';
import { TOrder } from '../../utils/types';

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2']
};

describe('user orders slice', () => {
  const initialState = {
    orders: [],
    isLoading: false,
    error: null
  };

  test('should return the initial state', () => {
    expect(userOrdersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle clearError', () => {
    const state = { ...initialState, error: 'Some error' };
    const expectedState = { ...state, error: null };
    expect(userOrdersReducer(state, clearError())).toEqual(expectedState);
  });

  test('should handle fetchUserOrders.pending', () => {
    const action = { type: fetchUserOrders.pending.type };
    const expectedState = { ...initialState, isLoading: true };
    expect(userOrdersReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle fetchUserOrders.fulfilled', () => {
    const action = { type: fetchUserOrders.fulfilled.type, payload: [mockOrder] };
    const expectedState = {
      ...initialState,
      orders: [mockOrder],
      isLoading: false
    };
    expect(userOrdersReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle fetchUserOrders.rejected', () => {
    const action = { type: fetchUserOrders.rejected.type, payload: 'Fetch failed' };
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: 'Fetch failed'
    };
    expect(userOrdersReducer(initialState, action)).toEqual(expectedState);
  });
});
