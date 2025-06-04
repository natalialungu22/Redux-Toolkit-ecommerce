import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { fetchProducts } from '../store/productSlice';
import { fetchCategories, setSelectedCategory } from '../store/categorySlice';
import Breadcrumb from '../components/Breadcrumb';

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { categoryName } = useParams();
  const {
    data: products,
    status,
    filter,
  } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(setSelectedCategory(decodeURIComponent(categoryName)));
  }, [dispatch, categoryName]);

  const decodedCategoryName = decodeURIComponent(categoryName);

  const categoryProducts = products.filter(
    (product) =>
      product.category &&
      product.category.name.toLowerCase() === decodedCategoryName.toLowerCase()
  );

  const filteredProducts = filter
    ? categoryProducts.filter((product) =>
        product.title.toLowerCase().includes(filter.toLowerCase())
      )
    : categoryProducts;

  return (
    <div>
      <Breadcrumb />
      <h1 style={{ textTransform: 'capitalize' }}>{decodedCategoryName}</h1>
      <ProductList
        products={filteredProducts}
        status={status}
        filter={filter}
      />
    </div>
  );
};

export default CategoryPage;
