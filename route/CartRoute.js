const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/Authmiddleware");

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

/* =========================================================
   POST /api/cart → Add product to cart
========================================================= */
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

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
      );

      await cart.save();
      return res.status(200).json(cart);
    }

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
      totalPrice: product.price * quantity,
    });

    return res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   GET /api/cart → Get cart by userId or guestId
========================================================= */
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   PUT /api/cart → Update product quantity
========================================================= */
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = Number(quantity);
      } else {
        cart.products.splice(productIndex, 1);
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   DELETE /api/cart → Remove a product from cart
========================================================= */
router.delete("/", async (req, res) => {
  const { productId, size, color, userId, guestId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
      );

      await cart.save();
      return res.status(200).json({ message: "Product removed", cart });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//@route Get /api/cart
//@desc get ;ogged-in users or gest user casrt
//@access public

router.get("/",async(req,res)=>{
  const {userId,guestId} = req.body;
  try{
    const cart = await getCart(userId,guestId);
    if(cart){
      res.json(cart);

    }else{
      res.status(404).json({message:"Cart not found"});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server error"})
  }
})
//@route POST /api/cart/merge
//@desc mergge guest cart into user cart on login
//@access private
router.post ("/merge",protect,async(req,res)=>{
  const {guestId} = req.body
  try{
    const guestCart = await Cart.findOne({guestId});
    const userCart = await Cart.findOne({user:req.user});

    if(guestCart){
      if(guestCart.products.length === 0){
        return res.status(400).json({message:"guest cart is empty"});
      }


      if(userCart){
        //merge guest cart into user cart
        guestCart.products.forEach((guestItem)=>{
          const productIndex = userCart.products.findIndex(
            (item)=>
              item.productId.toString()=== guestItem.productId.toString() &&
            item.size === guestItem.size &&
            item.color === guestItem.color
          );
          if(productIndex > -1){
            //if the items exists in the user cart update the quanntity
            userCart.products[productIndex].quantity += guestItem.quantity;
          }else{
            //Otherwisem, add the guest item to the cart
            userCart.products.push(guestItem)
          }
        });
        userCart.totalPrice = userCart.products.reduce((acc,item)=>acc+item.price*item.quantity,
      0);
      await userCart.save();

      //Remove the guest cart after margin
      try{
        await Cart.findOneAndDelete({guestId});
      }catch(error){
        console.error("Error deleteing guest cart:",error);
      }
      res.status(200).json(guestCart);
      } else{
        //if user has no exisisting cart assisgn the guest card to user
        guestCart.user = req.user.id;
        guestCart.guestId = undefined;
        await guestCart.save();

        res.status(200).json(guestCart);
      }
    }else{
      if(userCart){
        //guest cart has already been merge , return user cart
        return res.status(200).json(userCart);

      }
      res.status(404).json({message:"guest cart not found"});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({message:"server error"})
  }
})

module.exports = router;
