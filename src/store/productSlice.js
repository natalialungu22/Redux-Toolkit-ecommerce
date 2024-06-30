import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from '../utils/apiURL';
import { STATUS } from '../utils/status';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    data: [],
    initData: [],
    status: STATUS.IDLE,
    filter: '',
  },

  reducers: {

    setProducts(state, action) {
      state.data = action.payload;
      state.initData = state.initData.length < 1 ? state.data : state.initData;
      state.status = STATUS.SUCCEEDED;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    fetchProductsFailure(state, action) {
      state.status = STATUS.FAILED;
      state.error = action.error;
    },
    updateFilter(state, action) {
      state.filter = action.payload;
      state.data = state.initData;
      state.data = state.data.filter((product) =>
        product.title.toLowerCase().startsWith(state.filter.toLowerCase())
      );
    },
  },
});

export const { setProducts, setStatus, updateFilter,fetchProductsFailure } = productSlice.actions;
export default productSlice.reducer;

export const fetchProducts = () => {
  return async function fetchProductThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await fetch(`${BASE_URL}products`);
      const data = await response.json();
      // console.log(data)
      dispatch(setProducts(data));
      dispatch(setStatus(STATUS.IDLE));
    } catch (error) {
      dispatch(setStatus(STATUS.ERROR));
    }
  };
};
