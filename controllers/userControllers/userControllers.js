const userHelpers = require("../../helpers/userHelpers/userHelpers");

let user;
module.exports = {
  //ejs file edukka
  getHomePage: (req, res) => {
    if (req.session.user) {
      user = req.session.user;
       res.render("user/homepage", {layout:"Layout", user });
    } else {
      user = req.session.user;

      res.render("user/homepage", {layout:"Layout", user });
    }
  },

  // ,

  getLoginpage: (req, res) => {
    user = req.session.user;
    res.render("user/login", { layout:"Layout",user });
  },
  getSignuppage: (req, res) => {
    res.render("user/signup", { layout:"Layout",user });
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
      req.session.user = response.user;
      user = req.session.user;

      if (response.lstatus == true) {
        res.redirect("/");
      } else {
        //user=false
        res.render("user/login", { layout:"Layout",user: null });
      }
    });
  },

  logout: (req, res) => {
    req.session.user = null;
    res.redirect("/login");
  },

  getShop: async (req, res) => {
    let shop = await userHelpers.getShop();
     user = req.session.user;

    res.render("user/shop", { layout: "Layout", shop, user });
  },
  getSingleproduct: async (req, res) => {
      let product = await userHelpers.viewSingleproduct(req.params.id);
     user=req.session.user
     // console.log(product, "+++++++++++++++++++++++++++++++");
    res.render("user/singleProductview",{layout:"Layout",product,user});
  },

  addtoCart:async (req,res)=>{
      console.log(req.params.id,"_________________________________");
    //console.log(req.session.user.id);
    let userId=req.session.user
    console.log(userId._id,"user");
    userHelpers.addtoCart(req.params.id,userId._id)
    .then((response)=>{
      //console.log(response,"9999999999999999999999999999999999999");
      res.json(response)
    
    })
    },
     
    viewCart: async (req,res)=>{

      let userId = req.session.user
  
       let count = await userHelpers.countCart(userId._id)
        
       
       let totalAmount =await userHelpers.totalAmount((userId._id).toString())
      // console.log(totalAmount,'totalamao');
      //console.log(totalAmount,"yuuuuuu");
       userHelpers.listCart((userId._id).toString()).then((cartItems)=>{
        let total=totalAmount[0].total

        res.render("user/cart",{layout:"Layout",cartItems,count,total})

      })
    },

    getAddress: async (req,res) =>{
     //console.log(req.body,"rrrrrrrrrrrrrrrrrrrrrrrrrrrrr"); 

      res.render("user/accountPage",{layout:"Layout"})
    },

    postAddress: async (req,res) =>{
      console.log(req.body,"rrrrrrrrrrrrrrrrrrrrrrrrrrrrr"); 
 

     },


};
