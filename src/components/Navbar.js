import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateFilter, clearFilter } from '../store/productSlice';
import { setSelectedCategory } from '../store/categorySlice';
import { logoutUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  RiShoppingCart2Line,
  RiSearchLine,
  RiFileList2Line,
  RiLogoutBoxRLine,
} from 'react-icons/ri';

import './Navbar.css';

export const SearchContext = React.createContext();

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filter = useSelector((state) => state.product.filter);
  const allProducts = useSelector((state) => state.product.initData);
  const cartItems = useSelector((state) => state.cart.items);
  const [searchInput, setSearchInput] = useState(filter || '');
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setSearchInput(filter || '');
  }, [filter]);

  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = searchInput.trim().toLowerCase();
    if (searchTerm) {
      const matchingProducts = allProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );

      if (matchingProducts.length > 0) {
        const selectedCat = matchingProducts[0].category.name;
        dispatch(updateFilter(searchTerm));
        dispatch(setSelectedCategory(selectedCat));
        navigate(`/category/${selectedCat.toLowerCase()}`);
      } else {
        dispatch(setSelectedCategory(null));
        navigate('/');
      }
      setSearchInput('');
      setSearchExpanded(false);
    }
  };

  const handleHomeClick = () => {
    dispatch(setSelectedCategory(null));
    dispatch(clearFilter());
    navigate('/');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (isMobile) {
      document.body.classList.toggle('search-expanded-active', !searchExpanded);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchExpanded &&
        !event.target.closest('.search-expanded') &&
        !event.target.closest('.search-icon')
      ) {
        setSearchExpanded(false);
        if (isMobile) {
          document.body.classList.remove('search-expanded-active');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchExpanded, isMobile]);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar-brand' onClick={handleHomeClick}>
        RetailNest
      </Link>

      <button className='search-icon' onClick={toggleSearch}>
        <RiSearchLine />
      </button>

      {user && (
        <Link to='/my-orders' className='nav-link' title='My Orders'>
          <RiFileList2Line size={24} />
        </Link>
      )}

      <Link to='/cart' className='cart-link nav-link'>
        <RiShoppingCart2Line size={24} />
        <span className='cart-quantity'>
          {totalQuantity > 0 ? totalQuantity : ''}
        </span>
      </Link>

      {isAuthenticated && isMobile && (
        <button
          onClick={handleLogout}
          className='logout-button mobile-top-right'
        >
          <RiLogoutBoxRLine size={24} />
        </button>
      )}

      {searchExpanded && (
        <form onSubmit={handleSearch} className='search-expanded'>
          <input
            type='text'
            name='searchInput'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Search products...'
            autoFocus
          />
          <button type='submit'>Search</button>
        </form>
      )}

      <div className='nav-group'>
        {isAuthenticated && !isMobile ? (
          <button onClick={handleLogout} className='logout-button'>
            Logout
          </button>
        ) : !isAuthenticated ? (
          <Link to='/login' className='nav-link'>
            Login
          </Link>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
