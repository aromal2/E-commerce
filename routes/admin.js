const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers/adminControllers');
const multer=require("../config/multer")
/* GET dashboard listing. */

router.get('/dashboard',adminController.getDashboard)

router.get('/login',adminController.getLogin)

router.post('/login',adminController.postLogin)

router.get('/logout',adminController.logout)

router.get('/viewUser',adminController.getstatusproductList)



router.get('/category',adminController.getCategory)
router.post('/category',adminController.postCategory)
router.get('/editCategory/:id',adminController.getEditcategory)
router.post('/editCategory/:id',adminController.postEditcategory)

router.patch('/change-user-status-block/:id',adminController.getBlockuser)

router.patch('/change-user-status-unblock/:id',adminController.getUnblockuser)

router.get('/addProduct',adminController.getAddproduct)
// router.post('/addProduct',  ,adminController.postAddimage)

router.post('/addProduct',multer.uploads,adminController.postAddproduct)

router.get('/viewProduct',adminController.getViewproduct)

router.get('/editProduct/:id',adminController.editProduct)

router.post('/editProduct/:id',adminController.postEditproduct)

router.get('/unlistProduct/:id',adminController.unlistProduct)

router.get('/unlistCategory/:id',adminController.unlistCategory)










module.exports = router;
