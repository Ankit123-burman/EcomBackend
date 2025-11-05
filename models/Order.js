const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",       // Refers to Product collection
    required: true
  },
  name: {
    type: String,
    required: true         // Product name
  },
  image: {
    type: String,
    required: true         // URL of the product image
  },
  price: {
    type: Number,
    required: true         // Price of the product
  },
  size: {
    type: String,          // Optional (e.g., S, M, L, XL for clothing)
    default: null
  },
  color: {
    type: String,          // Optional (e.g., Red, Blue, Black)
    default: null
  },
  quantity: {
    type: Number,
    required: true,        // Quantity in the order
    min: 1
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User who placed the order
      required: true,
    },
    orderItems: {
      type: [orderItemSchema], // Array of order items
      required: true,
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true, // e.g., 'Credit Card', 'PayPal', 'UPI'
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
    //   enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  {
    timestamps: true, // Auto-created createdAt & updatedAt
  }
);


module.exports = mongoose.model("OrderItem", orderItemSchema);
