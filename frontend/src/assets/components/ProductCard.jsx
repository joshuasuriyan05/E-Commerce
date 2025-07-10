import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import { auth } from '../config/firebase';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useContext(CartContext);
  const [isAdmin, setIsAdmin] = useState(false);

  const inCart = cartItems.some(item => item._id === product._id);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(user?.uid === 'bebMwZGPByPOhBOlkKelLRYI7BM2'); // Replace with actual admin UID
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = () => {
    if (!inCart) addToCart(product);
  };

  const localBackendUrl = `https://e-commerce-1-h1h0.onrender.com/api/payment`;

  const handleBuyNow = async () => {
    if (product.price > 500000) {
      alert("Amount exceeds Razorpay’s ₹5,00,000 limit. Please choose a cheaper product.");
      return;
    }

    try {
      const { data } = await axios.post(`${localBackendUrl}/orders`, {
        amount: product.price,
      });

      initPayment(data);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      alert(`Order creation failed: ${msg}`);
      console.error("Order creation failed:", msg);
    }
  };

  const initPayment = (orderData) => {
    const options = {
      key: 'rzp_test_tw3hgGRGCLRkSC',
      amount: orderData.data.amount,
      currency: orderData.data.currency,
      description: 'Test E-Commerce Payment',
      order_id: orderData.data.id,
      handler: async function (response) {
        try {
          const verifyRes = await axios.post(`${localBackendUrl}/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: product.price,
          });

          alert("Payment successful and verified!");
          console.log("Verification response:", verifyRes.data);
        } catch (err) {
          alert("Payment succeeded but verification failed.");
          console.error("Verification error:", err.response?.data || err.message);
        }
      },
      theme: {
        color: '#3399cc',
      },
    };

    const razorpay_popup = new window.Razorpay(options);
    razorpay_popup.open();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-2 hover:shadow-xl transition-shadow relative ml-2">
      <img src={`https://e-commerce-1-h1h0.onrender.com/uploads/${product.image}`} alt={product.name} className="w-full h-48 object-contain rounded"/>
      <div className="mt-4">
        <h3 className="text-lg font-semibold capitalize">{product.name}</h3>
        <p className="text-gray-600">₹{product.price}</p>

        <button onClick={handleBuyNow} className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Buy Now</button>

        <button onClick={handleAddToCart} className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">+ Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
