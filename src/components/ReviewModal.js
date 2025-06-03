import React from 'react';
import './ReviewModal.css';

const ReviewModal = ({
  selectedItem,
  reviewError,
  reviewData,
  handleReviewSubmit,
  handleReviewChange,
  handleRatingChange,
  closeReviewModal,
}) => {
  return (
    <div className='review-modal-overlay'>
      <div className='review-modal'>
        <h3>Review {selectedItem?.name}</h3>
        {reviewError && <p className='error'>{reviewError}</p>}
        <form onSubmit={handleReviewSubmit}>
          <div className='rating'>
            <label>Rating:</label>
            <div className='stars'>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    reviewData.rating >= star ? 'filled' : ''
                  }`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className='comment'>
            <label>Comment:</label>
            <textarea
              name='comment'
              value={reviewData.comment}
              onChange={handleReviewChange}
              placeholder='Write your review here...'
              required
            />
          </div>
          <div className='modal-actions'>
            <button type='submit' className='submit-button'>
              Submit Review
            </button>
            <button
              type='button'
              className='cancel-button'
              onClick={closeReviewModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
