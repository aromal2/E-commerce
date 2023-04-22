const DB = require("../../schema/models");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

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
            console.log(data, "----------------------------------");
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
        if (user) {
          if (user.blocked == false) {
            await bcrypt
              .compare(data.password, user.password)
              .then((status) => {
                if (status) {
                  response.user = user;
                  response.lstatus = true;
                  let userName = user.username;
                  let id = user._id;

                  resolve(response);
                } else {
                  //console.log("no");
                  response.lstatus = false;
                  resolve(response);
                }
              });
          } else {
            //console.log("failed");
            resolve({ blockedstatus: true });
          }
        } else {
          resolve({ lstatus: false });
        }
      } catch (err) {
        console.log(err);
      }
    });
  },

  getShop: (req, res) => {
    return new Promise(async (resolve, reject) => {
      await DB.product.find().then((result) => {
        //console.log(result,"uuuuuuu");
        resolve(result);
      });
    });
  },

  viewSingleproduct: async (data) => {
    //console.log(data,'dattaaaaaa');
    return new Promise(async (resolve, reject) => {
      await DB.product.find({ _id: data }).then((res) => {
        resolve(res);
      });
    });
  },

  addtoCart: async (proId, userId) => {
    console.log(proId);
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
                  console.log(response, "12211111111111111111111111");
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
    } catch (error) {
      console.log(error.message);
    }
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
          //console.log(cartItems,"565555555555555555555555555555555555");
          resolve(cartItems);
        });
    });
  },

  totalAmount: (userId) => {
    console.log(userId, "iiiii");
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
                $sum: { $multiply: ["$quantity", "$carted.offerPrice"] },
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

  addAddress: (data, userId) => {
    let addressInfo = {
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      mobile: data.mobile,
      street: data.street,
      apartment: data.apartment,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    };

    try {
      return new Promise(async (resolve, reject) => {
        address = await DB.address.findOne({ user: userId });
        console.log(address, "address");
        if (address) {
          await DB.address
            .updateOne({ user: userId }, { $push: { address: addressInfo } })
            .then((response) => {
              resolve(response);
              console.log("koooooooooooo");
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
    console.log(userId, "------------------------------------");
    try {
      console.log("tryyyy");
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
          ])
          .then((response) => {
            console.log(response);
            resolve(response,"9990111");
          });
      });
    } catch (error) {
      console.log("catchhhhh");
      resolve(error);
    }
  },
};
