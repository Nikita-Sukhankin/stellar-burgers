import { expect, test, describe } from '@jest/globals';
import authReducer, { clearError, setUser, clearUser } from './auth-slice';
import { loginUser, registerUser, getUser, updateUser, logoutUser, checkAuth } from './auth-slice';
import { TUser } from '../../utils/types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('auth slice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };

  test('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle clearError', () => {
    const state = { ...initialState, error: 'Some error' };
    const expectedState = { ...state, error: null };
    expect(authReducer(state, clearError())).toEqual(expectedState);
  });

  test('should handle setUser', () => {
    const expectedState = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true
    };
    expect(authReducer(initialState, setUser(mockUser))).toEqual(expectedState);
  });

  test('should handle clearUser', () => {
    const state = { ...initialState, user: mockUser, isAuthenticated: true };
    const expectedState = { ...state, user: null, isAuthenticated: false };
    expect(authReducer(state, clearUser())).toEqual(expectedState);
  });

  test('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const expectedState = { ...initialState, isLoading: true };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const expectedState = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle loginUser.rejected', () => {
    const action = { type: loginUser.rejected.type, payload: 'Login failed' };
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: 'Login failed',
      isAuthenticated: false
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const expectedState = { ...initialState, isLoading: true };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle registerUser.fulfilled', () => {
    const action = { type: registerUser.fulfilled.type, payload: mockUser };
    const expectedState = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle registerUser.rejected', () => {
    const action = { type: registerUser.rejected.type, payload: 'Registration failed' };
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: 'Registration failed',
      isAuthenticated: false
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const expectedState = { ...initialState, isLoading: true };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle getUser.fulfilled', () => {
    const action = { type: getUser.fulfilled.type, payload: mockUser };
    const expectedState = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle getUser.rejected', () => {
    const action = { type: getUser.rejected.type, payload: 'Get user failed' };
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: 'Get user failed',
      isAuthenticated: false
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = { ...initialState, user: mockUser, isAuthenticated: true };
    const expectedState = { ...state, isLoading: true };
    expect(authReducer(state, action)).toEqual(expectedState);
  });

  test('should handle updateUser.fulfilled', () => {
    const updatedUser = { ...mockUser, name: 'Updated User' };
    const action = { type: updateUser.fulfilled.type, payload: updatedUser };
    const state = { ...initialState, user: mockUser, isAuthenticated: true, isLoading: true };
    const expectedState = { ...state, user: updatedUser, isLoading: false };
    expect(authReducer(state, action)).toEqual(expectedState);
  });

  test('should handle updateUser.rejected', () => {
    const action = { type: updateUser.rejected.type, payload: 'Update failed' };
    const state = { ...initialState, user: mockUser, isAuthenticated: true, isLoading: true };
    const expectedState = { ...state, isLoading: false, error: 'Update failed' };
    expect(authReducer(state, action)).toEqual(expectedState);
  });

  test('should handle logoutUser.pending', () => {
    const action = { type: logoutUser.pending.type };
    const state = { ...initialState, user: mockUser, isAuthenticated: true };
    const expectedState = { ...state, isLoading: true };
    expect(authReducer(state, action)).toEqual(expectedState);
  });

  test('should handle logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = { ...initialState, user: mockUser, isAuthenticated: true, isLoading: true };
    const expectedState = { ...state, user: null, isAuthenticated: false, isLoading: false };
    expect(authReducer(state, action)).toEqual(expectedState);
  });

  test('should handle logoutUser.rejected', () => {
    const action = { type: logoutUser.rejected.type, payload: 'Logout failed' };
    const state = { ...initialState, user: mockUser, isAuthenticated: true, isLoading: true };
    const expectedState = { ...state, user: null, isAuthenticated: false, isLoading: false, error: 'Logout failed' };
    expect(authReducer(state, action)).toEqual(expectedState);
  });

  test('should handle checkAuth.pending', () => {
    const action = { type: checkAuth.pending.type };
    const expectedState = { ...initialState, isLoading: true };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle checkAuth.fulfilled', () => {
    const action = { type: checkAuth.fulfilled.type, payload: mockUser };
    const expectedState = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle checkAuth.rejected', () => {
    const action = { type: checkAuth.rejected.type, payload: 'Auth check failed' };
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: 'Auth check failed',
      isAuthenticated: false
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });
});
