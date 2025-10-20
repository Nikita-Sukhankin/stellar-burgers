import { FC, useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from '../../services/store';
import {
  getIngredients,
  getIngredientsLoading
} from '../../services/selectors';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIngredientsLoading);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch, ingredients.length]);

  const ingredientData = useMemo(() => {
    if (!id || !ingredients.length) return null;
    return ingredients.find((ingredient) => ingredient._id === id) || null;
  }, [id, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    if (ingredients.length > 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2>Ингредиент не найден</h2>
          <p>Запрашиваемый ингредиент не существует</p>
        </div>
      );
    }
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
