const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers/userControllers');
//const userControllers = require('../controllers/userControllers');

/* GET home page. */
router.get('/',userController.getHomePage)

router.get('/login',userController.getLoginpage)

router.post('/login',userController.postLoginpage)

router.post('/logout',userController.logout)

router.get('/signup',userController.getSignuppage)

router.post('/signup',userController.postSignuppage)

router.get('/logout',userController.logout)


router.get('/shop',userController.getShop)

 router.get('/singleproductView/:id',userController.getSingleproduct)

// router.post('/singleproductView:id',userController.postSingleproduct)

router.post('/cart/:id',userController.addtoCart)

router.get("/viewCart",userController.viewCart)

router.get("/address",userController.getAddress)

router.post("/address",userController.postAddress)







module.exports = router;
