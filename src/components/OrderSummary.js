import React from 'react';
import './OrderSummary.css';

const OrderSummary = ({
  items,
  subtotal,
  deliveryCost,
  total,
  buttonText,
  onButtonClick,
  error,
  className,
  showItemCount = true,
  headerText = 'Order Summary'
}) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className={`order-summary-component ${className || ''}`}>
      <h3>{headerText}</h3>
      <hr />
      <div className='summary-item'>
        <h4>
          {showItemCount ? (
            <>
              Subtotal ({totalQuantity} item{totalQuantity !== 1 ? 's' : ''})
            </>
          ) : (
            'Subtotal'
          )}
        </h4>
        <span>£{subtotal}</span>
      </div>
      <div className='summary-item'>
        <h4>Delivery cost:</h4>
        <span>£{typeof deliveryCost === 'number' ? deliveryCost.toFixed(2) : deliveryCost}</span>
      </div>
      <div className='summary-item'>
        <h4>Total{deliveryCost ? ' (including delivery)' : ''}:</h4>
        <span>£{total}</span>
      </div>
      {error && <p className="error-message">{error}</p>}
      {buttonText && onButtonClick && (
        <button onClick={onButtonClick} className='summary-button'>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default OrderSummary;