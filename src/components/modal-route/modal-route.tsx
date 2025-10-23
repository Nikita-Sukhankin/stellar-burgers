import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '../modal';

interface ModalRouteProps {
  children: React.ReactNode;
  title: string;
}

export const ModalRoute: React.FC<ModalRouteProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = useCallback(() => {
    const background = location.state?.background;
    if (background) {
      navigate(background.pathname, { replace: true });
      return;
    }
    navigate(-1);
  }, [location, navigate]);

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};
