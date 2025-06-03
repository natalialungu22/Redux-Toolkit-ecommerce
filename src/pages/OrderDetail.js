import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
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
        setError('Failed to fetch order details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!order) return <p>No order details available.</p>;

  return (
    <div className='order-detail-container'>
      <h2>Order Details </h2>
      <div className='order-detail'>
        <p>Order placed {order.createdAt?.toDate().toLocaleDateString()}</p>
        <p> Order No.{order.id}</p>
      </div>

      <ul className='order-items'>
        {order.items.map((item, index) => (
          <li key={index} className='order-info'>
            <div className='item-content'>
              {item.image ? (
                <img src={item.image} alt={item.name} className='item-image' />
              ) : (
                <div className='no-image'>No Image</div>
              )}
              <div className='item-details'>
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button className='back-button' onClick={() => navigate('/my-orders')}>
        Back to My Orders
      </button>
    </div>
  );
};

export default OrderDetail;
