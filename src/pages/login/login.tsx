import {
  FC,
  SyntheticEvent,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { getAuthError, getIsAuthenticated } from '../../services/selectors';
import { loginUser, clearError } from '../../services/slices/auth-slice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(getAuthError);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const from = useMemo(() => location.state?.from?.pathname || '/', [location]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(clearError());
      dispatch(loginUser({ email, password }));
    },
    [dispatch, email, password]
  );

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
