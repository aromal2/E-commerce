const adminUserhelpers = require("../../helpers/adminHelpers/adminUserhelpers");
const adminUserHelpers = require("../../helpers/adminHelpers/adminUserhelpers");
const adminHelpers = require("../../helpers/adminHelpers/adminHelpers");
// const userHelpers = require("../../helpers/userHelpers/userHelpers");

let admin;

module.exports = {
  getDashboard: async (req, res) => {
    let admins = req.session.admin;
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

    console.log(paymentCount,"oooopppppppp");

    let orderByCategory = await adminUserHelpers.getOrderByCategory();

    let Men = 0,
      Women = 0,
      Unisex = 0;
    orderByCategory.forEach((Products) => {
      if (Products.category == "MEN") Men++;

      if (Products.category == "women") Women++;
      console.log(Women,"567890");
      if (Products.category == "UNISEX") Unisex++;
    });
    let category = [];
    category.push(Men);
    category.push(Women);
    category.push(Unisex);


    console.log(category,"34567890");

    await adminUserHelpers.getAllOrders().then((response) => {
      var totalOrders = response.length;

      let total = 0;

      for (let i = 0; i < totalOrders; i++) {
        total += response[i].orders.totalPrice;
      }
      res.render("admin/dashboard", {
        layout: "adminLayout",
        admins,
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
    let admin = req.session.admin;
    res.render("admin/login", { layout: "adminLayout", admin });
  },

  postLogin: (req, res) => {
    let data = req.body;
    console.log(data, "4321");
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
    console.log(req.body);

    adminUserHelpers.addCategory(req.body).then((response) => {
      res.redirect("/admin/category");
    });
  },

  viewCategory: async (req, res) => {
    let Categories = await adminUserHelpers.getCategory();

    res.render("admin/viewCategory", { layout: "adminLayout", Categories });
  },

  categoryEdit: async (req, res) => {
    console.log(req.query.id, "23456789");
    adminUserHelpers.getCategoryedit(req.query.id).then((response) => {
      console.log(response, "234567");
      res.render("admin/editCategory", { layout: "adminLayout", response });
    });
  },

  postCategoryedit: async (req, res) => {
    console.log(req.query);

    adminUserHelpers.postCategoryedit();
  },

  postEditcategory: async (req, res) => {
    console.log(req.body);
    adminUserHelpers.updateCategory(req.params.id, req.body);
    adminUserHelpers.categoryOffer(req.params.id, req.body);
    res.send(true);
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
  },

  getViewproduct: async (req, res) => {
    data = req.body;
    console.log(req.query.i);
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
  console.log(req.query);
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
     console.log(req.body,"bodyyyyyyyyyyy");
     console.log(files,'--------------------------');
    console.log(req.params.id,"paramsjjjjj");
    let image = []
    let previousImages = await adminUserHelpers.getPreviousImages(id)
    console.log(previousImages);
    
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
    let data = req.params.id;
    await adminUserHelpers.unlistCategory(req.params.id).then((response) => {
      res.redirect("/admin/dashboard");
    });
  },



  getOrderList: async (req, res) => {
    let userId = req.session.user;

    await adminUserHelpers.getOrders().then((orders) => {
      res.render("admin/orderList", { layout: "adminLayout", orders });
    });
  },

  viewOneorder: async (req, res) => {
    await adminUserHelpers
      .viewOneorderdetail(req.query.userid, req.query.orderid)
      .then((order) => {
        res.render("admin/viewOneorderdetail", {
          layout: "adminLayout",
          order,
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
    res.render("admin/addCoupon", { layout: "adminLayout" });
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

    adminUserHelpers.postCoupon(couponData).then((order) => {});
  },

  generateCoupon: async (req, res) => {
    adminUserHelpers.generateCoupon().then((response) => {
      
      res.json(response);
    });
  },

  viewCoupon: (req, res) => {
    adminUserHelpers.postViewcoupon().then((coupons) => {
      

      res.render("admin/viewCoupon", { layout: "adminLayout", coupons });
    });
  },

  deleteCoupon: (req, res) => {
    console.log(req.body);

    adminUserHelpers.deleteCoupon(req.body.coupon).then((response) => {
      console.log(response);
      res.send(response);
    });
  },

  salesReport: async (req, res) => {
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
    console.log(orders, "567890432qqqqq");

    res.render("admin/salesReport", { layout: "adminLayout", orders, getDate });
  },

  postSalesreport: async (req, res) => {
    console.log(req.body, "body");
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
      console.log(orderData, "23456789");

      res.render("admin/salesReport1", { layout: "adminLayout", orderData });
    });
  },
};
