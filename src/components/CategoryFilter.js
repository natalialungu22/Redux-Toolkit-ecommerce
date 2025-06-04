import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CategoryFilter.css';

const CategoryFilter = () => {
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.category);

  const handleCategorySelect = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <h2>CATEGORIES</h2>
      <div className='category-filter'>
        {categories.slice(0, 5).map((category) => (
          <div key={category.id}>
            <img
              src={category.image}
              alt={category.name}
              className='category-image'
              onClick={() => handleCategorySelect(category.name)}
            />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryFilter;
