import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (
      state: ConstructorState,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.bun = action.payload;
    },
    addIngredient: (
      state: ConstructorState,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = [...(state.ingredients || []), action.payload];
    },
    removeIngredient: (
      state: ConstructorState,
      action: PayloadAction<string>
    ) => {
      state.ingredients = (state.ingredients || []).filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state: ConstructorState,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const ingredients = state.ingredients || [];
      const newIngredients = [...ingredients];
      const draggedIngredient = newIngredients[dragIndex];
      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, draggedIngredient);

      state.ingredients = newIngredients;
    },
    clearConstructor: (state: ConstructorState) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
