import { useElements, CardElement, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import './PaymentForm.css';

const PaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }
    try {
      const response = await axios.post(
        `${
          process.env.REACT_APP_API_BASE_URL || 'http://localhost:4243'
        }/create-payment-intent`,
        {
          amount: Math.round(amount * 100),
          currency: 'gbp',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Origin: 'http://localhost:3000',
          },
        }
      );

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent);
        setProcessing(false);
      }
    } catch (err) {
      setError('Payment failed: ' + err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='payment-form'>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      {error && <p className='error-message'>{error}</p>}
      <button
        type='submit'
        disabled={!stripe || processing}
        className='payment-button'
      >
        {processing ? 'Processing...' : `Pay £${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;
