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
  test('should return the initial state', () => {
    expect(userOrdersReducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
  });

  test('should handle clearError', () => {
    const state = { orders: [], isLoading: false, error: 'Some error' };
    expect(userOrdersReducer(state, clearError())).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
  });

  test('should handle fetchUserOrders.pending', () => {
    const action = { type: fetchUserOrders.pending.type };
    expect(userOrdersReducer(undefined, action)).toEqual({
      orders: [],
      isLoading: true,
      error: null
    });
  });

  test('should handle fetchUserOrders.fulfilled', () => {
    const action = { type: fetchUserOrders.fulfilled.type, payload: [mockOrder] };
    expect(userOrdersReducer(undefined, action)).toEqual({
      orders: [mockOrder],
      isLoading: false,
      error: null
    });
  });

  test('should handle fetchUserOrders.rejected', () => {
    const action = { type: fetchUserOrders.rejected.type, payload: 'Fetch failed' };
    expect(userOrdersReducer(undefined, action)).toEqual({
      orders: [],
      isLoading: false,
      error: 'Fetch failed'
    });
  });
});
