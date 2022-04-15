const mongoose = require('mongoose');

const { Schema } = mongoose;
const {
    Types: {ObjectId}
} = Schema;
const postSchema = new Schema(
    {
        writer:{
            type:ObjectId,
            //required:true,
            ref:"User"
        },
        title:{
            type:String,
            maxlength: 100,
            required:true,
        },
        content:{
            type:String,
            required:true
        },
        count:Number,
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Post', postSchema);
