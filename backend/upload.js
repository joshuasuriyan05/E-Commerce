import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary with env vars or hardcoded keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmlecwazt',
  api_key: process.env.CLOUDINARY_API_KEY || '796492881197272',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'F6jRfvm8PG7H59DNt37oBtaVvpc',
});

(async function () {
  try {
    // Use absolute path of the local file
    const localImagePath = path.resolve('./shoes.jpg'); // replace with your file path

    const uploadResult = await cloudinary.uploader.upload(localImagePath, {
      public_id: 'shoes-local',
      folder: 'ecommerce-products', // optional folder in Cloudinary
    });

    console.log('✅ Uploaded Image URL:', uploadResult.secure_url);
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
})();
