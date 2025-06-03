import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { clearCart } from '../store/cartSlice';
import OrderSummary from '../components/OrderSummary';
import PaymentForm from '../components/PaymentForm';
import './Checkout.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ''
);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCost = subtotal > 50 ? 0 : 5;
  const total = parseFloat(subtotal) + deliveryCost;

  const handlePaymentSuccess = async (paymentIntent) => {
    if (!cartItems.length) {
      setError('Your cart is empty. Add items to place an order.');
      return;
    }
    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || '',
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        deliveryCost,
        total: parseFloat(total.toFixed(2)),
        createdAt: serverTimestamp(),
        status: 'pending',
        paymentIntentId: paymentIntent.id,
      };
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      setOrderPlaced(true);
      dispatch(clearCart());
      setError('');
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (err) {
      setError('Failed to place order: ' + err.message);
    }
  };

  if (!user || !user.emailVerified) {
    navigate('/login');
    return null;
  }

  return (
    <div className='checkout'>
      <h2>Checkout</h2>
      {orderPlaced ? (
        <div className='order-confirmation'>
          <h3>Order Placed Successfully!</h3>
          <p>
            Your order ID is: <strong>{orderId}</strong>
          </p>
          <p>Thank you for your purchase.</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <div className='checkout-container'>
          <div className='order-details'>
            <h3>Order Details</h3>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className='checkout-item'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='checkout-image'
                  />
                  <div className='checkout-item-details'>
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          <div className='order-summary-container'>
            <OrderSummary
              items={cartItems}
              subtotal={subtotal.toFixed(2)}
              deliveryCost={deliveryCost.toFixed(2)}
              total={total.toFixed(2)}
              error={error}
              headerText='Order Summary'
            />
            <h3>Payment</h3>
            <Elements stripe={stripePromise}>
              <PaymentForm amount={total} onSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
