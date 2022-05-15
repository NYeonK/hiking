const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Review = require("../models/Review");
const Mountain = require("../models/Mountain");

const bodyParser = require('body-parser');

router.use(bodyParser.json());


//방문한 산 불러오기 - /api/mypage/main
router.post("/main", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body._id }, { _id: 0, image: 1, name: 1, level: 1, review: 1 });

        const reviews = await Review.distinct("mountain", { writer: req.body._id });
        console.log(reviews);
        let result = [];
        if(reviews !== null) {
            for(let idx = 0; idx < reviews.length; idx++){
                let mountain = await Mountain.findOne({ _id: reviews[idx] });
                result.push(mountain);
                console.log(result);
            }
        }

        res.json({ user, mountains: result });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//회원 정보 수정 - /api/mypage/update
router.post("/update", async (req, res) => {
    try {
        await User.updateOne(
            { "_id": req.body._id},
            { $set: {
                "name": req.body.name,
                "email": req.body.email,
                "password" : req.body.password,
                "image": req.body.image
            }}
        );

        res.json({ message: true });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});



module.exports = router;