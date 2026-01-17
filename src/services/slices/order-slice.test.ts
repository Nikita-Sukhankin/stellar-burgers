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
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    currentOrder: null,
    error: null
  };

  test('should return the initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle closeOrderModal', () => {
    const state = { ...initialState, orderModalData: mockOrder };
    const expectedState = { ...state, orderModalData: null };
    expect(orderReducer(state, closeOrderModal())).toEqual(expectedState);
  });

  test('should handle clearError', () => {
    const state = { ...initialState, error: 'Some error' };
    const expectedState = { ...state, error: null };
    expect(orderReducer(state, clearError())).toEqual(expectedState);
  });

  test('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const expectedState = { ...initialState, orderRequest: true };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle createOrder.fulfilled', () => {
    const action = { type: createOrder.fulfilled.type, payload: mockOrder };
    const expectedState = {
      ...initialState,
      orderRequest: false,
      orderModalData: mockOrder
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle createOrder.rejected', () => {
    const action = { type: createOrder.rejected.type, payload: 'Order failed' };
    const expectedState = {
      ...initialState,
      orderRequest: false,
      error: 'Order failed'
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle fetchOrderByNumber.fulfilled', () => {
    const action = { type: fetchOrderByNumber.fulfilled.type, payload: mockOrder };
    const expectedState = {
      ...initialState,
      currentOrder: mockOrder
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });
});
