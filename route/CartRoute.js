const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// Helper function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route   POST /api/cart
// @desc    Add a product to the cart for a guest or logged-in user
// @access  Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += Number(quantity);
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0]?.url || "",
          price: Number(product.price) || 0,
          size,
          color,
          quantity: Number(quantity),
        });
      }

      // ✅ Safe total price calculation
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + (Number(item.price) * Number(item.quantity)),
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    }

    // Create a new cart
    const newCart = await Cart.create({
      user: userId || undefined,
      guestId: guestId || "guest_" + Date.now(),
      products: [
        {
          productId,
          name: product.name,
          image: product.images[0]?.url || "",
          price: Number(product.price) || 0,
          size,
          color,
          quantity: Number(quantity),
        },
      ],
      totalPrice: (Number(product.price) || 0) * Number(quantity),
    });

    return res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
