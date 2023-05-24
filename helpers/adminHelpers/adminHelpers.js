const dbAdmin=require('../../schema/models')
const bcrypt=require('bcrypt')
let admins;
module.exports=
{
    doLogin:(data)=>
    {
        return new Promise((resolve,reject)=>{
            try{
                let email=data.email
                dbAdmin.admin.findOne({email:email}).then(async(admins)=>{
                    // console.log(admins);
                    if(admins)
                    {
                        await bcrypt.compare(data.password,admins.password).then((loginTrue)=>{
                            if(loginTrue)
                            {
                                resolve(admins)
                               // console.log(admins,"99999999999999999999999");
                            }else{
                                resolve(false)
                            }
                        })
                    }
                    else{
                        resolve(false)
                    }
                })
            }
            catch(error){
                throw error
            }
        })



    },
    
   
}
