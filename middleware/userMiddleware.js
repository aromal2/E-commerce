const DB = require('../schema/models')

module.exports = {
    userauth:((req,res,next)=>{
        if(req.session.userLoggedIn){
            console.log('logeeddddd');
          next()
        }else{
            console.log('user illlaaaaa');
          res.render('user/login')
        }
       
      }),
}