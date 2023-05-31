const { log } = require("console");
const DB = require("../../schema/models");
const bcrypt = require("bcrypt");
const { response } = require("express");
const { ObjectId } = require("mongodb");
const razorpay = require("razorpay");
const { logout } = require("../../controllers/adminControllers/adminControllers");
const { type } = require("os");
const instance = new razorpay({
  key_id: "rzp_test_WIBmlE1BtAN6s5",
  key_secret: "1414fIyTHPuhrPNBl5YrJw3K",
});

module.exports = {
  psignupPage: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let email = data.email;
        let userexist = await DB.user.findOne({ email: email });
        if (userexist) {
          resolve({ finded: true });
        } else {
          let hashedPassword = await bcrypt.hash(data.password[0], 10);
          let userdata = new DB.user({
            username: data.username,
            password: hashedPassword,
            email: data.email,
            phoneno: data.mobile,
          });
          await userdata.save().then((data) => {
            resolve({ finded: false });
          });
        }
      } catch (error) {
        throw error;
      }
    });
  },

  //post login

  ploginpage: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {};
        //let loginStatus=false
        let email = data.email;
        let user = await DB.user.findOne({ email: email });
        console.log(user,"user");
        if (user) {
          if (user.blocked == false) {
            await bcrypt
              .compare(data.password, user.password)
              .then((status) => {
                if (status) {
                  response.user = user;
                  response.lstatus = true;
                  response.password=true;
                  let userName = user.username;
                  let id = user._id;

                  resolve(response);
                } else {
                  response.lstatus = false;
                  response.password=false
                  resolve(response);
                }
              });
          } else {
            resolve({ blockedstatus: true });
          }
        } else {
          resolve({ lstatus: false ,email:false});
        }
      } catch (err) {
        throw err;
      }
    });
  },

  getShop: (req, res) => {
    return new Promise(async (resolve, reject) => {
      await DB.product.find().then((result) => {
        resolve(result);
      });
    });
  },

  viewSingleproduct: async (data) => {
    return new Promise(async (resolve, reject) => {
      await DB.product.find({ slug: data }).then((res) => {
        resolve(res);
      });
    });
  },

  findUser: async (mobileno) => {
    try {
      const user = await DB.user.findOne({ phoneno: mobileno });
      return user
    } catch (error) {
      resolve(error);
    }
  },

  addtoCart: async (proId, userId) => {
    let proObj = {
      productId: proId,
      quantity: 1,
    };
    try {
      return new Promise((resolve, reject) => {
        DB.cart.findOne({ user: userId }).then(async (cart) => {
          if (cart) {
            let productExist = cart.cartItems.findIndex(
              (cartItems) => cartItems.productId == proId
            );

            if (productExist != -1) {
              DB.cart
                .updateOne(
                  { user: userId, "cartItems.productId": proId },
                  {
                    $inc: { "cartItems.$.Quantity": 1 },
                  }
                )
                .then((response) => {
                  resolve({ response, status: false });
                });
            } else {
              DB.cart
                .updateOne(
                  { user: userId },
                  {
                    $push: {
                      cartItems: proObj,
                    },
                  }
                )
                .then((response) => {
                  resolve(response, { status: true });
                });
            }
          } else {
            let newCart = await DB.cart({
              user: userId,
              cartItems: proObj,
            });
            await newCart.save().then((response) => {
              resolve(response, { status: true });
            });
          }
        });
      });
    } catch (error) {}
  },

  countCart: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await DB.cart.findOne({ user: userId });

      if (cart) {
        count = cart.cartItems.length;
      }
      resolve(count);
    });
  },

  listCart: (userId) => {
    return new Promise(async (resolve, reject) => {
      DB.cart
        .aggregate([
          {
            $match: {
              user: new ObjectId(userId),
            },
          },
          {
            $unwind: "$cartItems",
          },
          {
            $project: {
              product: "$cartItems.productId",
              quantity: "$cartItems.Quantity",
            },
          },
          {
            $lookup: {
              from: "products", // corrected name of the "products" collection
              localField: "product",
              foreignField: "_id",
              as: "carted", // corrected "as" field to create "carted" field in the output documents
            },
          },
          {
            $project: {
              product: 1,
              quantity: 1,
              carted: { $arrayElemAt: ["$carted", 0] },
            },
          },
        ])
        .then((cartItems) => {
          console.log(cartItems,"23456777777777");
          resolve(cartItems);
        });
    });
  },

  deleteProductcart: (userId, productId) => {
    try {
      return new Promise((resolve, reject) => {
        DB.cart
          .updateOne(
            { _id: userId },
            { $pull: { cartItems: { productId: productId } } }
          )
          .then((response) => {
            resolve(response);
          });
      });
    } catch (error) {
      resolve(error);
    }
  },

  totalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let total = await DB.cart.aggregate([
          {
            $match: { user: new ObjectId(userId) },
          },
          {
            $unwind: "$cartItems",
          },
          {
            $project: {
              product: "$cartItems.productId",
              quantity: "$cartItems.Quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "carted",
            },
          },
          {
            $project: {
              product: 1,
              quantity: 1,
              carted: { $arrayElemAt: ["$carted", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: { $multiply: ["$quantity", "$carted.Price"] },
              },
            },
          },
         ]);
         


      
        resolve(total);
      } catch (err) {
        reject(err);
      }
    });
  },

  changeproductQuantity: (count, quantity, cart, product) => {
    return new Promise(async (resolve, reject) => {
      DB.cart
        .updateOne(
          { _id: cart, "cartItems.productId": product },
          { $inc: { "cartItems.$.Quantity": count } }
        )
        .then(() => {
          resolve({ delete: false });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getProDetails: (cart, product) => {
  
    return new Promise(async (resolve, reject) => {
      let cartDetails = await DB.cart.aggregate([
        {$match:{_id: new ObjectId(cart)}},
        {$unwind:'$cartItems'},
        {$match:{'cartItems.productId': new ObjectId(product)}}
      ])
      let productDeatils = await DB.product.findOne({ _id: product });
      let response = {};

  
      response.count = cartDetails[0].cartItems.Quantity;
      response.price = productDeatils.Price;

      resolve(response);
    });
  },
  addAddress: (data, userId) => {
    console.log(data,"34567890");
    let addressInfo = {
      fname: data.Firstname,
      lname: data.lastname,
      email: data.email,
      mobile: data.mobileno,
      street: data.street,
      apartment: data.apartment,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    };

    try {
      return new Promise(async (resolve, reject) => {
        address = await DB.address.findOne({ user: userId });
        if (address) {
          await DB.address
            .updateOne({ user: userId }, { $push: { address: addressInfo } })
            .then((response) => {
              resolve(response), "345678";
            });
        } else {
          let addressData = new DB.address({
            user: userId,
            address: addressInfo,
          });
          await addressData.save().then((response) => {
            resolve(response);
          });
        }
      });
    } catch (error) {
      resolve(error);
    }
  },

  viewAddress: (userId) => {
    console.log(userId,"usrr");
    try {
      return new Promise(async (resolve, reject) => {
        await DB.address
          .aggregate([
            {
              $match: {
                user: new ObjectId(userId),
              },
            },
            {
              $unwind: "$address",
            },
            {
              $project: {
                item: "$address",
              },
            },
            {
            $project: {
              item: 1,
            },
          }
          
            
          ])
          .then((response) => {
            resolve(response);
          });
      });
    } catch (error) {
      resolve(error);
    }
  },

  geteditAddress: (addressId, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await DB.address.aggregate([
          {
            $match: {
              user: new ObjectId(userId),
            },
          },
          {
            $unwind: "$address",
          },
          {
            $match: {
              "address._id": new ObjectId(addressId),
            },
          },
          
        ]);
        
        resolve(response);
        console.log(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  posteditAddress: (userId, addressId, data) => {
    const {
      fname,
      lname,
      email,
      mobile,
      street,
      apartment,
      city,
      state,
      pincode,
    } = data;
    let address = {
      fname,
      lname,
      email,
      mobile,
      street,
      apartment,
      city,
      state,
      pincode,
    };

    return new Promise(async (resolve, reject) => {
      try {
        await DB.address
          .updateOne(
            {
              user: new ObjectId(userId),
              "address._id": new ObjectId(addressId),
            },
            {
              $set: {
                "address.$": address,
              },
            }
          )
          .then((response) => {
        
            resolve(response);
            console.log(response,"4567890");
          });
      } catch (error) {
        reject(error);
      }
    });
  },

  postCheckoutpage: (userId, address, paymentMethod, total) => {
    console.log(userId,address,paymentMethod,total,"98888888888888888888");
    return new Promise(async (resolve, reject) => {
      let cartDetails = await DB.cart.aggregate([
        {
          $match: {
            user: new ObjectId(userId),
          },
        },
        {
          $unwind: "$cartItems",
        },
        {
          $project: {
            item: "$cartItems.productId",
            quantity: "$cartItems.Quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "item",
            foreignField: "_id",
            as: "carted",
          },
        },
        {
          $unwind: "$carted",
        },
        {
          $project: {
            image: "carted.image",
            category: "$carted.category",
            _id: "carted._id",
            quantity: "$quantity",
            productName: "$carted.productName",
            productPrice: "$carted.Price",
          },
        },
      ]);

    console.log(cartDetails,"000090909099009999909009");

      let totalQuantity = cartDetails.reduce((acc, curr) => {
        return (acc = acc + curr.quantity);
      }, 0);
      

      let Address = await DB.address.aggregate([
        {
          $match: {
            user: new ObjectId(userId),
          },
        },
        {
          $unwind: "$address",
        },
        {
          $match: {
            "address._id": new ObjectId(address),
          },
        },
        {
          $project: {
            item: "$address",
          },
        },
      ]);
      
      console.log(Address, "adresssssses");
      
      let status, orderStatus;

    
  

      if (paymentMethod === "COD" || paymentMethod === "wallet") {
        (status = "Placed"), (orderStatus = "Success");
      } else {
        (status = "Pending"), (orderStatus = "Pending");
      }

      let orderDatas = {
        _id:new ObjectId(),
        fname:Address[0]?.item.fname,
        lname:Address[0].item.lname,
        mobile: Address[0].item.mobile,

        totalQuantity: totalQuantity,
        paymentStatus: status,
        paymentMethod: paymentMethod,
        productsDetails: cartDetails,
        shippingAddress: Address,
        totalPrice: total,
      };
      let order = await DB.order.findOne({ user: userId });

      if (order) {
        await DB.order
          .updateOne(
            { user: userId },
            {
              $push: { orders: orderDatas },
            }
          )
          .then((response) => {
        resolve(response)
          
       });
      } else {
        let newOrder = DB.order({
          user: userId,
          orders: orderDatas,
        });
        await newOrder.save().then((response) => {
          console.log(response,"4567890");
          resolve(response);
        });
      }
      

      await DB.cart.deleteMany({ user: userId }).then(() => {
        resolve();
      });
    });
  },


  getOrderlist: (userId) => {
    return new Promise(async (resolve, reject) => {
      await DB.order
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
            $sort: { "orders.createdAt": -1 },
          },
          {
            $project: {
              item: "$orders",
            },
          },
        ])
        .then((response) => {
          resolve(response);
        });
    });
  },

  orderCancel: (commonId, orderId) => {
    try {
      return new Promise((resolve, reject) => {
        DB.order.find({ "orders._id": orderId }).then((orders) => {
          let orderIndex = orders[0].orders.findIndex(
            (orders) => orders._id == orderId
          );

          let order = orders[0].orders.find((order) => order._id == orderId);

          if (
            order.paymentMethod === "COD" &&
            order.orderStatus === "ordered" &&
            order.paymentStatus === "Placed"
          ) {
            DB.order
              .updateOne(
                { "orders._id": orderId },
                {
                  $set: {
                    ["orders" + orderIndex + ".orderStatus"]: "cancelled",
                    ["orders." + orderIndex + ".paymentStatus"]: "refunded",
                  },
                }
              )
              .then((orders) => {
                resolve(orders);
              });
          } else {
            DB.order
              .updateOne(
                { "orders._id": orderId },
                {
                  $set: {
                    ["orders." + orderIndex + ".orderStatus"]: "cancelled",
                  },
                }
              )
              .then((order) => {
                resolve(order);
              });
          }
        });
      });
    } catch (error) {
      resolve(error);
    }
  },

  getsingleOrderlist: (userId, orderId) => {
    console.log(userId,"333333322222222222");
    const userID = userId._id.toString()
    console.log(typeof(orderId),'sssssssssssss');
    console.log(userID);

    return new Promise(async (resolve, reject) => {
      await DB.order
        .aggregate([
          {
            $match: {
              user: new ObjectId(userID),
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
        .then((response) => {
          console.log(response,"order");
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  createData: (details) => {
    let address = details.shippingAddress;
    let product = details.productsDetails;
    console.log(product);
    var data = {
      // Customize enables you to provide your own templates
      // Please review the documentation for instructions and examples
      customize: {
        //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
      },
      images: {
        // The logo on top of your invoice
        logo: "",
        // The invoice background
        // background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      // Your own data
      sender: {
        company: "Arrow",
        address: "Washington DC",
        zip: "4567 CD",
        city: "Los santos",
        country: "America",
      },
      // Your recipient
      client: {
        company: address[0].item.fname,
        address: address[0].item.street,
        zip: address[0].item.pincode,
        city: address[0].item.city,
        country: "India",
      },

      information: {
        number: address[0].item.mobile,
        date: "12-12-2021",
        "due-date": "31-12-2021",
      },

      products: [
        {
          quantity: product[0].quantity,
          description: product[0].productName,
          "tax-rate": 6,
          price: product[0].productPrice,
        },
      ],
      // The message you would like to display on the bottom of your invoice
      "bottom-notice": "Thank you for your order from Arrow",
      // Settings to customize your invoice
      settings: {
        currency: "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      },
      // Translate your invoice to your preferred language
      translate: {},
    };

    return data;
  },


  getAddress: (userId, orderId) => {
    return new Promise(async (resolve, reject) => {
      await DB.order
        .aggregate([
          {
            $match: { user: new ObjectId(userId) },
          },
          {
            $unwind: "$orders",
          },
          {
            $match: { "orders._id": new ObjectId(orderId) },
          },
          {
            $unwind: "$orders.shippingAddress",
          },
          {
            $project: {
              _id: 0,
              shippingAddress: "$orders.shippingAddress.item",
            },
          },
        ])
        .then((address) => {
          console.log(address,"addresss");
          resolve(address);
        });
    });
  },

  returnOrder: (commonId,orderId) => {
  
    try {
        return new Promise(async(resolve, reject) => {
            let orders = await DB.order.find({ "orders._id": orderId });

          
            if (orders.length === 0) {
                reject(new Error("No orders found with the given ID"));
            } else {
                let orderIndex = orders[0].orders.findIndex(
                    (order) => order._id == orderId
                );

                await DB.order.updateOne({ "orders._id": orderId },
                    {
                        $set: {
                            ["orders."+orderIndex+".orderStatus"]:"returned"
                        }
                    })
                    .then((orders) => {
                      
                        resolve(orders);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    } catch (error) {
        console.error(error);
    }
}
,
             
  generateRazorpay: (userId, total) => {
    return new Promise(async (resolve, reject) => {
      let orders = await DB.order.find({ user: userId });

      let order = orders[0].orders.slice().reverse();
      let orderId = order[0]._id.toString();

      var options = {
        amount: parseInt(total * 100),
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          
        } else {
    
          resolve(order);
        }
      });
    });
  },

  verifyPayment: (details) => {
    try {
    let key_secret="1414fIyTHPuhrPNBl5YrJw3K"
    return new Promise((resolve, reject) => {
     
      
        const crypto = require("crypto");

        let hmac = crypto.createHmac("sha256", key_secret);
        hmac.update(
          details["payment[razorpay_order_id]"] +
            "|" +
            details["payment[razorpay_payment_id]"]
        );
        hmac = hmac.digest("hex");
        if (hmac == details["payment[razorpay_signature]"]) {
      
          resolve();
        } else {
          reject("not match");
          
        }
      })
     } catch (err) {}
    },
  

    changePaymentstatus: (userId, orderId) => {
      return new Promise((resolve, reject) => {
        DB.order
          .updateOne(
            {
              user: new ObjectId(userId),
              "orders._id": new ObjectId(orderId),
            },
            {
              $set: {
                "orders.$.orderStatus": "Success",
                "orders.$.paymentStatus": "paid",
              },
            }
          )
          .then((result) => {
            console.log(result, "888888");
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    

  validateCoupon: (couponCode, userId) => {
    return new Promise(async (resolve, reject) => {
      let couponExists = await DB.coupon.findOne({ couponName: couponCode });

      if (couponExists) {
        if (new Date(couponExists.expiry) - new Date() > 0) {
          let userCouponexists = await DB.coupon.findOne({
            user: userId,
            coupon: couponCode,
          });

          if (userCouponexists) {
            resolve({ status: false, reason: "coupon already used" });
          } else {
            resolve({ status: true, reason: "coupon added" });
          }
        } else {
          resolve({ status: false, reason: "coupon expired" });
        }
      } else {
        resolve({ status: false, reason: "coupon doesn't exist" });
      }
    });
  },

  
  
  applyCoupon: (code, total) => {
    return new Promise(async (resolve, reject) => {
      try {
        let coupon = await DB.coupon.findOne({ couponName: code });
        if (coupon) {
          //checking coupon Valid

          if (new Date(coupon.expiry) - new Date() > 0) {
            //checkingExpiry
            if (total[0]?.total >= coupon.minPurchase) {
              //checking max offer value
              let discountAmount =
                (total[0]?.total * coupon.discountPercentage) / 100;
              if (discountAmount > coupon.maxDiscountValue) {
                discountAmount = coupon.maxDiscountValue;
                resolve({
                  status: true,
                  discountAmount: discountAmount,
                  discount: coupon.discountPercentage,
                  code: code,
                });
              } else {
                resolve({
                  status: true,
                  discountAmount: discountAmount,
                  discount: coupon.discountPercentage,
                  code: code,
                });
              }
            } else {
              resolve({
                status: false,
                reason: `Minimum purchase value is ${coupon.minPurchase}`,
              });
            }
          } else {
            resolve({ status: false, reason: "coupon Expired" });
          }
        }
      } catch (error) {
        throw error;
      }
    });
  },

  sorting: (sortOption) => {
    console.log(sortOption,1);
    return new Promise(async (resolve, reject) => {
      let products;
      if (sortOption === "low-to-high") {
        console.log('ifff');
        products = await DB.product.find().sort({ Price: 1 }).exec();
      } else if (sortOption === "high-to-low") {
        console.log('else iff');
        products = await DB.product.find().sort({ Price: -1 }).exec();
      } else 
      {
        console.log('elsee---------- ');
        products = await DB.product.find().exec();
      }
      console.log(products,2);

      resolve(products);
    });n
  },

  sortCategory:(category)=>{
    return new Promise(async(resolve,reject)=>{
      let categ
      if(category ==="MEN"){
  
      categ=await DB.product.find({category:"MEN"}).exec()
      }
      else if (category ==="WOMEN")
      {
        
        categ= await DB.product.find({category:"WOMEN"}).exec()
      }
      else{
        
        categ= await DB.product.find().exec()
      }
      console.log(categ,"5432gfdsbvc");
      resolve (categ)
    })
  },

  search: (searchingWord) => {
    return new Promise(async (resolve, reject) => {
      try {
        const searchResult = await DB.product.find({
          productName: { $regex: searchingWord, $options: "i" },
        }).exec();
        
        resolve(searchResult);
      } catch (error) {
        reject(error);
      }
    });
  },

  checkWallet:async(userId)=>{
 
    return new Promise(async (resolve,reject)=>{
      await DB.user.findOne({_id:userId})
      .then((response)=>{
      
      
        resolve(response.wallet)
      })
      
    })
},

reduceWallet: (userId,total)=>{
  return new Promise(async (resolve,reject)=>{
    await DB.user.updateOne({_id:userId},{$inc:{wallet:-total}})
  })

},

documentCount: () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await DB.product.countDocuments();
    
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
},

pageview:(perpage,i)=>{
  return new Promise(async (resolve,reject)=>{
    try{
    
      
      let pagination=  await DB.product.find().limit(perpage).skip((i-1)*perpage)
      resolve(pagination)
    
    } catch(error){
      console.log(error);
    }
  })
}



  
    }
    

