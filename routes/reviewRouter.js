const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Mountain = require("../models/Mountain");
const bodyParser = require('body-parser');

router.use(bodyParser.json());

//후기 삭제 - /api/review/delete
router.post("/delete", async (req, res) => {
    try {
        const v = await Review.find({ _id: req.body._id });
        let r_rate = v[0]['rating'];    //작성한 별점
        let m_id = v[0]['mountain'];

        const m = await Mountain.find({ _id: m_id });
        let a_rate = m[0]['avgRating']; //해당 산 평균 별점
        let count = m[0]['count'];
        let new_rate = ((a_rate * count) - r_rate) / (count - 1)
        
        //리뷰 평균별점, 리뷰 개수 업데이트
        await Mountain.update(
            { _id: m_id }, 
            {'$inc': {'count': -1}, 
            $set: { avgRating: new_rate }
        })
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
        const m = await Mountain.find({ name: req.body.mountain });
        let m_id;
        console.log(m.length);
        if(m.length == 0) { //산이 등록 돼 있지 않으므로 산 등록
            const object = {
                name: req.body.mountain,
                address: req.body.address,
                avgRating: req.body.rating,
                count: 1,
                latitude: req.body.lat,
                longitude: req.body.lng
            }
            const mountain = new Mountain(object);
            const v = await mountain.save();
            m_id = v._id;
        } else {
            m_id = m[0]['_id'];
            let a_rate = m[0]['avgRating'];
            let count = m[0]['count'];
            let new_rate = ((a_rate * count) + req.body.rating) / (count + 1);
            
            console.log(a_rate + ", " + req.body.rating + ", " + new_rate);
            //리뷰 평균별점, 리뷰 개수 업데이트
            await Mountain.update(
                { _id: m_id }, 
                {'$inc': {'count': 1}, 
                $set: { avgRating: new_rate }
            })
        }
        console.log(m_id);

        //리뷰 등록
        const t = await Review.find({ writer: req.body.writer, mountain: m_id });
        let _visited = t.length + 1;         //사용자가 해당 산에 작성한 리뷰개수 +1 
        const obg = {
            writer: req.body.writer,
            mountain: m_id,
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
        res.json({ message: "후기가 업로드 되었습니다!" , comment: req.body.comment});
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//후기 수정 - 
router.post("/update", async (req, res) => {
    try {
        let v = await Review.findOne({ _id: req.body._id});
        let m_id = v['mountain'];
        let old_rate = v['rating'];
        if(old_rate != req.body.rating) {
            console.log("in");
            let m = await Mountain.findOne({ _id: m_id });
            let avg_rate = m['avgRating'];
            let count = m['count'];
            let new_rate = ((avg_rate * count) - old_rate + req.body.rating) / count;
            console.log(avg_rate +", "+new_rate);
            await Mountain.updateOne(
                { "_id": m_id }, 
                { $set: {"avgRating": new_rate }}
            );
        }
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