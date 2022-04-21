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
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
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
        visited:Number,
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Review', reviewSchema);
