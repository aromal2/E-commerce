const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers/adminControllers");
const multer = require("../config/multer");
const middleware = require('../middleware/Middleware')
/* GET dashboard listing. */

router.get("/dashboard",middleware.auth, adminController.getDashboard);

router.get("/", adminController.getLogin);

router.post("/", adminController.postLogin);

router.get("/logout", adminController.logout);

router.get("/viewUser",middleware.auth, adminController.getstatusproductList);

router.get("/category",middleware.auth,  adminController.getCategory);

router.post("/category", adminController.postCategory);

router.get("/viewCategory",middleware.auth, adminController.viewCategory);

router.get("/categoryEdit/",middleware.auth,adminController.categoryEdit)



router.post("/editCategory/:id", adminController.postEditcategory);

router.patch("/change-user-status-block/:id", adminController.getBlockuser);

router.patch("/change-user-status-unblock/:id", adminController.getUnblockuser);

router.get("/addProduct",middleware.auth, adminController.getAddproduct);

router.post("/addProduct", multer.uploads, adminController.postAddproduct);

router.get("/viewProduct",middleware.auth, adminController.getViewproduct);

router.get("/editProduct",middleware.auth, adminController.editProduct);

router.post("/editProduct/:id",multer.editeduploads, adminController.postEditproduct);

router.get("/unlistProduct/:id",middleware.auth, adminController.unlistProduct);

router.get("/listProduct/:id",middleware.auth, adminController.listProduct);

router.get("/unlistCategory/:id",middleware.auth, adminController.unlistCategory);

router.get("/listCategory/:id",middleware.auth, adminController.listCategory);

router.get("/addBanner", middleware.auth,adminController.getAddBanner)

router.post("/addBanner",multer.addBannerupload, adminController.postAddBanner)

router.get("/viewBanner",middleware.auth, adminController.viewBanner)

router.get("/editBanner",middleware.auth, adminController.editBanner)

router.post("/editBanner",multer.editBannerupload, adminController.editpostBanner)





router.get("/orderDetails",middleware.auth, adminController.getOrderList);

router.get("/viewOneorder",middleware.auth, adminController.viewOneorder);

router.put("/orderStatus", adminController.orderStatus);

router.get("/addCoupon",middleware.auth, adminController.addCoupon);

router.post("/addCoupon", adminController.postCoupon);

router.post("/generateCoupon", adminController.generateCoupon);

router.get("/viewCoupon",middleware.auth, adminController.viewCoupon);

router.delete("/deleteCoupon", adminController.deleteCoupon);

router.get("/salesReport",middleware.auth,adminController.salesReport)

router.post("/salesReport",adminController.postSalesreport)


module.exports = router;
