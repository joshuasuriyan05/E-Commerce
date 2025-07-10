import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  currency: String,
  status: { type: String, default: "pending" },
});

export default mongoose.model("Order", orderSchema);
