const DB = require("../schema/models");

module.exports = {
  userauth: async (req, res, next) => {
    if (req.session.user) {
      console.log("admin sesion inddd");
      let user = await DB.user.findOne({ _id: req.session.user._id });
      console.log(user);
      if (user.blocked == false) next();
      else {
        req.session.user = null;
        req.session.userLoggedIn = false;
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  },

  auth: function (req, res, next) {
    if (req.session.admin) {
      console.log("admin sesion inddd");
      next();
    } else {
      console.log("admin session illaa");
      res.render("admin/login", { layout: "adminLayout", admins: false });
    }
  },

  // blockuserStatus: (req, res, next) => {
  //   let Uid = req.session.user._id;
  //   console.log("uid:", Uid);

  //   adminHelper.blockedUserMiddlewareHelper(Uid).then((data) => {
  //     if (!data.blocked) {
  //       next();
  //     } else {
  //       res.redirect("/logout");
  //     }
  //   });
  // },
};
