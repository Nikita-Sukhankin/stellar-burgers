import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-card.module.css';

import { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState }) => {
    const formattedNumber = String(orderInfo.number).padStart(6, '0');
    const INGREDIENT_OFFSET = 20;

    return (
      <Link
        to={orderInfo.number.toString()}
        relative='path'
        state={locationState}
        className={`p-6 mb-4 mr-2 ${styles.order}`}
      >
        <div className={styles.order_info}>
          <span className={`text text_type_digits-default ${styles.number}`}>
            #{formattedNumber}
          </span>
          <span className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={orderInfo.date} />
          </span>
        </div>
        <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
          {orderInfo.name}
        </h4>
        <OrderStatus status={orderInfo.status} />
        <div className={`pt-6 ${styles.order_content}`}>
          <ul className={styles.ingredients}>
            {orderInfo.ingredientsToShow.map(
              (ingredient: any, index: number) => {
                const zIndex = maxIngredients - index;
                const right = INGREDIENT_OFFSET * index;
                const opacity =
                  orderInfo.remains && maxIngredients === index + 1
                    ? '0.5'
                    : '1';
                const remainsText =
                  maxIngredients === index + 1 && orderInfo.remains > 0
                    ? `+${orderInfo.remains}`
                    : null;

                return (
                  <li
                    className={styles.img_wrap}
                    style={{ zIndex: zIndex, right: right }}
                    key={index}
                  >
                    <img
                      style={{ opacity }}
                      className={styles.img}
                      src={ingredient.image_mobile}
                      alt={ingredient.name}
                    />
                    {remainsText ? (
                      <span
                        className={`text text_type_digits-default ${styles.remains}`}
                      >
                        {remainsText}
                      </span>
                    ) : null}
                  </li>
                );
              }
            )}
          </ul>
          <div>
            <span
              className={`text text_type_digits-default pr-1 ${styles.order_total}`}
            >
              {orderInfo.total}
            </span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </Link>
    );
  }
);
