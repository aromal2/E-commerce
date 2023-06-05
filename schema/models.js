const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneno: {
    type: Number,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  coupon: Array,
});

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },

  description: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: Array,
  },
  category: {
    type: String,
    ref: "Category",
    required: true,
  },

  offerPrice: {
    type: Number,
    default: function () {
      return this.Price - (this.Price * this.offerPercentage) / 100;
    },
  },

  offerPercentage: {
    type: Number,
    default: 0,
  },

  unlist: {
    type: Boolean,
    default: false,
  },
  slug: String,
});

const categorySchema = mongoose.Schema({
  CategoryName: {
    type: String,
  },
  subCategory: {
    type: Array,
  },
  unlist: {
    type: Boolean,
    default: false,
  },
  categoryOfferpercentage: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      Quantity: { type: Number, default: 1 },
      price: { type: Number },
    },
  ],
});

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  address: [
    {
      fname: { type: String },
      lname: { type: String },
      email: { type: String },
      mobile: { type: Number },
      street: { type: String },
      apartment: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: Number },
    },
  ],
});

const orderschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  orders: [
    {
      fname: String,
      lname: String,
      mobile: Number,
      paymentMethod: String,
      paymentStatus: String,
      totalPrice: Number,
      totalQuantity: Number,
      productsDetails: Array,
      shippingAddress: Object,
      status: {
        type: Boolean,
        default: true,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
      orderStatus: {
        type: String,
        default: "ordered",
      },
    },
  ],
});

const couponSchema = new mongoose.Schema({
  couponName: String,
  expiry: {
    type: Date,
    default: new Date(),
  },
  minPurchase: Number,
  discountPercentage: Number,
  maxDiscountValue: Number,
  description: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  wishlistItems: [
    {
      productId: String,
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  user: mongoose.model("user", userschema),
  admin: mongoose.model("admin", adminSchema),
  category: mongoose.model("category", categorySchema),
  product: mongoose.model("product", productSchema),
  cart: mongoose.model("cart", cartSchema),
  address: mongoose.model("address", addressSchema),
  order: mongoose.model("order", orderschema),
  coupon: mongoose.model("coupon", couponSchema),
  wishlist: mongoose.model("wishlist", wishlistSchema),
  banner: mongoose.model("Banner", bannerSchema),
};
