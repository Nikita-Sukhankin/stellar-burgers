import { expect, test, describe } from '@jest/globals';
import authReducer, { clearError, setUser, clearUser } from './auth-slice';
import { loginUser, registerUser, getUser, updateUser, logoutUser, checkAuth } from './auth-slice';
import { TUser } from '../../utils/types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('auth slice', () => {
  test('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  });

  test('should handle clearError', () => {
    const state = { user: null, isAuthenticated: false, isLoading: false, error: 'Some error' };
    expect(authReducer(state, clearError())).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  });

  test('should handle setUser', () => {
    expect(authReducer(undefined, setUser(mockUser))).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('should handle clearUser', () => {
    const state = { user: mockUser, isAuthenticated: true, isLoading: false, error: null };
    expect(authReducer(state, clearUser())).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  });

  test('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    expect(authReducer(undefined, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null
    });
  });

  test('should handle loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    expect(authReducer(undefined, action)).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('should handle loginUser.rejected', () => {
    const action = { type: loginUser.rejected.type, payload: 'Login failed' };
    expect(authReducer(undefined, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Login failed'
    });
  });

  test('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    expect(authReducer(undefined, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null
    });
  });

  test('should handle registerUser.fulfilled', () => {
    const action = { type: registerUser.fulfilled.type, payload: mockUser };
    expect(authReducer(undefined, action)).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('should handle registerUser.rejected', () => {
    const action = { type: registerUser.rejected.type, payload: 'Registration failed' };
    expect(authReducer(undefined, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Registration failed'
    });
  });

  test('should handle getUser.pending', () => {
    const action = { type: getUser.pending.type };
    expect(authReducer(undefined, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null
    });
  });

  test('should handle getUser.fulfilled', () => {
    const action = { type: getUser.fulfilled.type, payload: mockUser };
    expect(authReducer(undefined, action)).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('should handle getUser.rejected', () => {
    const action = { type: getUser.rejected.type, payload: 'Get user failed' };
    expect(authReducer(undefined, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Get user failed'
    });
  });

  test('should handle updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = { user: mockUser, isAuthenticated: true, isLoading: false, error: null };
    
    expect(authReducer(state, action)).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: true,
      error: null
    });
  });

  test('should handle updateUser.fulfilled', () => {
    const updatedUser = { ...mockUser, name: 'Updated User' };
    const action = { type: updateUser.fulfilled.type, payload: updatedUser };
    const state = { user: mockUser, isAuthenticated: true, isLoading: true, error: null };
    
    expect(authReducer(state, action)).toEqual({
      user: updatedUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('should handle updateUser.rejected', () => {
    const action = { type: updateUser.rejected.type, payload: 'Update failed' };
    const state = { user: mockUser, isAuthenticated: true, isLoading: true, error: null };
    
    expect(authReducer(state, action)).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: 'Update failed'
    });
  });

  test('should handle logoutUser.pending', () => {
    const action = { type: logoutUser.pending.type };
    const state = { user: mockUser, isAuthenticated: true, isLoading: false, error: null };
    
    expect(authReducer(state, action)).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: true,
      error: null
    });
  });

  test('should handle logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = { user: mockUser, isAuthenticated: true, isLoading: true, error: null };
    
    expect(authReducer(state, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  });

  test('should handle logoutUser.rejected', () => {
    const action = { type: logoutUser.rejected.type, payload: 'Logout failed' };
    const state = { user: mockUser, isAuthenticated: true, isLoading: true, error: null };
    
    expect(authReducer(state, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Logout failed'
    });
  });

  test('should handle checkAuth.pending', () => {
    const action = { type: checkAuth.pending.type };
    expect(authReducer(undefined, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null
    });
  });

  test('should handle checkAuth.fulfilled', () => {
    const action = { type: checkAuth.fulfilled.type, payload: mockUser };
    expect(authReducer(undefined, action)).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('should handle checkAuth.rejected', () => {
    const action = { type: checkAuth.rejected.type, payload: 'Auth check failed' };
    expect(authReducer(undefined, action)).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Auth check failed'
    });
  });
});
