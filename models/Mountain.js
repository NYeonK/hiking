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
        avgRating:{
            type:Number
        },
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
