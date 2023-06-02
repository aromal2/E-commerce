const { response } = require("express");
const userHelpers = require("../../helpers/userHelpers/userHelpers");
const { cart } = require("../../schema/models");
const adminUserhelpers = require("../../helpers/adminHelpers/adminUserhelpers");

var failStatus =null
let user, count;
module.exports = {
  //ejs file edukka
  getHomePage: async (req, res) => {
    if (req.session.user) {
      let user=req.session.user
     let  userId = req.session.user._id;
      // let userId = req.session.user
      let count = await userHelpers.countCart(userId.toString());
      res.render("user/homepage", { layout: "Layout", user, count });
    } else {
      user = req.session.user;

      res.render("user/homepage", { layout: "Layout", user });
    }
  },

  // ,

  getLoginpage: (req, res) => {
    user = req.session.user;
    let count=0
    res.render("user/login", { layout: "Layout", user ,count});
  },
  getSignuppage: (req, res) => {
    let count=0
    res.render("user/signup", { layout: "Layout", user,count });
  },
  postSignuppage: (req, res) => {
    let data = req.body;
    userHelpers.psignupPage(data).then((response) => {
      if (response.finded) {
        res.json(false);
      } else {
        res.json(true);
      }
    });
  },
  postLoginpage: (req, res) => {
    let data = req.body;

    userHelpers.ploginpage(data).then((response) => {
      console.log(response,"54321");
      req.session.user = response.user;
      req.session.userLoggedIn = true;
      user = req.session.user;
      error =response.error

      let lstatus=response.lstatus
      
      if (lstatus == true) {

        res.redirect("/");
      } else {
        
        console.log(lstatus,"7890");
        res.render("user/login" ,{ layout:"Layout", user: null ,failStatus:lstatus});
        failStatus=null
      }
    });
  },

  logout: (req, res) => {
    req.session.user = null;
    req.session.userLoggedIn = false;
    res.redirect("/login");
  },

  otpLogin: (req, res) => {

   
    res.render("user/otpLogin", { layout: "Layout"});
    req.session.otpLoginError = false
  },

  sendOtp: (req, res) => {
   let  phone = Number(req.body.phoneno);
    console.log(phone);
    userHelpers.findUser(phone).then((user) => {
      if (user) {
        req.session.user = user;
        req.session.userLoggedIn = true;
        
        res.json(true);
      } else {
        req.session.user = null;
        req.session.otpLoginError = "phoneno does not exist";
        res.json(false);
      }
    });
  },

  getShop: async (req, res) => {
    console.log(req.query.i);
    let i = req.query.i;
    let perPage = 6;
    let docCount = await userHelpers.documentCount();
    console.log(docCount, "doc");
    let pages = Math.ceil(docCount / perPage);
    console.log(pages, "111111");
    // let shop = await userHelpers.getShop();
   let  userId = req.session.user
   
    let count = await userHelpers.countCart(userId._id);
   let  user = req.session.user;
    let shop = await userHelpers.pageview(perPage, i)
    let layout = 'Layout'

    res.render("user/shop", { layout, shop, user, count, pages });
  },


  getSingleproduct: async (req, res) => {
    console.log(req.params);
    let product = await userHelpers.viewSingleproduct(req.params.id);

    let  userId = req.session.user
    user = req.session.user;
    let count= await userHelpers.countCart(userId._id);
    res.render("user/singleProductview", { layout: "Layout", product, user,count });
  },

  addtoCart: async (req, res) => {
    let userId = req.session.user;

    userHelpers.addtoCart(req.params.id, userId._id).then((response) => {
      res.json(response);
    });
  },

  viewCart: async (req, res) => {
   let user = req.session.user;
    let userId = req.session.user;
    let userID = userId._id;

    let userIdd = userID.toString();

    let count = await userHelpers.countCart(userId._id);
console.log(count,"456789");
    let totalAmount = await userHelpers.totalAmount(userId._id.toString());

    userHelpers.listCart(userId._id.toString()).then((cartItems) => {
      let total = totalAmount[0]?.total;

      res.render("user/cart", {
        layout: "Layout",
        cartItems,
        count,
        total,
        userIdd,
        user
      });
    });
  },

  changeQuantity: async (req, res) => {
    const { user, cart, product, count, quantity } = req.body;

    let update = await userHelpers.changeproductQuantity(
      count,
      quantity,
      cart,
      product
    );
    let totalAmount = await userHelpers.totalAmount(user);
    let total = totalAmount[0]?.total;

    if (update.delete) {
      res.json(false);
    } else {
      await userHelpers.getProDetails(cart, product).then((result) => {
        console.log(result);
        result.total = total;

        res.json(result);
      });
    }
  },

  deleteProductcart: async (req, res) => {
    userHelpers.deleteProductcart(req.body.cartedId, req.body.product);
    res.send(true);
  },

  getAddress: async (req, res) => {
    let user=req.session.user
    
    
   let userId = req.session.user._id;
   
  let count= await userHelpers.countCart(userId.toString())
    let address = await userHelpers.viewAddress(userId.toString())
    let orderList = await userHelpers.getOrderlist(userId.toString())
     
    res.render("user/accountPage", { layout: "Layout", address, orderList ,user,count});
  },

  postAddress: async (req, res) => {
    let address = req.session.user;
    let addressId = address._id.toString();
    await userHelpers.addAddress(req.body, addressId).then((response) => {
      console.log(response);
      res.send(response)
    });
  },

  geteditAddress: async (req, res) => {
    let addressId = req.params.id;
let user=req.session.user
    let userId = req.session.user._id;
    let count = await userHelpers.countCart(userId.toString());


    let address = await userHelpers.geteditAddress(
      addressId,
      userId.toString(),user
    );

    res.render("user/editAddress", { layout: "Layout", address ,user,count});
  },

  posteditAddress: async (req, res) => {
    let addressId = req.body;
    console.log(addressId,"ytrews");

    let userId = req.session.user;
    await userHelpers
      .posteditAddress(userId._id.toString(), req.body.addressId, req.body)
      .then((response) => {
        res.redirect("/accountPage");
      });
  },

  getCheckoutpage: async (req, res) => {
    let userId = req.session.user;
let user=req.session.user
    let walletAmount;

    let count = await userHelpers.countCart(userId._id.toString());

    let cart = await userHelpers.listCart(userId._id.toString());

    let totalAmount = await userHelpers.totalAmount(userId._id.toString());

    let total = totalAmount[0]?.total;

    let viewAddress = await userHelpers.viewAddress(userId._id.toString());

    let getWallet = await userHelpers.checkWallet(userId._id.toString());

    console.log(getWallet, "9898");

    if (getWallet >= total) {
      walletAmount = true;
    } else {
      walletAmount = false;
    }

    res.render("user/checkoutPage", {
      layout: "Layout",
      count,
      cart,
      total,
      viewAddress,
      walletAmount,
      user
    });
  },

  postCheckoutpage: async (req, res) => {
    console.log(req.body, "bodyyyyyyyyyyyyy");
    const { address, "payment-method": paymentMethod, total, _id } = req.body;

    let userId = req.session.user;
    userHelpers
      .postCheckoutpage(userId._id.toString(), address, paymentMethod, total)
      .then((orderId) => {
        console.log(orderId, "orderId");
        if (paymentMethod === "COD") {
          res.json({ codstatus: true });
        } else if (paymentMethod === "razorpay") {
          userHelpers
            .generateRazorpay(userId._id.toString(), total)
            .then((response) => {
              res.json(response);
            });
        } else {
          res.json({ codstatus: true });
          userHelpers.reduceWallet(userId._id.toString(), total);
        }


      });
  },

  orderSuccess: (req, res) => {
    
    let user=req.session.user
    let count = 0;
    console.log(user,'/////');
    res.render("user/orderSuccess", { layout: "Layout", user, count});
  },

  postVerifypayment: (req, res) => {
    console.log(req.body);
    let userId = req.session.user._id;
    console.log(userId.toString(), "123");

    userHelpers.verifyPayment(req.body).then(() => {
      let orderId = req.body["order[receipt]"];
      userHelpers
        .changePaymentstatus(userId.toString(), orderId)
        .then(() => {
          res.send({ status: true });
        })
        .catch((err) => {
          res.send({ status: false, err });
        });
    });
  },

  getorderDetails: async (req, res) => {

console.log(req.params.id);
    let users = req.session.user._id;
let user=req.session.user
    let orderId = req.params.id;
    console.log(orderId,"oooooooooooooooooo");
    let getAddress = await userHelpers.getAddress(users, orderId);
    let count = await userHelpers.countCart(users);

    userHelpers.getsingleOrderlist(user, orderId).then((viewsOrderdetails) => {
      let products = viewsOrderdetails[0].item.productsDetails;
      let data = userHelpers.createData(viewsOrderdetails[0].item);
      console.log(data);

      res.render("user/singleOrder", {
        layout: "Layout",
        viewsOrderdetails,
        getAddress,
        data,
        products,
        users,
        user,count
      });
    });
  },

  getOrdercancel: async (req, res) => {
    userHelpers
      .orderCancel(req.body.common, req.body.order)
      .then((response) => {
        res.send(response);
      });
  },

  returnOrder: async (req, res) => {
    console.log(req.body);
    userHelpers
      .returnOrder(req.body.common, req.body.order)
      .then(async (response) => {
        res.send(response);

        await adminUserhelpers.addtoWallet(req.body.order);
      });
  },

  validateCoupon: async (req, res) => {
    let couponCode = req.params.id;
    let user = req.session.user;

    userHelpers
      .validateCoupon(couponCode, user._id.toString())
      .then((response) => {
        res.json(response);
      });
  },

  applyCoupon: async (req, res) => {
    let code = req.query.code;
    console.log(code, "123qwer");
    let total = await userHelpers.totalAmount(req.session.user._id);
    userHelpers.applyCoupon(code, total).then((response) => {
      console.log(response, "-------------------");
      let couponPrice = response.discountAmount ? response.discountAmount : 0;
      res.json(response);
    });
  },

  sort: async (req, res) => {
    console.log("--------------------------");
    console.log(req.params);
    const { id } = req.params;

    userHelpers.sorting(id).then((products) => {
      res.send(products);
    });
  },

  sortCategory: async (req, res) => {
    console.log(req.params.id, "234567sdfgh");
    userHelpers.sortCategory(req.params.id).then((category) => {
      console.log(category, "6543gvc");
      res.send(category);
    });
  },

  search: async (req, res) => {
    //console.log(req.body.query,"234567890");
    userHelpers.search(req.body.query).then((searchResult) => {
      res.send(searchResult);
    });
  },

  // getWallet : async (req,res)=>{
  //   userHelpers.checkWallet()

  // }
};
