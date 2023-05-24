const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers/adminControllers");
const multer = require("../config/multer");
/* GET dashboard listing. */

router.get("/dashboard", adminController.getDashboard);

router.get("/", adminController.getLogin);

router.post("/", adminController.postLogin);

router.get("/logout", adminController.logout);

router.get("/viewUser", adminController.getstatusproductList);

router.get("/category", adminController.getCategory);
router.post("/category", adminController.postCategory);

router.get("/viewCategory", adminController.viewCategory);

//  router.get("/editCategory/:id", adminController.getEditcategory);

router.get("/categoryEdit/",adminController.categoryEdit)

router.post("/categoryEdited/",adminController.postCategoryedit)

router.post("/editCategory/:id", adminController.postEditcategory);

router.patch("/change-user-status-block/:id", adminController.getBlockuser);

router.patch("/change-user-status-unblock/:id", adminController.getUnblockuser);

router.get("/addProduct", adminController.getAddproduct);
// router.post('/addProduct',  ,adminController.postAddimage)

router.post("/addProduct", multer.uploads, adminController.postAddproduct);

router.get("/viewProduct", adminController.getViewproduct);

router.get("/editProduct", adminController.editProduct);

router.post("/editProduct/:id",multer.editeduploads, adminController.postEditproduct);

router.get("/unlistProduct/:id", adminController.unlistProduct);

router.get("/listProduct/:id", adminController.listProduct);

router.get("/unlistCategory/:id", adminController.unlistCategory);

router.get("/orderDetails", adminController.getOrderList);

router.get("/viewOneorder", adminController.viewOneorder);


router.put("/orderStatus", adminController.orderStatus);

router.get("/addCoupon", adminController.addCoupon);

router.post("/addCoupon", adminController.postCoupon);

router.post("/generateCoupon", adminController.generateCoupon);

router.get("/viewCoupon", adminController.viewCoupon);

router.delete("/deleteCoupon", adminController.deleteCoupon);

router.get("/salesReport",adminController.salesReport)

 router.post("/salesReport",adminController.postSalesreport)


module.exports = router;
