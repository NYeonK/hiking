const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Mountain = require("../models/Mountain");
const User = require("../models/User");
const bodyParser = require('body-parser');

router.use(bodyParser.json());

//지도 검색 - /api/map/:search
router.get("/:mountain", async (req, res) => {
    try {
        const _mountain = req.params.mountain;
        const m = await Mountain.findOne({ mountain: _mountain });

        const reviews = await Review.find({ mountain: m['_id']});
        let result = [];

        for(let idx = 0; idx < reviews.length; idx++){
            let user = await User.findOne({ _id: reviews[idx]['writer'] }, {_id:0, name:1, level:1, image:1});
            let level = user['level'];
            let name = user['name'];
            let image = user['image'];
            result.push(reviews[idx]['_doc']);
            result[idx]['level'] = level;
            result[idx]['name'] = name;
            result[idx]['image'] = image;
        }

        res.json({ mountain: m, reviews: result });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

module.exports = router;