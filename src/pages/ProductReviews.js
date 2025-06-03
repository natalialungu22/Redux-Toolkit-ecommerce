import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './ProductReviews.css';

const ProductReviews = () => {
  const { productName } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const reviewsRef = collection(db, 'reviews');
        const reviewsQuery = query(
          reviewsRef,
          where('productName', '==', productName)
        );
        const querySnapshot = await getDocs(reviewsQuery);
        const reviewsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsList);

        if (reviewsList.length > 0) {
          const totalRating = reviewsList.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const avg = totalRating / reviewsList.length;
          setAverageRating(avg.toFixed(1));
        } else {
          setAverageRating(0);
        }
        setError('');
      } catch (err) {
        setError('Failed to fetch reviews: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productName]);

  return (
    <div className='product-reviews'>
      <h2>Reviews for {productName}</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <div className='average-rating'>
            <span className='average-rating-value'>{averageRating}</span>
            <span className='average-rating-stars'>
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(averageRating) ? 'star filled' : 'star'
                  }
                >
                  ★
                </span>
              ))}
            </span>
            <span className='total-reviews'>
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          {reviews.length === 0 ? (
            <p>No reviews yet for {productName}.</p>
          ) : (
            <ul className='reviews-list'>
              {reviews.map((review) => (
                <li key={review.id} className='review-item'>
                  <div className='review-header'>
                    <span className='review-rating'>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? 'star filled' : 'star'}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                    <span className='review-date'>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className='review-comment'>{review.comment}</p>
                  <span className='review-user'>
                    By: {review.userName || 'Anonymous User'} (Anonymous)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ProductReviews;
