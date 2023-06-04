const dbAdmin = require("../../schema/models");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const couponCode = require("coupon-code");
const mongoose = require('mongoose');
const slugify = require('slugify');



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
  //
  //    resolve (userData)
  //
  //   }
  //    )
  //  }

  getUser: () => {
    try {
      return new Promise((resolve, reject) => {
        dbAdmin.user.find().then((user) => {
          resolve(user);
        });
      });
    } catch (error) {}
  },

  blockUser: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        await dbAdmin.user
          .updateOne({ _id: userId }, { $set: { blocked: true } })
          .then((data) => {
            resolve();
          });
      });
    } catch (error) {}
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
    } catch (error) {}
  },

  addCategory: (data) => {
    let subCat = data["sub-category"];
    console.log(data.offerprice, "777777");

    return new Promise(async (resolve, reject) => {
      let cat = await dbAdmin.category.findOne({ CategoryName: data.category });

      if (!cat) {
        const categoryD = new dbAdmin.category({
          CategoryName: data.category,
          subCategory: subCat,
          categoryOfferpercentage: data.offerprice,
          createdAt: data.enddate,
        });

        await categoryD.save().then((result) => {
          resolve(result);
        });
      } else {
        let categoryD = await dbAdmin.category.updateOne({
          $push: {
            subCategory: subCat,
            categoryOfferpercentage: data.offerprice,
          },
          createdAt: data.enddate,
        });
        await categoryD.save().then((result) => {
          resolve(result);
        });
      }
    });
  },

  getCategory: () => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.category.find({}).then((result) => {
        resolve(result);
      });
    });
  },

  getCategoryedit: (categoryId) => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.category
        .findOne({ _id: new ObjectId(categoryId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  postCategoryedit: () => {},

  // getEditcategory:async (categoryId) => {

  //   console.log(categoryId);
  //   let data = await dbAdmin.category.findOne({_id: new ObjectId(categoryId)})
  //   console.log('huu',data);
  //   return data
  // },

  getAddproductcategory: () => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.category
        .find({unlist:false})
        .exec()
        .then((response) => {
          resolve(response);
        });
    });
  },

  addProduct: (data) => {

    const string1 = data.name;
const string2 = data.brand;

const combinedString = string1 + ' ' + string2;
const slug = slugify(combinedString);

console.log(slug);
    return new Promise((resolve, reject) => {
      // prod= dbAdmin.product.find({productName:data.name})

      const productD = new dbAdmin.product({
        productName: data.name,
        brand: data.brand,
        description: data.description,
        Price: data.price,
        quantity: data.quantity,
        category: data.category,
        image: data.img,
        slug:slug
      });
      productD.save().then((result) => {
        resolve(result);
      });
    });
  },

  viewProductlist: (i,perPage) => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.product
        .find({})
        .sort({ _id: -1 }).limit(perPage).skip((i-1)*perPage)
        .then((result) => {
          console.log(result,"4567890");
          resolve(result);
        });
    });
  },

  viewAddcategory: () => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.category.find().then((result) => {
        resolve(result);
      });
    });
  },

  editViewproduct: async (productId) => {
    console.log(productId, "000000000000123456");
    try {
      let validObjectId;
  
      if (mongoose.Types.ObjectId.isValid(productId)) {
        validObjectId = new mongoose.Types.ObjectId(productId);
      } else {
        // Handle the case when productId is not a valid ObjectId
        // e.g., if it's an integer or a different format
        validObjectId = productId;
      }
  
      const response = await dbAdmin.product.findOne({ _id: validObjectId });
      console.log(response,"66666666");
      return response;
    } catch (error) {
      console.error("MongoDB Error:", error.message);
      // throw error;
    }
  },
  
  

  postEditproduct: async (id, data, images) => {
    console.log(id,"--------", data,"8888888", images,"---------0----------------------------");
    return new Promise(async (resolve, reject) => {
      const imageStrings = images.map((image) => String(image));
      await dbAdmin.product
        .updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              productName: data.name,
              brand: data.brand,
              description: data.description,
              Price: data.price,
              quantity: data.quantity,
              category: data.category,
              image: imageStrings
            },
          }
        )
        .then((result) => {
          console.log(result, "Update successful");
          resolve(result);
        })
        .catch((error) => {
          console.log(error);
        
        });
    });
  }
  ,

  getPreviousImages: (proId) => {
    try {
        return new Promise(async (resolve, reject) => {
            await dbAdmin.product.findOne({ _id: proId }).then((response) => {
              console.log(response,"response");
                resolve(response.image)
            })
        })
    } catch (error) {
        console.log(error.message);
    }

},

  // postEditcategory1:async (data, categoryId) => {
  //   console.log(data,']]]]]]]]]]]]]]]]]]]]');

  // return new Promise(async (resolve, reject) => {
  //   await dbAdmin.category
  //     .updateOne(
  //       { _id: categoryId },
  //       {
  //         $set: {
  //           CategoryName: data.Categoryname,
  //           subCategory: data.Subcategoryname,
  //           categoryOfferpercentage:data.offerprice
  //         },
  //       }
  //     )
  //     .then((result) => {});
  // });

  updateCategory: (id, body) => {
    const { editCategoryname, editCategoryoffer } = body;
    console.log(id, body);
    return new Promise(async (resolve, reject) => {
      await dbAdmin.category.updateOne(
        { _id: id },
        { $set: { CategoryName: editCategoryname, categoryOfferpercentage: editCategoryoffer } }
      );
      
    });
  },
  

  categoryOffer: async (id, body) => {
    const { editCategoryname, editCategoryoffer } = body;
    
    try {
      let category = await dbAdmin.category.findOne({ _id: new ObjectId(id) });
      console.log(category);
      
      if (category.categoryOfferpercentage != editCategoryoffer) {
        await dbAdmin.product.updateMany(
          { category: editCategoryname },
          { $set: { offerPercentage: editCategoryoffer } }
        );
      }
      
      console.log('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  },
  

  unlist: (data) => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.product
        .updateOne(
          { _id: data },
          {
            $set: {
              unlist: true,
            },
          }
        )
        .then((result) => {
          resolve(result);
        });
    });
  },

  list:(data)=>{
    return new Promise(async (resolve, reject) => {
      await dbAdmin.product
        .updateOne(
          { _id: data },
          {
            $set: {
              unlist: false,
            },
          }
        )
        .then((result) => {
          resolve(result);
        });
    });
  },

  

  unlistCategory: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbAdmin.category.updateOne(
          {
            CategoryName: data,
          },
          {
            $set: {
              unlist: true,
            },
          }
        ).then((result)=>{
          resolve(result)
          console.log(result);
          
        })
       
      } catch (error) {
        reject(error);
      }
    });
  },



  listCategory: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbAdmin.category.updateOne(
          {
            CategoryName: data,
          },
          {
            $set: {
              unlist: false,
            },
          }
        ).then((result)=>{
          resolve(result)
          console.log(result,"listcateg");
          
        })
        
      } catch (error) {
        reject(error);
      }
    });
  },

  listShop: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbAdmin.product.updateMany(
          {
            category: data,
          },
          {
            $set: {
              unlist: false,
            },
          }
        ).then((result)=>{
          console.log(result,"listshopppppp");
          resolve(result)
          
        })
        
      } catch (error) {
        reject(error);
      }
    });
  },

  unlistShop: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbAdmin.product.updateMany(
          {
            category: data,
          },
          {
            $set: {
              unlist: true,
            },
          }
        ).then((result)=>{
          console.log(result,"unlistshop");
        resolve(result)
        })
       
      } catch (error) {
        reject(error);
      }
    });
  },

  getOrders: () => {
    try {
      return new Promise(async (resolve, reject) => {
        await dbAdmin.order
          .aggregate([{ $unwind: "$orders" }])
          .then((orders) => {
            resolve(orders);
          });
      });
    } catch (error) {}
  },
  viewOneorderdetail: (userId, orderId) => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.order
        .aggregate([
          {
            $match: {
              user: new ObjectId(userId),
            },
          },
          {
            $unwind: "$orders",
          },
          {
            $match: {
              "orders._id": new ObjectId(orderId),
            },
          },
          {
            $project: {
              item: "$orders",
            },
          },
        ])
        .then((order) => {
          resolve(order);
        });
    });
  },
  OrderStatus: (orderData) => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.order
        .updateOne(
          { "orders._id": orderData.order },
          {
            $set: {
              "orders.$.orderStatus": orderData.status,
            },
          }
        )
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  generateCoupon: () => {
    return new Promise(async (resolve, reject) => {
      const coupon = couponCode.generate({
        parts: 3, // number of parts in the code
        partLen: 4, // length of each part
        charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", // character set to use
        prefix: "SALE-", // prefix to add to the code
      });

      resolve(coupon);
    });
  },
  postCoupon: (data) => {
    console.log(data,"66666666666666666");


    return new Promise(async (resolve, reject) => {

     
      dbAdmin
        .coupon(data)
        .save()
        .then((order) => {
          console.log(order,"345678");
          resolve(order);
        });
    });
  },

  postViewcoupon: () => {
    return new Promise(async (resolve, reject) => {
      let coupons = dbAdmin.coupon.find();

      resolve(coupons);
    });
  },

  deleteCoupon: (couponId) => {
    return new Promise(async (resolve, reject) => {
      dbAdmin.coupon.deleteOne({ _id: couponId }).then((response) => {

        resolve(response)
      });
    });
  },

  getCodCount: () => {
    return new Promise(async (resolve, reject) => {
      let response = await dbAdmin.order.aggregate([
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.paymentMethod": "COD",
          },
        },
      ]);


      resolve(response);
    });
  },

  getOnlineCount: () => {
    return new Promise(async (resolve, reject) => {
      let response = await dbAdmin.order.aggregate([
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.paymentMethod": "razorpay",
          },
        },
      ]);
console.log(response);
      resolve(response);
    });
  },

  getWalletCount: () => {
    return new Promise(async (resolve, reject) => {
      let response = await dbAdmin.order.aggregate([
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.paymentMethod": "wallet",
          },
        },
      ]);
      resolve(response);
    });
  },

  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.product.find().then((response) => {
        resolve(response);
      });
    });
  },

  getOrderByDate: () => {
    return new Promise(async (resolve, reject) => {
      const startDate = new Date();
      await dbAdmin.order
        .find({ createdAt: { $gte: startDate } })
        .then((response) => {
          console.log(response, "000000000000000000000000123456");
          resolve(response);
        });
    });
  },

  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      let order = await dbAdmin.order
        .aggregate([
          { $unwind: "$orders" },
          { $sort: { "orders.createdAt": -1 } },
        ])
        .then((response) => {
          resolve(response);
        });
    });
  },

  getOrderByCategory: () => {
    return new Promise(async (resolve, reject) => {
      await dbAdmin.order
        .aggregate([
          {
            $project: {
              productDetails: "$orders.productsDetails",
            },
          },
          {
            $unwind: "$productDetails",
          },
          {
            $project: {
              category: "$productDetails.category",
            },
          },
        ])
        .then((response) => {
          console.log(response, "55555555555555555");
          // const productDetails = response.map(order => order.orders.productsDetails);

          resolve(response);
        });
    });
  },

  addtoWallet: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let orderDetails = await dbAdmin.order.find({ "orders._id": orderId });

      let userId = orderDetails[0].user;
      let totalPrice = orderDetails[0].orders[0].totalPrice;

      const updateResult = await dbAdmin.user.updateOne(
        { _id: new ObjectId(userId) },
        { $inc: { wallet: totalPrice } }
      );

      console.log(updateResult);
    });
  },

  salesReport: async () => {
    return new Promise(async (resolve, reject) => {
      let orders = await dbAdmin.order.aggregate([
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.orderStatus": "Delivered",
          },
        },
        {
          $unwind: "$orders.productsDetails",
        },
      ]);

      console.log(orders);

      resolve(orders);
    });
  },

  
  postReport: (date) => {
    let start = new Date(date.startdate);
    let end = new Date(date.enddate);
    
    return new Promise(async (resolve, reject) => {
      try {
        const response = await dbAdmin.order.aggregate([
          {
            $unwind: "$orders",
          },
          {
            $match: {
              "orders.orderStatus": "Delivered",
              "orders.createdAt": {
                $gte: new Date(start),
                $lte: new Date(end),
              },
            },
          },
        ]).exec();
    
        console.log(response, "78909");
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  documentCount: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await dbAdmin.product.countDocuments();
      
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },

  slugify:(productName)=>{
    return new Promise(async(resolve,reject)=>{
      try {


      } catch(error)
      {
        reject(error)
      }
    })
  },

  addBanner: (texts, Image) => {

    return new Promise(async (resolve, reject) => {

      let banner = dbAdmin.banner({
        title: texts.title,
        description: texts.description,
        image: Image

      })
      await banner.save().then((response) => {
        console.log(response,"77777777456789");
        resolve(response)
      })
    })
  },

  listBanner: () => {

    return new Promise(async (resolve, reject) => {
      await dbAdmin.banner.find().exec().then((response) => {
        resolve(response)
      })
    })
  },

  editBanner:(bannerId)=>{
    return new Promise(async (resolve, reject) => {
      await dbAdmin.banner.find({_id:new ObjectId(bannerId)}).exec().then((response) => {
        console.log(response)
        resolve(response)
      })
    })
  },

  editpostBanner: (bannerid, texts, Image) => {

    return new Promise(async (resolve, reject) => {

      let response = await dbAdmin.banner.updateOne({ _id: bannerid },
        {
          $set: {

            title: texts.title,
            description: texts.description,
            image: Image
          }

        })
        console.log(response);
      resolve(response)
    })

  },
  }
  