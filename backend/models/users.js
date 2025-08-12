const mongoose=require('mongoose')
const validator = require('validator');

const User=mongoose.model('User',{
    name:{
        type:String
    },
     email:{
      type:String,
      validate(value){
        if(!validator.isEmail(value)){
           throw new Error('Email invalid')
        }

      }
  },
    resetToken:{
      type:String
    },
    resetTokenExpiration:{
      type:Date
    },
    password:{
    type:String,  
    required:true,
    trim:true,
    minlength:7,
    validate(value){
      if(value.toLowerCase().includes('password')){
        throw new Error("Password cannot be a password")
      }
    }
  }

})

module.exports=User