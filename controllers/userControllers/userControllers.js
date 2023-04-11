const userHelpers = require('../../helpers/userHelpers/userHelpers')


module.exports = {

//ejs file edukka
    getHomePage:(req,res)=>{
        res.render('homepage')
    },

    getLoginpage:(req,res)=>{
       
        
        console.log(req.session);
        res.render('user/login')
    },
    getSignuppage:(req,res)=>{
        res.render('user/signup')
    },
    postSignuppage:(req,res)=>
    {
        let data=req.body
        userHelpers.psignupPage(data).then((response)=>
        {
            if(response.finded)
            {
                res.json(false)
            }else{
                res.json(true)
            }
        })


    },
    postLoginpage:(req,res)=>
    {
        let data = req.body
        userHelpers.ploginpage(data).then((response)=>
        {        

      
             console.log(response.user,';;');
             req.session.user = response.user
             let user = req.session.user
                  console.log(user);

                  if(lstatus ==true){


                res.redirect('/landing-page',{user})
            } 
             else {

                //user=false
                res.render('user/login')
             }
        })


    },


    
    logout:(req,res)=>{
        req.session.user = null
        res.redirect('/user/login')
    },

    getShop: async(req,res)=>{
       let shop = await userHelpers.getShop()
       console.log(shop);
      res.render('user/shop',{layout:"Layout",shop})

    }
}
