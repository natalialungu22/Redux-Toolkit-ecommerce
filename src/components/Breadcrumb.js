import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '../store/categorySlice';
import { clearFilter } from '../store/productSlice';
import './Breadcrumb.css';
import { FaHome } from 'react-icons/fa';

const Breadcrumb = () => {
  const dispatch = useDispatch();
  const { selectedCategory } = useSelector((state) => state.category);

  const handleHomeClick = () => {
    dispatch(setSelectedCategory(null));
    dispatch(clearFilter());
  };

  return (
    <nav className='breadcrumb'>
      <Link to='/' onClick={handleHomeClick} className='breadcrumb-item'>
        <span className='home-icon'>
          <FaHome />
        </span>{' '}
        Home
      </Link>
      <span className='breadcrumb-separator'> &gt; </span>
      <Link to='/' onClick={handleHomeClick} className='breadcrumb-item'>
        Category
      </Link>
      {selectedCategory && (
        <>
          <span className='breadcrumb-separator'> &gt; </span>
          <span className='breadcrumb-item'>{selectedCategory}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;
