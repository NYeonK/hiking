const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Reply = require("../models/Reply");
const User = require("../models/User");
const Review = require("../models/Review");
const Mountain = require("../models/Mountain");

const bodyParser = require('body-parser');

router.use(bodyParser.json());

//방문한 산 불러오기 - /api/mypage/mountains
router.post("/mountains", async (req, res) => {
    try {
        const reviews = await Review.distinct("mountain", { writer: req.body._id });
        console.log(reviews);
        let result = [];

        for(let idx = 0; idx < reviews.length; idx++){
            let mountain = await Mountain.findOne({ _id: reviews[idx] });
            result.push(mountain);
            console.log(result);
        }

        res.json({ mountains: result });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

module.exports = router;