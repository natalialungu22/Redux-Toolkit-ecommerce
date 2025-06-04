import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ProductList from '../components/ProductList';
import CategoryFilter from '../components/CategoryFilter';
import { fetchProducts, updateFilter } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';
import Breadcrumb from '../components/Breadcrumb';
import bannerImage from '../assets/banner.png';

import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    data: products,
    status,
    filter,
  } = useSelector((state) => state.product);
  const { selectedCategory } = useSelector((state) => state.category);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.filter && filter !== location.state.filter) {
      dispatch(updateFilter(location.state.filter));
    } else if (!location.state?.filter && products.length > 0 && filter) {
      dispatch(updateFilter(filter));
    }
  }, [location.state, filter, products.length, dispatch]);

  const filteredProducts = !filter
    ? selectedCategory
      ? products.filter((product) => product.category.name === selectedCategory)
      : products
    : products;

  return (
    <div>
      {selectedCategory && <Breadcrumb />}

      <div className='banner-container'>
        <img src={bannerImage} alt='Banner' className='banner-image' />
      </div>
      <CategoryFilter />
      <ProductList
        products={filteredProducts}
        status={status}
        filter={filter}
      />
    </div>
  );
};

export default HomePage;
