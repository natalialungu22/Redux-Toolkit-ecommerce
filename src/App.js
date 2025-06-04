import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import AuthSync from './components/AuthSync';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import ProductReviews from './pages/ProductReviews';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  return (
    <Router>
      <AuthSync>
        <div className='App'>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/category/:categoryName' element={<CategoryPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/verify-email' element={<VerifyEmail />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/order-detail/:orderId' element={<OrderDetail />} />
            <Route
              path='/product-reviews/:productName'
              element={<ProductReviews />}
            />
            <Route
              path='/order-confirmation/:orderId'
              element={<OrderConfirmation />}
            />
          </Routes>
        </div>
      </AuthSync>
    </Router>
  );
}

export default App;
