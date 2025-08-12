const mongoose= require('mongoose')
const Bookmark=mongoose.model('bookmark',{
    mangaid:{
        type:String
    },
    user:{
        
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
    
})
module.exports=Bookmark