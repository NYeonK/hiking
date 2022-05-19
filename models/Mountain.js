const mongoose = require('mongoose');

const { Schema } = mongoose;

const mountainSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        image: {
            type: String,
            default: "https://www.ui4u.go.kr/tour/img/content/img_mountain_pic02.png"
        },
        avgRating:{
            type:Number
        },
        facility: [{ 
            t:Number, 
            f:Number 
        }],
        count:{
            type:Number,
        },
        hashtags: [{ type: String }],
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        }
    }
);

module.exports = mongoose.model('Mountain', mountainSchema);
