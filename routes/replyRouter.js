const express = require("express");
const router = express.Router();
const Post = require("../models/Reply");
const bodyParser = require('body-parser');

router.use(bodyParser.json());

 

//댓글 삭제 - /community/post/delete
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

//댓글 작성 - /community/write
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

//글 수정
router.post("/update", async (req, res) => {
    try {
        await Reply.update(
            {_id: req.body._id},
            {$set: {
                content: req.body.content
            }}
        );
        res.json({ message: "댓글이 수정 되었습니다!" });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//내가 쓴 댓글
router.get("/history", async (req, res) => {
    try {
        const reply = await Reply.find({ writer: req.body.writer }, null, {sort: {createdAt: -1}});
        res.json({ list: reply });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
})
module.exports = router;