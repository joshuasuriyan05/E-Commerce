import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });
const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    const imageUrl = req.file.path;

    if (!name || !price || !req.file) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newProduct = new Product({ name, price, image: imageUrl });
    await newProduct.save();

    res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
