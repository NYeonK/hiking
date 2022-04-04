const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        name:{
            type:String,
            //required:true,
        },
        title:{
            type:String,
            maxlength: 100,
            //required:true,
        },
        content:{
            type:String,
            //required:true
        },
        count:Number,
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Post', postSchema);
