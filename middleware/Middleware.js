 const DB = require('../schema/models')

module.exports = {
    userauth:((req,res,next)=>{
      console.log('------------------',req.session.userLoggedIn,'--------user----------');
        if(req.session.userLoggedIn){
            console.log('logeeddddd');
          next()
        }else{
            console.log('user illlaaaaa');
            res.redirect('/login')
        }
       
      }),

      auth:(function(req,res,next){
      console.log('---------------------',req.session.admin,'-------------admin------------');
        if(req.session.admin){
          console.log('admin sesion inddd');
          next()
        }else{
          console.log('admin session illaa');
          res.render('admin/login',{layout:'adminLayout',admins:false})
        }
})
}