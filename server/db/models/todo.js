var mongoose=require('mongoose');

var Todo=mongoose.model('Todo',{
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number
    },
    _creatorId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});
module.exports={Todo};