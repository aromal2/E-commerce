const DB = require('../../schema/models')
const bcrypt=require('bcrypt');

module.exports=
{
    psignupPage:(data)=>
    {
        //console.log(data);
        return new Promise(async(resolve,reject)=>
        {
      try{
        let email=data.email
        let userexist=await DB.user.findOne({email:email})
     //console.log(userexist);
        if(userexist)
        {
            resolve({finded:true})
        }
        else{
            let hashedPassword =await bcrypt.hash(data.password[0],10)
            //console.log(hashedPassword);
            let userdata= new DB.user(
                {
                    username: data.username,
                    password: hashedPassword,
                    email: data.email,
                    phoneno:data.mobile

                }
            )
          await  userdata.save().then((data)=>
            {
                console.log(data,'----------------------------------');
                resolve({finded:false})
            })
        }
      }
        catch(error)
        {
            throw error
        }
    })
},

//post login

ploginpage:(data)=>
{
    return new Promise(async(resolve,reject)=>
    {  try{
          let response = {}
        //let loginStatus=false
            let email= data.email
            let user=await   DB.user.findOne({email:email})
            if(user)
        {
                if(user.blocked == false)
             {
                await bcrypt.compare(data.password,user.password).then((status)=>
                {
                  if(status)
                 {
                          response.user=user
                          let userName=user.username;
                          let id=user._id;
                   // response.status=true
                   console.log(response.user,'000');
                    resolve(response,lstatus = false)
                 }
                   else
                   {
                    //console.log("no");
                      resolve({lstatus:false})
                   }
                }
                 );
             }
          else
        {
             //console.log("failed");
            resolve({blockedstatus:true})
        } 
    }    
      else
      {
        resolve({lstatus:false})
      } 
     }
      catch(err)
            {
              console.log(err);
            }

        
       
       
        })
    },

    getShop: (req,res)=>{

      return new Promise(async (resolve,reject)=>{
        await DB.product.find().then((result)=>{
          console.log(result,"uuuuuuu");
          resolve(result)
        })
      })

    }






}













