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

router.post('/logout',userController.logout)


router.get('/shop',userController.getShop)





module.exports = router;
