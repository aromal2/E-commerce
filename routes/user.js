const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers/userControllers");
//const userControllers = require('../controllers/userControllers');
const middleware = require("../middleware/Middleware");

/* GET home page. */
router.get("/", userController.getHomePage);

router.get("/login", userController.getLoginpage);

router.post("/login", userController.postLoginpage);

router.post("/logout", userController.logout);

router.get("/signup", userController.getSignuppage);

router.post("/signup", userController.postSignuppage);

router.get("/logout", userController.logout);

router.get("/shop", middleware.userauth, userController.getShop);

router.get("/singleproductView/:id", userController.getSingleproduct);

router.post("/cart/:id", userController.addtoCart);

router.get("/viewCart", middleware.userauth, userController.viewCart);

router.put("/changeQuantity", middleware.userauth, userController.changeQuantity);

router.delete("/deleteProduct", middleware.userauth, userController.deleteProductcart);

router.get("/accountPage",  middleware.userauth,userController.getAddress);

router.post("/accountPage", middleware.userauth,userController.postAddress);

router.get("/editAddress/:id",middleware.userauth,userController.geteditAddress);

router.post("/editAddress", userController.posteditAddress);

router.get("/checkoutPage", middleware.userauth,userController.getCheckoutpage);

router.post("/checkoutPage", userController.postCheckoutpage);

router.get("/orderSuccess",middleware.userauth,userController.orderSuccess)

router.get("/orderDetails/:id", middleware.userauth, userController.getorderDetails);

 router.post("/getOrdercancel",  userController.getOrdercancel);
 
 router.post("/returnOrder",userController.returnOrder)

router.get("/otp", userController.otpLogin);

router.post("/send-otp", userController.sendOtp);

router.get("/validateCoupon/:id", middleware.userauth,userController.validateCoupon)

router.get("/applyCoupon", middleware.userauth,userController.applyCoupon)

router.post("/verifyPayment",userController.postVerifypayment)

router.get("/sort/:id", middleware.userauth,userController.sort)

router.get("/sortCategory/:id", middleware.userauth,userController.sortCategory)

router.post("/search",userController.search)





module.exports = router;
