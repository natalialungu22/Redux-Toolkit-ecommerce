import React from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import './ProductList.css';

const ProductList = ({ products, status, filter }) => {
  if (status === 'loading') return <Loader />;
  if (status === 'failed') return <p>Error loading products.</p>;

  return (
    <>
      <h2>PRODUCTS</h2>
      <div className='product-grid'>
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className='product-card'
              state={{ filter }} // Pass the current filter
            >
              <img
                src={product.images[0]}
                alt={product.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80';
                }}
              />
              <h3>{product.title}</h3>
              <p>£{product.price}</p>
              <p>{product.category.name}</p>
            </Link>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </>
  );
};

export default ProductList;
