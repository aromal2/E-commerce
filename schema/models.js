const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
mongoose.connect('mongodb://127.0.0.1:27017/E-commerce',{useNewUrlParser: true})
.then(()=>console.log('-------Database is connected------------'))
.catch((err)=>console.log(err.message))

const userschema = new mongoose.Schema(
    {
        username: {
            type: String
        },
        password: {
            type: String,
        },
        email:{
            type:String,

        },
        phoneno:{
            type: Number,
           
        },
        blocked: {
            type: Boolean,
            default: false
          }

    } 


)

const adminSchema = new mongoose.Schema({
    email:{
        type: String
    },
    password:{
        type:String
    }
})

const productSchema= mongoose.Schema({
    productName: {
        type:String,
        required:true
    },
    brand: {
        type:String,
        
    },
 
    description: {
        type:String,
        required:true
    },
    Price: {
        type:Number,
        default:0
    },
    quantity: {
        type:Number,
        required:true
    },
    image: {
        type:Array,
       
    },
    category: {
        type:String,
        ref:'Category',
        required:true
    },
    
    offerPrice: {
        type: Number,
        default: function () {
          return this.Price - (this.Price * this.offerPercentage) / 100;
        },
      },

      offerPercentage: {
        type: Number,
        default: 0,
      },

      unlist:{
        type:Boolean,
        default:false
      }
    
})
 
const categorySchema = mongoose.Schema({
    CategoryName: {
        type: String,
      },
      subCategory:{
          type:Array
      } ,
      unlist:{
        type: Boolean,
        default:false
      }
    });  
    
    
    const cartSchema = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        
          cartItems: [
            {
              productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
              Quantity: { type: Number, default: 1 },
              price: { type: Number },
            },
          ],
        });

    

    





module.exports={
    user: mongoose.model("user",userschema),
    admin:mongoose.model("admin",adminSchema),
    category:mongoose.model("category",categorySchema),
    product:mongoose.model("product",productSchema),
    cart:mongoose.model("cart",cartSchema)

}