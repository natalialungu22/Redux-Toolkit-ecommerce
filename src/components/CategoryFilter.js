import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '../store/categorySlice';
import { clearFilter } from '../store/productSlice';
import './CategoryFilter.css';

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const { categories, selectedCategory } = useSelector(
    (state) => state.category
  );

  const handleCategorySelect = (categoryName) => {
    dispatch(clearFilter());
    dispatch(setSelectedCategory(categoryName));
  };

  return (
    <div className='category-filter'>
      <button
        className={!selectedCategory ? 'active' : ''}
        onClick={() => handleCategorySelect(null)}
      >
        All
      </button>
      {categories.slice(0, 5).map((category) => (
        <button
          key={category.id}
          className={selectedCategory === category.name ? 'active' : ''}
          onClick={() => handleCategorySelect(category.name)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
