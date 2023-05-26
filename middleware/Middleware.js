 const DB = require('../schema/models')

module.exports = {
    userauth:((req,res,next)=>{
      console.log('------------------',req.session.userLoggedIn,'------------------');
        if(req.session.userLoggedIn){
            console.log('logeeddddd');
          next()
        }else{
            console.log('user illlaaaaa');
            res.redirect('/login')
        }
       
      }),

      auth:(function(req,res,next){
      
        if(req.session.admin){
          next()
        }else{

          res.render('admin/',{layout:'adminLayout',admins:false})
        }
})
}