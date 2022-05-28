const express = require("express");
const router = express.Router();
const Reply = require("../models/Reply");
const Post = require("../models/Post");
const bodyParser = require('body-parser');

router.use(bodyParser.json());

 

//댓글 삭제 - /api/reply/delete
router.post("/delete", async (req, res) => {
    try {
        await Reply.remove({
            _id: req.body._id
        });
        res.json({ message: true });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//댓글 작성 - /api/reply/write
router.post('/write', async (req, res) => {
    try {
        const obg = {
            writer: req.body.writer,
            postID: req.body.postID,
            content: req.body.content
        };
        const reply = new Reply(obg);
        await reply.save();
        res.json({ message: "댓글이 업로드 되었습니다!" });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//댓글 수정
router.post("/update", async (req, res) => {
    try {
        if((req.body?._id === undefined || req.body.content === undefined)) throw error;
        await Reply.updateOne(
            { "_id": req.body._id},
            { $set: {
                "content": req.body.content
            }}
        );
        res.json({ message: "댓글이 수정 되었습니다!" });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//내가 쓴 댓글
router.post("/history", async (req, res) => {
    try {
        const reply = await Reply.find({ writer: req.body.writer }, null, {sort: {createdAt: -1}});
        let result = [];

        if(reply !== null) {
            for(let idx = 0; idx < reply.length; idx++){
                let post = await Post.findOne({ _id: reply[idx]['postID'] }, {_id:0, count:1});
                let count = post['count'];
                result.push(reply[idx]['_doc']);
                result[idx]['post_count'] = count;
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