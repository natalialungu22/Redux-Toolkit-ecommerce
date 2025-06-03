import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateFilter, clearFilter } from '../store/productSlice';
import { setSelectedCategory } from '../store/categorySlice';
import { logoutUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  RiShoppingCart2Line,
  RiMenu3Line,
  RiSearchLine,
  RiFileList2Line,
  RiLogoutBoxRLine,
} from 'react-icons/ri';
import CategoryFilter from './CategoryFilter';

import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.product.filter);
  const products = useSelector((state) => state.product.data);
  const allProducts = useSelector((state) => state.product.initData);

  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(filter || '');
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
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
      dispatch(updateFilter(searchTerm));

      setTimeout(() => {
        const filteredProducts = products;
        if (filteredProducts.length > 0) {
          const matchingProduct = allProducts.find((product) =>
            product.title.toLowerCase().includes(searchTerm)
          );
          const selectedCat = matchingProduct
            ? matchingProduct.category.name
            : filteredProducts[0].category.name;
          dispatch(setSelectedCategory(selectedCat));
        } else {
          dispatch(setSelectedCategory(null));
        }
      }, 0);

      setSearchInput('');
      setSearchExpanded(false);
      navigate('/');
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchExpanded &&
        !event.target.closest('.search-expanded') &&
        !event.target.closest('.search-icon')
      ) {
        setSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchExpanded]);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className='navbar'>
        <button className='menu-toggle d-mobile-only' onClick={toggleMenu}>
          <RiMenu3Line />
        </button>

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

        <div className={`nav-group ${menuOpen ? 'active' : ''}`}>
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

        <div className={`mobile-categories ${menuOpen ? 'active' : ''}`}>
          <CategoryFilter />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
