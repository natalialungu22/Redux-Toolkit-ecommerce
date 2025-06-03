import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './MyOrders.css';
import { loginSuccess } from '../store/authSlice';
import { auth } from '../firebase';
import ReviewModal from '../components/ReviewModal';

const MyOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  useEffect(() => {
    const fetchOrdersAndReviews = async () => {
      if (!user) {
        setError('Please log in to view your orders.');
        return;
      }
      setLoading(true);
      try {
        const ordersRef = collection(db, 'orders');
        const ordersQuery = query(ordersRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(ordersQuery);
        const userOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        userOrders.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
        setOrders(userOrders);

        const reviewsRef = collection(db, 'reviews');
        const reviewsQuery = query(reviewsRef, where('userId', '==', user.uid));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviewedSet = new Set();
        reviewsSnapshot.forEach((doc) => {
          const review = doc.data();
          reviewedSet.add(review.productName);
        });
        setReviewedProducts(reviewedSet);

        setError('');
      } catch (err) {
        setError('Failed to fetch orders or reviews: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndReviews();
  }, [user]);

  const openReviewModal = (item) => {
    setSelectedItem(item);
    setShowReviewModal(true);
    setReviewData({ rating: 0, comment: '' });
    setReviewError('');
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedItem(null);
    setReviewError('');
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please log in to submit a review.');
      return;
    }
    if (reviewData.rating === 0) {
      setReviewError('Please select a rating.');
      return;
    }
    if (!reviewData.comment.trim()) {
      setReviewError('Please enter a comment.');
      return;
    }
    try {
      const currentUser = auth.currentUser;
      let userDisplayName = user.displayName;
      if (!userDisplayName && currentUser) {
        userDisplayName = currentUser.displayName || 'Anonymous User';

        dispatch(
          loginSuccess({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: userDisplayName,
          })
        );
      }

      const review = {
        userId: user.uid,
        userEmail: user.email,
        userName: userDisplayName || 'Anonymous User',
        productName: selectedItem.name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'reviews'), review);
      setReviewedProducts((prev) => new Set(prev).add(selectedItem.name));
      closeReviewModal();
    } catch (err) {
      setReviewError('Failed to submit review: ' + err.message);
    }
  };

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      {loading ? (
        <p>Loading your orders...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found. Start shopping!</p>
      ) : (
        <div className='orders-list'>
          {orders.map((order) => (
            <div key={order.id} className='order-card'>
              <div className='order-placed'>
                <div className='order-row'>
                  <div className='order-column'>
                    <h5>ORDER PLACED</h5>
                    <span>
                      {order.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <div className='order-column'>
                    <h5>TOTAL</h5>
                    <span>£{order.total.toFixed(2)}</span>
                  </div>
                  <div className='order-column order-number-column'>
                    <h5 className='order-number-label'>ORDER# {order.id}</h5>
                    <Link
                      to={`/order-detail/${order.id}`}
                      className='view-details-btn'
                    >
                      View order details
                    </Link>
                  </div>
                </div>
              </div>

              <ul className='order-items'>
                {[...order.items].reverse().map((item, index) => (
                  <li key={index} className='order-item'>
                    <div className='item-content'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='item-image'
                      />
                      <div className='item-details'>
                        <span>{item.name}</span>
                      </div>
                      {reviewedProducts.has(item.name) ? (
                        <span className='reviewed-message'>
                          Already reviewed
                        </span>
                      ) : (
                        <button
                          className='review-button'
                          onClick={() => openReviewModal(item)}
                        >
                          Write a product review
                        </button>
                      )}
                      <Link
                        to={`/product-reviews/${encodeURIComponent(item.name)}`}
                        className='view-reviews-link'
                      >
                        View all reviews
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {showReviewModal && (
        <ReviewModal
          selectedItem={selectedItem}
          reviewError={reviewError}
          reviewData={reviewData}
          handleReviewSubmit={handleReviewSubmit}
          handleReviewChange={handleReviewChange}
          handleRatingChange={handleRatingChange}
          closeReviewModal={closeReviewModal}
        />
      )}
    </div>
  );
};

export default MyOrders;
