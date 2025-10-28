import { FC } from 'react';
import styles from './modal-overlay.module.css';
import { TModalOverlayProps } from './type';

export const ModalOverlayUI: FC<TModalOverlayProps> = ({ onClick }) => (
  <div
    className={styles.overlay}
    onClick={onClick}
    data-testid='modal-overlay'
  />
);
