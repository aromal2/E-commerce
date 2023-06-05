const adminUserhelpers = require("../../helpers/adminHelpers/adminUserhelpers");
const adminUserHelpers = require("../../helpers/adminHelpers/adminUserhelpers");
const adminHelpers = require("../../helpers/adminHelpers/adminHelpers");
// const userHelpers = require("../../helpers/userHelpers/userHelpers");

let admin;

module.exports = {
  getDashboard: async (req, res) => {
    let admin = req.session.admin
    let totalProducts,
      days = [];
    let ordersPerDay = {};
    let paymentCount = [];

    let Products = await adminUserHelpers.getAllProducts();
    totalProducts = Products.length;

    await adminUserHelpers.getOrderByDate().then((response) => {
      let result = response;

      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].orders.length; j++) {
          let ans = {};
          ans["createdAt"] = result[i].orders[j].createdAt;
          days.push(ans);
        }
      }

      days.forEach((order) => {
        let day = order.createdAt.toLocaleDateString("en-US", {
          weekday: "long",
        });
        ordersPerDay[day] = (ordersPerDay[day] || 0) + 1;
      });
    });

    let getCodCount = await adminUserHelpers.getCodCount();

    let codCount = getCodCount.length;

    let getOnlineCount = await adminUserHelpers.getOnlineCount();
    let onlineCount = getOnlineCount.length;

    let getWalletCount = await adminUserHelpers.getWalletCount();
    let WalletCount = getWalletCount.length;

    paymentCount.push(onlineCount);
    paymentCount.push(codCount);
    paymentCount.push(WalletCount);

  

    let orderByCategory = await adminUserHelpers.getOrderByCategory();

    let Men = 0,
      Women = 0,
      Unisex = 0;

    orderByCategory.forEach((Products) => {
    
      if (Products.category == "MEN") Men++;

      if (Products.category == "WOMEN") Women++;
      
      if (Products.category == "UNISEX") Unisex++;
    });
    let category = [];
    category.push(Men);
    category.push(Women);
    category.push(Unisex);


    

    await adminUserHelpers.getAllOrders().then((response) => {
      var totalOrders = response.length;

      let total = 0;

      for (let i = 0; i < totalOrders; i++) {
        total += response[i].orders.totalPrice;
      }
      res.render("admin/dashboard", {
        layout: "adminLayout",
        admin,
        total,
        totalProducts,
        totalOrders,
        ordersPerDay,
        paymentCount,
        category,
      });
    });
  },

  getLogin: (req, res) => {
    let admin = req.session.admin
    res.render("admin/login", { layout: "adminLayout", admin });
  },

  postLogin: (req, res) => {
    let data = req.body;

    
    adminHelpers.doLogin(data).then((loginAction) => {
      let admin = (req.session.admin = loginAction);

      res.send(loginAction);
    });
  },

  logout: (req, res) => {
    req.session.admin = null;
    res.redirect("/admin/");
  },

  getstatusproductList: (req, res) => {
    let admin = req.session.admin;
    adminUserHelpers.getUser().then((user) => {
      res.render("admin/viewUserlist", { layout: "adminLayout", user, admin });
    });
  },

  getBlockuser: (req, res) => {
    let userId = req.params.id;

    adminUserHelpers.blockUser(userId).then((response) => {
      res.redirect("admin/viewUserlist");
    });
  },

  getUnblockuser: (req, res) => {
    let userId = req.params.id;

    adminUserHelpers.unblockUser(userId).then((response) => {
      res.redirect("admin/viewUserlist");
    });
  },

  getCategory: async (req, res) => {
    data = req.body;
    let admin = req.session.admin;
    // let Categories =await adminUserHelpers.getCategory()

    res.render("admin/addCategory", { layout: "adminLayout", admin });
  },

  postCategory: (req, res) => {
    

    adminUserHelpers.addCategory(req.body).then((response) => {
      res.redirect("/admin/category");
    });
  },

  viewCategory: async (req, res) => {
    let admin = req.session.admin;
    let Categories = await adminUserHelpers.getCategory();
    
    res.render("admin/viewCategory", { layout: "adminLayout", Categories ,admin});
  },

  categoryEdit: async (req, res) => {
    let admin = req.session.admin;

    adminUserHelpers.getCategoryedit(req.query.id).then((response) => {
      
      res.render("admin/editCategory", { layout: "adminLayout", response ,admin});
    });
  },


  postEditcategory: async (req, res) => {
    console.log(req.body,"----------------------");

    await adminUserHelpers.updateCategory(req.params.id, req.body).then((result)=>{
      res.send(result)
    })
   

  },

  getAddproduct: (req, res) => {
    let admin = req.session.admin;

    adminUserHelpers.getAddproductcategory().then((response) => {
      res.render("admin/addProducts", {
        layout: "adminLayout",
        response,
        admin,
      });
    });
  },
  postAddproduct: (req, res) => {
    let file = req.files;

    const fileName = file.map((file) => {
      return file.filename;
    });
let product = req.body;
product.img = fileName;


    adminUserHelpers.addProduct(product).then((response) => {
      res.redirect("/admin/dashboard");
    });
  }
,

  getViewproduct: async (req, res) => {
    data = req.body;

    let i=req.query.i
    let perPage=6
    let docCount=await adminUserHelpers.documentCount()
let pages=Math.ceil(docCount/perPage)
    let admin = req.session.admin;


    

    let viewProduct = await adminUserHelpers.viewProductlist(i,perPage);

    res.render("admin/viewProducts", {
      layout: "adminLayout",
      viewProduct,
      admin,
      pages
    });
  },

  editProduct: async (req, res) => {
  
  
    let admin = req.session.admin;
    let editCategory = await adminUserhelpers.viewAddcategory();
     let editProduct = await adminUserHelpers.editViewproduct(req.query.id);

    res.render("admin/editProduct", {
      layout: "adminLayout",
      editCategory,
      editProduct,
      admin,
    });
  },

  postEditproduct: async (req, res) => {
    
     let id= req.params.id
     let files=req.files
  
    

    let image = []
    let previousImages = await adminUserHelpers.getPreviousImages(id)
    
    
    if (req.files.image1) {
      image.push(req.files.image1[0].filename)
  } else {
      image.push(previousImages[0])
  }

  if (req.files.image2) {
      image.push(req.files.image2[0].filename)
  } else {
      image.push(previousImages[1])
  }
  if (req.files.image3) {
      image.push(req.files.image3[0].filename)
  } else {
      image.push(previousImages[2])
  }
  if (req.files.image4) {
      image.push(req.files.image4[0].filename)
  } else {
      image.push(previousImages[3])
  }

  adminUserHelpers.postEditproduct(id,req.body,image).then((result)=>{
    res.redirect("/admin/dashboard")
  })

    
  },

  listProduct: async (req, res) => {
    await adminUserHelpers.list(req.params.id).then((response) => {
      res.send(response);
    });
    // })
  },

  unlistProduct: async (req, res) => {
    await adminUserHelpers.unlist(req.params.id).then((response) => {
      res.send(response);
    });
  },
    // })
    unlistCategory: async (req, res) => {
      try {
      
        let data = req.params.id;
        await adminUserHelpers.unlistCategory(data).then(async(result)=>{
          await adminUserHelpers.unlistShop(data).then((resp)=>{
            
            res.redirect("/admin/viewCategory");
          })
        })
       
      } catch (error) {
        // Handle the error
        console.error(error);
        res.redirect("/admin/viewCategory");
      }
    },
    

    listCategory: async (req, res) => {
      try {
        let data = req.params.id;
        await adminUserHelpers.listCategory(data).then(async(result)=>{
          await adminUserHelpers.listShop(data).then((resp)=>{
            
            res.redirect("/admin/viewCategory");
          })
        })
       
      } catch (error) {
        // Handle the error
        console.error(error);
        // Redirect to an error page or display an error message
        res.redirect("/error");
      }
    },

    getAddBanner: (req, res) => {
      let admins = req.session.admin;
  
      res.render("admin/addBanner", { layout: "adminLayout", admins });
    },

    postAddBanner: (req, res) => {
    
      adminUserHelpers.addBanner(req.body, req.file.filename).then((response) => {
        if (response) {
          res.redirect("/admin/addBanner");
        } else {
          res.status(505);
        }
      });
    },

    viewBanner:(req,res)=>{
    
        adminUserHelpers.listBanner().then((response) => {
          let admins = req.session.admin;
    
          res.render("admin/viewBanner", {
            layout: "adminLayout",
            response,
            admins,
          });
        });
      },

      editBanner:(req,res)=>{
        
       

        adminUserHelpers.editBanner(req.query.banner).then((response)=>{
          res.render("admin/editBanner",{layout:"adminLayout",response})
        })
      },

editpostBanner:(req,res)=>{
  


  adminUserHelpers.editpostBanner(req.query.editbanner,req.body,req.file.filename).then((response)=>{
    res.redirect("/admin/dashboard")
  }
)},


  getOrderList: async (req, res) => {
    let userId = req.session.admin;
    let i=req.query.id
let perPage=10
let docCount=await adminUserHelpers.documentCount()
let pages=Math.ceil(docCount/perPage)

    await adminUserHelpers.getOrders(i,perPage).then((orders) => {

      res.render("admin/orderList", { layout: "adminLayout", orders,pages ,userId});
    });
  },

  viewOneorder: async (req, res) => {
    let admin = req.session.admin;
    await adminUserHelpers
      .viewOneorderdetail(req.query.userid, req.query.orderid)
      .then((order) => {
        res.render("admin/viewOneorderdetail", {
          layout: "adminLayout",
          order,
      admin
        });
      });
  },

  orderStatus: async (req, res) => {
    let orderData = req.body;
    

    await adminUserHelpers.OrderStatus(orderData).then((order) => {
      res.send(order);
    });
  },

  addCoupon: async (req, res) => {
    let admin = req.session.admin;
    

    
    res.render("admin/addCoupon", { layout: "adminLayout" ,admin});
  },

  postCoupon: async (req, res) => {
    
    let couponData = {
      couponName: req.body.couponName,
      expiry: req.body.expiry,
      minPurchase: req.body.minPurchase,
      description: req.body.description,
      discountPercentage: req.body.discountPercentage,
      maxDiscountValue: req.body.maxDiscountValue,
    };

    
    

    adminUserHelpers.postCoupon(couponData).then((order) => {

    });
  },

  generateCoupon: async (req, res) => {
    adminUserHelpers.generateCoupon().then((response) => {
      
      res.json(response);
    });
  },

  viewCoupon: (req, res) => {
    let admin = req.session.admin;
    adminUserHelpers.postViewcoupon().then((coupons) => {
      

      res.render("admin/viewCoupon", { layout: "adminLayout", coupons,admin });
    });
  },

  deleteCoupon: (req, res) => {
  
    
    adminUserHelpers.deleteCoupon(req.body.coupon).then((response) => {
      
      res.send(response);
    });
  },

  salesReport: async (req, res) => {
    let admin = req.session.admin;
    let orders = await adminUserHelpers.salesReport();
    const getDate = (date) => {
      let orderDate = new Date(date);
      let day = orderDate.getDate();
      let month = orderDate.getMonth() + 1;
      let year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${
        isNaN(year) ? "0000" : year
      }`;
    };
    

    res.render("admin/salesReport", { layout: "adminLayout", orders, getDate ,admin});
  },

  postSalesreport: async (req, res) => {
    
    let Details = [];
    const getDate = (date) => {
      let orderDate = new Date(date);
      let day = orderDate.getDate();
      let month = orderDate.getMonth() + 1;
      let year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${
        isNaN(year) ? "0000" : year
      }`;
    };

    await adminUserHelpers.postReport(req.body).then((orderData) => {
      let admin = req.session.admin;
  

      res.render("admin/salesreport1", { layout: "adminLayout", orderData,admin });
    });
  },
}
