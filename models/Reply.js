const mongoose = require('mongoose');

const { Schema } = mongoose;
const {
    Types: {ObjectId}
} = Schema;
const replySchema = new Schema(
    {
        writer:{
            type:ObjectId,
            required:true,
            ref:"User"
        },
        postID:{
            type:ObjectId,
            required:true,
            ref:"Post"
        },
        content:{
            type:String,
            required:true
        },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Reply', replySchema);
