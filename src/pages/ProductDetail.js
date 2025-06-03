import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProducts, fetchProductById } from '../store/productSlice';
import Loader from '../components/Loader';
import { addToCart, updateQuantity } from '../store/cartSlice';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: products,
    currentProduct,
    status,
  } = useSelector((state) => state.product);
  const cartItems = useSelector((state) => state.cart.items);

  const product = currentProduct || products.find((p) => p.id === id);
  const cartItem = cartItems.find((item) => item.id === id);
  const [localQuantity, setLocalQuantity] = useState(
    cartItem ? cartItem.quantity : 1
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    } else if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, id, products.length]);

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, localQuantity + change);
    setLocalQuantity(newQuantity);
    if (cartItem) {
      dispatch(updateQuantity({ id: id, quantity: newQuantity }));
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.images[0],
          quantity: localQuantity,
        })
      );
      navigate('/cart');
    }
  };

  if (status === 'loading') return <Loader />;
  if (status === 'failed') return <p>Error loading product.</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className='product-detail'>
      <div className='product-image-container'>
        <img src={product.images[0]} alt={product.title} />
      </div>
      <div className='product-info'>
        <h2>{product.title}</h2>
        <p>
          <b>Price: £{product.price.toFixed(2)}</b>
        </p>
        <p>
          <b>Category:</b> {product.category.name}
        </p>
        <p>
          <b>Description:</b>
          {product.description}
        </p>
        <div className='product-buttons'>
          <p className='quantity'>
            <b>Quantity: {localQuantity}</b>
          </p>
          <div className='quantity-control'>
            <button
              className='change-quantity'
              onClick={() => handleQuantityChange(-1)}
            >
              <span>-</span>
            </button>
            <span className='quantity'>{localQuantity}</span>
            <button
              className='change-quantity'
              onClick={() => handleQuantityChange(1)}
            >
              <span>+</span>
            </button>
          </div>
          <button className='add-to-cart' onClick={() => handleAddToCart()}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
