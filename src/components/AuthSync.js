import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginSuccess, logout } from '../store/authSlice';

const AuthSync = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          loginSuccess({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthSync;
