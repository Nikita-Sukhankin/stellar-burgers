import { FC, useMemo, useEffect } from 'react'; // ← добавлен useEffect
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorBun,
  getConstructorIngredients,
  getOrderRequest,
  getOrderModalData,
  getIsAuthenticated
} from '../../services/selectors';
import {
  createOrder,
  closeOrderModal
} from '../../services/slices/order-slice';
import { clearConstructor } from '../../services/slices/constructor-slice'; // ← новый импорт

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector(getConstructorBun);
  const ingredients = useSelector(getConstructorIngredients);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const constructorItems = {
    bun,
    ingredients: ingredients || []
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const orderIngredients = [
      constructorItems.bun._id,
      ...(ingredients || []).map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(orderIngredients));
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  // ✅ Очищаем конструктор после успешного заказа
  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
