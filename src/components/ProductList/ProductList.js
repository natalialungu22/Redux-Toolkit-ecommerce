import React from 'react';
import { STATUS } from '../../utils/status';
import './ProductList.scss';
import { setModalData, setIsModalVisible } from '../../store/modalSlice';
import SingleProduct from '../SingleProduct/SingleProduct';
import { useSelector, useDispatch } from 'react-redux';
import { formatPrice } from '../../utils/helpers';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';

const ProductList = ({ products, status }) => {
  const dispatch = useDispatch();
  const { isModalVisible } = useSelector((state) => state.modal);

  const viewModalHandler = (data) => {
    dispatch(setModalData(data));
    dispatch(setIsModalVisible(true));
  };

  if (status === STATUS.ERROR) return <Error />;
  if (status === STATUS.LOADING) return <Loader />;

  return (
    <section className='product py-5 bg-ghost-white' id='products'>
      {isModalVisible && <SingleProduct />}

      <div className='container'>
        <div className='product-content'>
          <div className='section-title'>
            <h3 className='text-uppercase fw-7 text-regal-blue ls-1'>
              Our Products
            </h3>
          </div>
          <div className='product-items grid'>
            {products.slice(0, 20).map((product) => (
              <div
                className='product-item bg-white'
                key={product.id}
                onClick={() => viewModalHandler(product)}
              >
                <div className='product-item-img'>
                  <img src={product.images[0]} alt='' />
                  <div className='product-item-cat text-white fs-13 text-uppercase bg-gold fw-6'>
                    {product.category.name}
                  </div>
                </div>
                <div className='product-item-body'>
                  <h6 className='product-item-title text-pine-green fw-4 fs-15'>
                    {product.title}
                  </h6>
                  <div className='product-item-price text-regal-blue fw-7 fs-18'>
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
