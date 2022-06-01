const mongoose = require('mongoose');
const Mountain = require('./Mountain');

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

reviewSchema.pre("deleteOne", { document: true }, async function (next) {
    console.log(this);
    try {
        const m = await Mountain.findOne({ _id: this.mountain });
        console.log(m);
        let a_rate = m['avgRating']; //해당 산 평균 별점
        let count = m['count'];
        let fac = m['facility'];
        for(let i = 0; i < 5; i++) {
            if(this.facility[i]) fac[i].t -= 1;
            else fac[i].f -= 1;
        }
        let new_rate;
        if(count < 2) new_rate = 0;
        else new_rate = ((a_rate * count) - this.rating) / (count - 1);
        
        //리뷰 평균별점, 리뷰 개수 업데이트
        await Mountain.updateOne(
            { "_id": this.mountain }, 
            {'$inc': {'count': -1}, 
                $set: { "avgRating": new_rate, "facility": fac } }
        );
        next();
    } catch (err) {
        console.log(err);
        next();
    }     
});

module.exports = mongoose.model('Review', reviewSchema);