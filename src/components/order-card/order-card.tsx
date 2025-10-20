import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { OrderCardProps } from './type';
import { TIngredient } from '../../utils/types';
import { OrderCardUI } from '../ui/order-card';
import { getIngredients } from '../../services/selectors';

const maxIngredients = 6;

const findIngredientById = (
  ingredients: TIngredient[],
  id: string
): TIngredient | undefined => ingredients.find((ing) => ing._id === id);

export const OrderCard: FC<OrderCardProps> = memo(
  ({ order }: OrderCardProps) => {
    const location = useLocation();
    const ingredients: TIngredient[] = useSelector(getIngredients);

    const orderInfo = useMemo(() => {
      if (!ingredients.length) {
        return null;
      }

      const ingredientsInfo: TIngredient[] = [];
      for (const item of order.ingredients) {
        const ingredient = findIngredientById(ingredients, item);
        if (ingredient) ingredientsInfo.push(ingredient);
      }

      const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

      const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

      const remains =
        ingredientsInfo.length > maxIngredients
          ? ingredientsInfo.length - maxIngredients
          : 0;

      const date = new Date(order.createdAt);
      return {
        ...order,
        ingredientsInfo,
        ingredientsToShow,
        remains,
        total,
        date
      };
    }, [order, ingredients]);

    if (!orderInfo) {
      return null;
    }

    return (
      <OrderCardUI
        orderInfo={orderInfo}
        maxIngredients={maxIngredients}
        locationState={{ background: location }}
      />
    );
  }
);
