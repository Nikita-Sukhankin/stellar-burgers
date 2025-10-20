import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUserOrders,
  getUserOrdersLoading,
  getUserOrdersError,
  getIngredients,
  getIngredientsLoading
} from '../../services/selectors';
import { fetchUserOrders } from '../../services/slices/user-orders-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

const LoadingState: FC<{ text?: string }> = ({
  text = 'Загрузка заказов...'
}) => <div>{text}</div>;

const ErrorState: FC<{ message: string }> = ({ message }) => (
  <div>Ошибка загрузки заказов: {message}</div>
);

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUserOrders);
  const isLoading = useSelector(getUserOrdersLoading);
  const error = useSelector(getUserOrdersError);
  const ingredients = useSelector(getIngredients);
  const ingredientsLoading = useSelector(getIngredientsLoading);

  const shouldFetchIngredients =
    ingredients.length === 0 && !ingredientsLoading;

  useEffect(() => {
    dispatch(fetchUserOrders());

    if (shouldFetchIngredients) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, shouldFetchIngredients]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
