const mongoose = require('mongoose');
const sequence = require('./Sequence');

const { Schema } = mongoose;
const {
    Types: {ObjectId}
} = Schema;
const postSchema = new Schema(
    {
        writer:{
            type:ObjectId,
            required:true,
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
        count:{
            type:Number,
        },
        views:{
            type:Number,
            default: 0
        }
    },
    {
        timestamps:true
    }
);

postSchema.pre("save", function (next) {
    let doc = this;
    sequence.getSequenceNextValue("post_count").
    then(counter => {
        console.log(counter);
        if(!counter) {
            sequence.insertCounter("post_count")
            .then(counter => {
                doc.count = counter;
                console.log(doc)
                next();
            })
            .catch(err => next(err))
        } else {
            doc.count = counter;
            next();
        }
    })
})

module.exports = mongoose.model('Post', postSchema);
