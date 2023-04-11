const adminUserhelpers = require("../../helpers/adminHelpers/adminUserhelpers");
const adminUserHelpers = require("../../helpers/adminHelpers/adminUserhelpers");

module.exports = {
  getDashboard: (req, res) => {
    res.render("admin/dashBoard", { layout: "adminLayout" });
  },

  getLogin: (req, res) => {
    res.render("admin/login", { layout: "adminLayout" });
  },

  postLogin: (req, res) => {
    let data = req.body;
    //console.log(data);
    adminHelpers.doLogin(data).then((loginAction) => {
      res.send(loginAction);
    });
  },

  
  
  
  getstatusproductList: (req,res) => {
    adminUserHelpers.getUser().then((user)=>{
      res.render("admin/viewUserlist",{ layout: "adminLayout" ,user})
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
    let Categories =await adminUserHelpers.getCategory()
   // console.log(Categories);
    res.render("admin/addCategory", { layout: "adminLayout",Categories})
  },

  postCategory: (req,res) =>{
    //console.log(req.body);
      
      adminUserHelpers.addCategory(req.body).then((response)=>{
        res.redirect("/admin/category")
      })
  },

  getEditcategory: async (req,res)  =>{
    //console.log(req.params.id,"+++++++++++++++++++++");
    editCategory=await adminUserHelpers.getEditcategory(req.params.id)
    res.render('admin/editCategory',{layout:"adminLayout",editCategory})
  },

  postEditcategory: async (req,res) =>{
   // console.log(req.body,"89");
   // console.log(req.params.id);
let data=req.body
await adminUserHelpers.postEditcategory1(data,req.params.id)

  },

    getAddproduct: (req,res) =>{
      adminUserHelpers.getAddproductcategory().then((response)=>{
        res.render("admin/addProducts", { layout: "adminLayout" , response})
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

       let viewProduct=await adminUserHelpers.viewProductlist()
      res.render("admin/viewProducts",{layout:"adminLayout",viewProduct})
    },

    editProduct: async (req,res)=>{
      console.log(req.params.id);
    let  editCategory = await adminUserhelpers.viewAddcategory()
    let editProduct = await adminUserHelpers.editViewproduct(req.params.id)

    
      res.render("admin/editProduct",{layout:"adminLayout",editCategory,editProduct})

    },

    postEditproduct: async (req,res)=>{
      console.log(req.body,'++++++++++++');
      //let data= req.params.id
      await adminUserHelpers.postEditproduct(req.params.id,req.body)
    },

    
};
