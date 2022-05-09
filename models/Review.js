const mongoose = require('mongoose');

const { Schema } = mongoose;
const {
    Types: {ObjectId}
} = Schema;
const reviewSchema = new Schema(
    {
        writer:{
            type:ObjectId,
            required:true,
            ref:"User"
        },
        mountain:{
            type:ObjectId,
            required:true,
            ref:"Mountain"
        },
        rating:{
            type:Number,
            required:true
        },
        facility:[{
            type:Boolean,
            required:true
        }],
        comment:{
            type:String,
            required:true
        },
        hashtags:[{ type: String }],
        visited:Number,
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Review', reviewSchema);
