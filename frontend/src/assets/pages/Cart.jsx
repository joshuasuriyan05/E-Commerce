import axios from 'axios';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const Cart = ({product}) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useContext(CartContext);

  const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.price), 0);
  const localBackendUrl = `https://e-commerce-1-h1h0.onrender.com/api/payment`;

  const handleBuyNow = async () => {
    if (totalPrice > 500000) {
      alert("Amount exceeds Razorpay’s ₹5,00,000 limit. Please remove some items.");
      return;
    }
    try {
      const { data } = await axios.post(`${localBackendUrl}/orders`, {
        amount: totalPrice,
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
            amount: totalPrice,
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded shadow">
              <div className="flex items-center gap-4">
                <img src={`https://e-commerce-1-h1h0.onrender.com/uploads/${item.image}`} alt={item.name} className="w-20 h-20 object-contain rounded border"/>
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="text-red-600 hover:text-red-800 font-semibold">Remove</button>
            </div>
          ))}

          <div className="text-right mt-6">
            <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
            <button onClick={handleBuyNow} disabled={cartItems.length === 0} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
