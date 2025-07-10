import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { CartContext } from "../../context/CartContext";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white w-full fixed px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        E-Commerce
      </Link>

      <div className="flex items-center space-x-4">
        {user && (
          <span>Hello, {user.displayName || user.email.split("@")[0]}</span>
        )}

        <Link to="/cart" className="hover:underline">
          🛒 Cart ({cartItems.length})
        </Link>

        {user?.uid === "bebMwZGPByPOhBOlkKelLRYI7BM2" && (
          <Link to="/admin/add-product" className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"> + Add Product</Link>
        )}

        {user ? (
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
