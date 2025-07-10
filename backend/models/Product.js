// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  brand: String,
  image: String,
});

const Product = mongoose.model("Product", productSchema);
export default Product; // This is important for ES Modules
