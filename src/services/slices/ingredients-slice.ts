import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';

const extractErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_: void, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();
    return response || [];
  } catch (error: unknown) {
    return rejectWithValue(
      extractErrorMessage(error, 'Ошибка загрузки ингредиентов')
    );
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearError: (state: IngredientsState) => {
      state.error = null;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchIngredients.pending, (state: IngredientsState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (
          state: IngredientsState,
          action: PayloadAction<TIngredient[] | undefined>
        ) => {
          state.isLoading = false;
          state.ingredients = action.payload || [];
          state.error = null;
        }
      )
      .addCase(
        fetchIngredients.rejected,
        (
          state: IngredientsState,
          action: PayloadAction<string | undefined>
        ) => {
          state.isLoading = false;
          state.error =
            (action.payload as string) || 'Ошибка загрузки ингредиентов';
        }
      );
  }
});

export const { clearError } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
