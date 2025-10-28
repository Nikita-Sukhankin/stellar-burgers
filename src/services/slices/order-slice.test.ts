import { expect, test, describe } from '@jest/globals';
import orderReducer, { closeOrderModal, clearError } from './order-slice';
import { createOrder, fetchOrderByNumber } from './order-slice';
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

describe('order slice', () => {
  test('should return the initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual({
      orderRequest: false,
      orderModalData: null,
      currentOrder: null,
      error: null
    });
  });

  test('should handle closeOrderModal', () => {
    const state = { orderRequest: false, orderModalData: mockOrder, currentOrder: null, error: null };
    expect(orderReducer(state, closeOrderModal())).toEqual({
      orderRequest: false,
      orderModalData: null,
      currentOrder: null,
      error: null
    });
  });

  test('should handle clearError', () => {
    const state = { orderRequest: false, orderModalData: null, currentOrder: null, error: 'Some error' };
    expect(orderReducer(state, clearError())).toEqual({
      orderRequest: false,
      orderModalData: null,
      currentOrder: null,
      error: null
    });
  });

  test('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    expect(orderReducer(undefined, action)).toEqual({
      orderRequest: true,
      orderModalData: null,
      currentOrder: null,
      error: null
    });
  });

  test('should handle createOrder.fulfilled', () => {
    const action = { type: createOrder.fulfilled.type, payload: mockOrder };
    expect(orderReducer(undefined, action)).toEqual({
      orderRequest: false,
      orderModalData: mockOrder,
      currentOrder: null,
      error: null
    });
  });

  test('should handle createOrder.rejected', () => {
    const action = { type: createOrder.rejected.type, payload: 'Order failed' };
    expect(orderReducer(undefined, action)).toEqual({
      orderRequest: false,
      orderModalData: null,
      currentOrder: null,
      error: 'Order failed'
    });
  });

  test('should handle fetchOrderByNumber.fulfilled', () => {
    const action = { type: fetchOrderByNumber.fulfilled.type, payload: mockOrder };
    expect(orderReducer(undefined, action)).toEqual({
      orderRequest: false,
      orderModalData: null,
      currentOrder: mockOrder,
      error: null
    });
  });
});
