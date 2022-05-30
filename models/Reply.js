const mongoose = require('mongoose');

function getCurrentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}


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
        writeDate: { type: Date, default: getCurrentDate() },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Reply', replySchema);
