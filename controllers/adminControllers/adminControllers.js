const adminUserhelpers = require("../../helpers/adminHelpers/adminUserhelpers");
const adminUserHelpers = require("../../helpers/adminHelpers/adminUserhelpers");
const adminHelpers=require("../../helpers/adminHelpers/adminHelpers")
let admin
module.exports = {
  getDashboard: (req, res) => {
   let  admin=req.session.admin
   console.log(admin,"oooooooooooooooooooooooooo");
    res.render("admin/dashBoard", { layout: "adminLayout",admin });
  },

  getLogin: (req, res) => {
   let  admin=req.session.admin
    res.render("admin/login", { layout: "adminLayout",admin });
  },

  postLogin: (req, res) => {
    let data = req.body;
    console.log(data);
    adminHelpers.doLogin(data).then((loginAction) => {
      let admin=req.session.admin=loginAction
      console.log(admin);
      res.send(loginAction);
    });
  },

  logout: (req,res) =>{
    req.session.admin=null
    res.redirect("/login");
  },
    
  getstatusproductList: (req,res) => {
    let admin=req.session.admin
    adminUserHelpers.getUser().then((user)=>{
      res.render("admin/viewUserlist",{ layout: "adminLayout" ,user,admin})
    })
   
  },

    getBlockuser  :(req,res)=>{
    let userId = req.params.id
    console.log(userId,'ppp');
    adminUserHelpers.blockUser(userId).then((response)=>{
      res.redirect("admin/viewUserlist")
    })
  },

  getUnblockuser  :(req,res)=>{
    let userId = req.params.id
    console.log(userId,'ppp');
    adminUserHelpers.unblockUser(userId).then((response)=>{
      res.redirect("admin/viewUserlist")
    })
  },


  getCategory: async (req,res) =>{
    data=req.body
    let admin=req.session.admin
    let Categories =await adminUserHelpers.getCategory()
   // console.log(Categories);
    res.render("admin/addCategory", { layout: "adminLayout",Categories,admin})
  },

  postCategory: (req,res) =>{
    //console.log(req.body);
      adminUserHelpers.addCategory(req.body).then((response)=>{
        res.redirect("/admin/category")
      })
  },

  getEditcategory: async (req,res)  =>{
    //console.log(req.params.id,"+++++++++++++++++++++");
    let admin=req.session.admin
    editCategory=await adminUserHelpers.getEditcategory(req.params.id)
    res.render('admin/editCategory',{layout:"adminLayout",editCategory,admin})
  },

  postEditcategory: async (req,res) =>{
   // console.log(req.body,"89");
   // console.log(req.params.id);
let data=req.body
await adminUserHelpers.postEditcategory1(data,req.params.id).then(()=>{
  
  res.redirect('/admin/viewProduct')
})

  },

    getAddproduct: (req,res) =>{
      let admin=req.session.admin
      adminUserHelpers.getAddproductcategory().then((response)=>{
        res.render("admin/addProducts", { layout: "adminLayout" , response,admin})
      })
},
   postAddproduct: (req,res) =>{
    let file = req.files
   
    const fileName = file.map((file) => {
        return file.filename
    })
    const product = req.body
    product.img = fileName
    console.log( product.img,'file');

    //console.log(data);
    adminUserHelpers.addProduct(product).then((response)=>{
  res.redirect('/admin/dashboard')

      
    })
   },

   getViewproduct:async (req,res)=>{
    data=req.body
    let admin=req.session.admin

       let viewProduct=await adminUserHelpers.viewProductlist()
      res.render("admin/viewProducts",{layout:"adminLayout",viewProduct,admin})
    },

    editProduct: async (req,res)=>{
      console.log(req.params.id);
      let admin=req.session.admin
    let  editCategory = await adminUserhelpers.viewAddcategory()
    let editProduct = await adminUserHelpers.editViewproduct(req.params.id)

    
      res.render("admin/editProduct",{layout:"adminLayout",editCategory,editProduct,admin})

    },

    postEditproduct: async (req,res)=>{
      console.log(req.body,'++++++++++++');
      //let data= req.params.id
      await adminUserHelpers.postEditproduct(req.params.id,req.body)

    },

    unlistProduct: async (req,res)=>{
       await adminUserHelpers.unlist(req.params.id).then((response)=>{
        res.send(response)
    })
      // })
    },
    unlistCategory : async (req,res) =>{
      console.log(req.params.id);
      let data=req.params.id
      await adminUserHelpers.unlistCategory(req.params.id).then((response)=>{
        res.redirect("/admin/dashboard")

      })
        
      },


   
    }
  

   
      
    
    

    

