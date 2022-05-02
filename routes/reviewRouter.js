const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const bodyParser = require('body-parser');


router.use(bodyParser.json());


//후기 삭제 - /api/review/delete
router.post("/delete", async (req, res) => {
    try {
        await Review.remove({
            _id: req.body._id
        });
        res.json({ message: true });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//후기 작성 - /api/review/write
//작성 시 산이 등록 돼 있지 않으면 산 등록 
router.post('/write', async (req, res) => {
    try {        
        const t = await Review.find({ writer: req.body.writer, mountain: req.body.mountain });
        let _visited = t.length + 1;         //사용자가 해당 산에 작성한 리뷰개수 +1 
        const obg = {
            writer: req.body.writer,
            mountain: req.body.mountain,
            address: req.body.address,
            facility: req.body.facility,
            rating: req.body.rating,
            comment: req.body.comment,
            visited: _visited
        };
        // 해시태그 작성
        const hashtags = req.body.comment.match(/#[^\s]*/g);
        if(hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where : { title : tag.slice(1).toLowerCase() },
            })));
            await post.addHashtags(result.map(r => r[0]));
        }
        //
        const review = new Review(obg);
        await review.save();
        res.json({ message: "후기가 업로드 되었습니다!" , comment: 'req.body.comment'});
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//후기 수정 - 
router.post("/update", async (req, res) => {
    try {
        await Review.update(
            {_id: req.body._id},
            {$set: {
                facility: req.body.facility,
                rating: req.body.rating,
                comment: req.body.comment
            }}
        );
        res.json({ message: "후기가 수정 되었습니다!" });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//내가 쓴 후기
router.post("/history", async (req, res) => {
    try {
        const review = await Review.find({ writer: req.body.writer }, null, {sort: {createdAt: -1}});
        res.json({ list: review });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
})
module.exports = router;