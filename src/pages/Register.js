import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../firebase';
import { registerSuccess } from '../store/authSlice';
import './Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character (e.g., !@#$%^&*).';
    }
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Please enter your name.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName });
      await sendEmailVerification(user);

      dispatch(
        registerSuccess({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: displayName,
        })
      );

      navigate('/verify-email');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='register'>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div className='form-group'>
          <label htmlFor='displayName'>Name:</label>
          <input
            type='text'
            id='displayName'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder='Enter your name'
          />
        </div>
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
        <button type='submit' className='register-button'>
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to='/login'>Log in</Link>
      </p>
    </div>
  );
};

export default Register;
