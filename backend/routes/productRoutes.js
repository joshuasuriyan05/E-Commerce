import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import path from "path";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// POST - Add Product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, brand } = req.body;
    const image = req.file?.filename;

    const newProduct = new Product({ name, price, category, brand, image });
    await newProduct.save();

    res.status(201).json({ message: "Product added" });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// GET - All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
