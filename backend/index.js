import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto";
import productRoutes from "./routes/productRoutes.js";
import Order from "./models/Order.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).send("App is Running");
});

//Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
app.post("/api/payment/orders", async (req, res) => {
  try {
    const amount = req.body.amount;
    if (!amount || amount > 500000) {
      return res
        .status(400)
        .json({ message: "Amount exceeds Razorpay limits" });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ data: order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).send("Internal Server Error.");
  }
});

//Verify Razorpay Payment
app.post("/api/payment/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    //Save to DataBase
    const newOrder = new Order({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: req.body.amount,
      currency: "INR",
      status: "paid",
    });

    await newOrder.save();
    res.status(200).json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
});

app.use("/api/products", productRoutes);

mongoose
  .connect("mongodb+srv://joshua:Jo09sh01ua2005$@cluster0.pyyjjnq.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);
