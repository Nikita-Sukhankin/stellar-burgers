import { ProfileUI } from '@ui-pages';
import {
  FC,
  SyntheticEvent,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUser, getAuthError } from '../../services/selectors';
import {
  updateUser,
  logoutUser,
  clearError
} from '../../services/slices/auth-slice';

interface FormValue {
  name: string;
  email: string;
  password: string;
}

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const error = useSelector(getAuthError);

  const [formValue, setFormValue] = useState<FormValue>({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      !!formValue.password,
    [formValue, user]
  );

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(clearError());
      const updateData: { name: string; email: string; password?: string } = {
        name: formValue.name,
        email: formValue.email
      };
      if (formValue.password) {
        updateData.password = formValue.password;
      }
      dispatch(updateUser(updateData));
    },
    [dispatch, formValue]
  );

  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
      });
    },
    [user]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }));
    },
    []
  );

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error || ''}
    />
  );
};
