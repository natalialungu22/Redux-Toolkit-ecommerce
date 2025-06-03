import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { loginSuccess, loginStart } from '../store/authSlice';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.displayName) {
        setShowNamePrompt(true);
      } else {
        dispatch(
          loginSuccess({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName || '',
          })
        );
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetDisplayName = async (e) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Please enter your name.');
      return;
    }

    try {
      const user = auth.currentUser;
      await updateProfile(user, { displayName });

      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: displayName,
        })
      );
      setShowNamePrompt(false);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='login'>
      <h2>Log In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!showNamePrompt ? (
        <form onSubmit={handleLogin}>
          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Enter your email'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter your password'
            />
          </div>
          <button type='submit' className='login-button'>
            Log In
          </button>
        </form>
      ) : (
        <form onSubmit={handleSetDisplayName}>
          <div className='form-group'>
            <label htmlFor='displayName'>Please set your name:</label>
            <input
              type='text'
              id='displayName'
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder='Enter your name'
            />
          </div>
          <button type='submit' className='login-button'>
            Save Name
          </button>
        </form>
      )}
      <p>
        Don't have an account? <Link to='/register'>Register</Link>
      </p>
    </div>
  );
};

export default Login;
