import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import OrderSummary from './OrderSummary';
import './ShoppingBag.css';

const ShoppingBag = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCost = subtotal > 50 ? 0 : 5;
  const deliveryPrice = cartItems < 1 ? 0 : deliveryCost;
  const total = (parseFloat(subtotal) + deliveryPrice).toFixed(2);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  const handleQuantityChange = (itemId, quantity) => {
    dispatch(updateQuantity({ id: itemId, quantity }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!user.emailVerrified) {
      navigate('/verify-email');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <div className='shopping-bag'>
        <h2>Shopping Bag</h2>
        <div className='bag-container'>
          <div className='product-list'>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className='product-item'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='product-image'
                  />
                  <div className='product-details'>
                    <div className='bag-product-info'>
                      <h3>{item.name}</h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className='remove-button'
                      >
                        Remove
                      </button>
                    </div>
                    <h3>
                      <b>£{item.price.toFixed(2)}</b>
                    </h3>
                    <div className='quantity-control'>
                      <p>Quantity</p>
                      <input
                        type='number'
                        min='1'
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                        className='quantity-input'
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Your bag is empty.</p>
            )}
            <button
              onClick={handleClearCart}
              className={
                cartItems.length === 0 ? 'hidden' : 'clear-cart-button'
              }
            >
              Clear Cart
            </button>
          </div>

          {cartItems.length > 0 && (
            <OrderSummary
              items={cartItems}
              subtotal={subtotal.toFixed(2)}
              deliveryCost={deliveryPrice.toFixed(2)}
              total={total}
              buttonText='Secure checkout'
              onButtonClick={handleCheckout}
              headerText='Order summary'
              className='order-summary-container'
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingBag;
