import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './assets/pages/Navbar';
import Cart from './assets/pages/Cart';
import Home from './assets/pages/Home';
import Login from './assets/pages/Login';
import Signup from './assets/pages/Signup';
import AdminAddProduct from './assets/pages/AdminAddProduct';
import CategoryDropdown from './assets/components/CategoryDown';
import BrandFilter from './assets/components/BrandFilter';

import { CartProvider } from './context/CartContext';
import './index.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={
              <div className="flex">
                <div className="w-64 p-4 border-r border-gray-200 hidden md:block">
                </div>
                <div className="flex-1 p-4">
                  <Home />
                </div>
              </div>
            }/>
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/add-product" element={<AdminAddProduct />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
