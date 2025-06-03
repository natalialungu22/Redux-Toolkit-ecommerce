import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() });
          setError('');
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        setError('Failed to fetch order: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p>Order ID: {order.id}</p>
      <p>Total: £{order.total.toFixed(2)}</p>
      <p>Status: {order.status}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} - Quantity: {item.quantity} - £
            {(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <Link to='/my-orders'>View All Orders</Link>
    </div>
  );
};

export default OrderConfirmation;
