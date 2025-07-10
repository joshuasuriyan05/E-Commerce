import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const AdminAddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
  });
  const [admin, setAdmin] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid === "bebMwZGPByPOhBOlkKelLRYI7BM2") {
        setAdmin(true);
      } else {
        setAdmin(false);
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("brand", formData.brand);
    data.append("image", imageFile); // 'image' must match multer field name

    try {
      const res = await axios.post("https://e-commerce-1-h1h0.onrender.com/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Product added successfully!");
      setFormData({ name: "", price: "", category: "", brand: "" });
      setImageFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setSuccess("Failed to add product.");
    }
  };

  return (
    <div className="max-w-md mx-auto pt-24 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full border p-2 rounded" required/>
        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price (INR)" className="w-full border p-2 rounded" required/>
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g. Electronics, Books)" className="w-full border p-2 rounded" required/>
        <input name="brand" value={formData.brand}onChange={handleChange}placeholder="Brand (e.g. Samsung, Apple)" className="w-full border p-2 rounded" required/>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" required/>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Add Product</button>
      </form>
      {success && (
        <p className="mt-4 text-center text-green-600 font-medium">{success}</p>
      )}
    </div>
  );
};

export default AdminAddProduct;
