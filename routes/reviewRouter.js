const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Mountain = require("../models/Mountain");
const bodyParser = require('body-parser');
const User = require("../models/User");

router.use(bodyParser.json());

const getLevel = (n) => {
    let level = 1;
    if(n < 4) level = 2;
    else if(n < 7) level = 3;
    else if(n < 10) level = 4;
    else if(n < 15) level = 5;
    else if(n < 20) level = 6;
    else if(n < 25) level = 7;
    else if(n < 32) level = 8;
    else if(n < 39) level = 9;
    else if(39 <= n) level = 10;
    return level;
}

//후기 삭제 - /api/review/delete
router.post("/delete", async (req, res) => {
    try {
        //레벨 확인
        let u = await User.findOne({ _id: req.body.writer }, { _id: 0, review: 1 });
        let n = u['review'] - 1;
        let level = getLevel(n);

        await User.updateOne(
            { "_id": req.body.writer },
            { $set: {
                "level": level,
                "review": n
            }}
        );
        const doc = await Review.findOne({
            _id: req.body._id
        });            
        await doc.deleteOne();

        res.json({ message: true });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//후기 작성 - /api/review/write
router.post('/write', async (req, res) => {
    try {        
        const m = await Mountain.findOne({ name: req.body.mountain });
        let m_id;
        if(m === null) { //산이 등록 돼 있지 않으므로 산 등록
            let fac = [];
            for(let i = 0; i < 5; i++) {
                if(req.body.facility[i]) fac.push({ t: 1, f: 0 });
                else fac.push({ t: 0, f: 1 });
            }
            const object = {
                name: req.body.mountain,
                address: req.body.address,
                avgRating: req.body.rating,
                facility: fac,
                count: 1,
                hashtags: req.body.hashtags.split(" "),
                latitude: req.body.lat,
                longitude: req.body.lng
            }
            const mountain = new Mountain(object);
            const v = await mountain.save();
            m_id = v._id;
        } else {
            m_id = m['_id'];
            let a_rate = m['avgRating'];
            let count = m['count'];
            let fac = m['facility'];
            let hashtag = m['hashtags'].concat(req.body.hashtags.split(" "));
            const set = new Set(hashtag);
            const set_hashtag = [...set];
            let new_rate = ((a_rate * count) + req.body.rating) / (count + 1);
            for(let i = 0; i < 5; i++) {
                if(req.body.facility[i]) fac[i].t += 1;
                else fac[i].f += 1;
            }
            //리뷰 평균별점, 리뷰 개수 업데이트
            await Mountain.updateOne(
                { "_id": m_id }, 
                { "$inc": { "count": 1 }, 
                    $set: { "avgRating": new_rate, "facility": fac, "hashtags": set_hashtag } }
            )
        }
        
        //레벨 확인
        let u = await User.findOne({ _id: req.body.writer }, { _id: 0, review: 1 });
        let n = u['review'] + 1;
        let level = getLevel(n);
        await User.updateOne(
            { "_id": req.body.writer },
            { $set: {
                "level": level,
                "review": n
            }}
        );

        //리뷰 등록
        let _visited = await Review.find({ writer: req.body.writer, mountain: m_id }).count() + 1;
        const obg = {
            writer: req.body.writer,
            mountain: m_id,
            facility: req.body.facility,
            rating: req.body.rating,
            comment: req.body.comment,
            hashtags: req.body.hashtags.split(" "),
            visited: _visited
        };

        // 해시태그 작성
        
        // const hashtags = req.body.comment.match(/#[^\s]*/g);
        // if(hashtags) {
        //     const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
        //         where : { title : tag.slice(1).toLowerCase() },
        //     })));
        //     await post.addHashtags(result.map(r => r[0]));
        // }
        
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
        let o_fac = v['facility'];
        let flag = false;
        for(let i = 0; i < 5; i++) {
            if(o_fac[i] != req.body.facility[i]) {
                flag = true;
                break;
            }
        }
        if(flag || old_rate != req.body.rating) {
            let m = await Mountain.findOne({ _id: m_id });
            let avg_rate = m['avgRating'];
            let count = m['count'];
            let fac = m['facility'];
            for(let i = 0; i < 5; i++) {
                if(o_fac[i] != req.body.facility[i]) {
                    if(req.body.facility[i]) {
                        fac[i].t += 1;
                        fac[i].f -= 1;
                    }
                    else {
                        fac[i].f += 1;
                        fac[i].t -= 1;
                    }
                }
            }
            let new_rate = ((avg_rate * count) - old_rate + req.body.rating) / count;
            await Mountain.updateOne(
                { "_id": m_id }, 
                { $set: {"avgRating": new_rate, "facility": fac } }
            );
        }
        await Review.updateOne(
            { "_id": req.body._id},
            { $set: {
                "facility": req.body.facility,
                "rating": req.body.rating,
                "comment": req.body.comment,
                "hashtag": req.body.toString().split(",").map((word) => `#${word}`),
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
        const reviews = await Review.find({ writer: req.body.writer }, null, {sort: {createdAt: -1}});
        let result = [];

        if(reviews !== null) {
            for(let idx = 0; idx < reviews.length; idx++){
                reviews[idx]['createdAt'].setHours(reviews[idx]['createdAt'].getHours() + 9);
                reviews[idx]['updatedAt'].setHours(reviews[idx]['updatedAt'].getHours() + 9);
                let mountain = await Mountain.findOne({ _id: reviews[idx]['mountain'] }, {_id:0, name:1});
                let name = mountain['name'];
                result.push(reviews[idx]['_doc']);
                result[idx]['mountain_name'] = name;
                console.log(result[idx]);
            }    
        }
        
        res.json({ list: result });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
})
module.exports = router;