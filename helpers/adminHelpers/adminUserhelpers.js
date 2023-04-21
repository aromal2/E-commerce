const dbAdmin = require("../../schema/models");
const bcrypt = require("bcrypt");


module.exports = {
  //   getUser:()=>
  //   {
  //    return new Promise(async(resolve,reject) =>{
  //    let userData=[]
  //    await dbAdmin.user.find()
  //    .exec()
  //    .then((result) =>
  //    {
  //      userData=result
  //    })
  //    //console.log(userData);
  //    resolve (userData)
  //    console.log(userData);
  //   }
  //    )
  //  }

  getUser: () => {
    try {
      return new Promise((resolve, reject) => {
        dbAdmin.user.find().then((user) => {
          //console.log(user,'kkkkkkk');
          resolve(user);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  blockUser: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        await dbAdmin.user
          .updateOne({ _id: userId }, { $set: { blocked: true } })
          .then((data) => {
            //console.log(data);
            resolve();
          });
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  unblockUser: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        await dbAdmin.user
          .updateOne({ _id: userId }, { $set: { blocked: false } })
          .then((data) => {
            resolve();
          });
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  
  
  
  addCategory: (data) => {
    let subCat = data["sub-category"];
    console.log(data);
    return new Promise(async (resolve, reject) => {
      let cat = await dbAdmin.category.findOne({ CategoryName: data.category });

      if (!cat) {
        const categoryD = new dbAdmin.category({
          CategoryName: data.category,
          subCategory: subCat,
        });
        //console.log(category);
        await categoryD.save().then((result) => {
          resolve(result);
        });
      } else {
        let categoryD = await dbAdmin.category.updateOne({
          $push: { subCategory: subCat },
        });

        resolve(true);
      }
    });
  },

  getCategory: () => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.category.find({
      
      }).then((result) => {
        //console.log(result);
        resolve(result)
      });
    });
  },

  getEditcategory:(categoryId) =>{
    return new Promise (async(resolve,reject)=>{
      await dbAdmin.category.findOne({_id:categoryId})
      .exec()
      .then((response)=>{
        resolve(response)
      })
    })

  },

  getAddproductcategory: ()=>{
    return new Promise(async(resolve,reject)=>{
      await dbAdmin.category
      .find()
      .exec()
      .then((response)=>{
        resolve(response)
      })
    })

  },



  addProduct: (data) =>{
   // console.log(data,8);
    
      return new Promise((resolve,reject)=>{
      // prod= dbAdmin.product.find({productName:data.name})
       //console.log(prod,"1");
        const productD = new  dbAdmin.product({
          productName : data.name,
          brand:data.brand,
          description:data.description,
          Price:data.price,
          quantity:data.quantity,
          category:data.category,
          image:data.img
     
         })
          productD.save().then((result)=>{
          console.log(result,';;;;;;;;;;');
          resolve(result)
          })
         })
       
      },

      viewProductlist: ()=>{
        return new Promise(async(resolve,reject)=>{
          await dbAdmin.product.find({unlist:false}).then((result)=>{
            resolve(result)
          })
        })
      },

      viewAddcategory:  ()=>{
        return new Promise(async(resolve,reject)=>{
          await dbAdmin.category.find().then((result)=>{
            resolve (result)
          })
        })
      },

      editViewproduct: (productId) => {
        return new Promise(async (resolve,reject)=>{
          await dbAdmin.product.findOne({_id:productId})
          .exec()
          .then((response)=>{
            resolve(response)
          })
          })
        },

        postEditproduct: (id,data) =>
       
        {
          console.log(data,'data')
          return new Promise(async (resolve,reject)=>{
            await dbAdmin.product.updateOne({_id:id},{$set:{  productName : data.name,
              brand:data.brand,
              description:data.description,
              Price:data.price,
              quantity:data.quantity,
              category:data.category
         }}).then((result)=>{
          console.log(result);
         })

          })
        },
        postEditcategory1: (data,categoryId) =>{
          //console.log(categoryId);
          console.log(data);
          return new Promise(async (resolve,reject)=>{
            await dbAdmin.category.updateOne({_id:categoryId},{$set:{
              CategoryName:data.Categoryname,
              subCategory:data.Subcategoryname
              

            }}).then ((result)=>{
              console.log(result);
            })
          })
          
        },

        unlist:(data)=>{
          return new Promise(async(resolve,reject)=>{
            await dbAdmin.product.updateOne({_id:data},{$set:{
              unlist:true
            }}).then((result)=>{
              console.log(result,'lll');
              resolve(result)
            })
          })
        },

        unlistCategory:(data)=>{
          return new Promise(async(resolve,reject)=>{
            await dbAdmin.category.updateOne({_id:data},{$set:{
              unlist:true
            }}).then ((result)=>{
              resolve(result)
            })
          })
        }

  }
  




    
    
    
    
    
   
    

  
