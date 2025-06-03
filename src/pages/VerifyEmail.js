import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { logoutUser } from '../store/authSlice';

const VerifyEmail = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        dispatch(logoutUser());
        navigate('/login');
        return;
      }

      const checkVerification = async () => {
        try {
          await currentUser.reload();
          if (currentUser.emailVerified) {
            navigate('/checkout');
          } else {
            setMessage('Please verify your email to continue.');
          }
        } catch (err) {
          setError('Failed to check verification status: ' + err.message);
        }
      };
      checkVerification();
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleResendEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage('Verification email resent. Please check your inbox.');
      } catch (err) {
        setError('Failed to resend email: ' + err.message);
      }
    } else {
      setError('No user is currently signed in.');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className='verify-email'>
      <h2>Verify Your Email</h2>
      {user && (
        <p>
          A verification email has been sent to <strong>{user.email}</strong>.
          Please verify your email to continue.
        </p>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleResendEmail} disabled={!auth.currentUser}>
        Resend Verification Email
      </button>
      <button
        onClick={() => window.location.reload()}
        disabled={!auth.currentUser}
      >
        I’ve Verified My Email
      </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default VerifyEmail;
