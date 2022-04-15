const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
 

//게시글 삭제 - /community/delete
router.post("/delete", async (req, res) => {
    try {
        await Post.remove({
            _id: req.body._id
        });
        res.json({ message: true });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//글 작성 - /community/write
router.post("/write", async (req, res) => {
    try {
        const obg = {
            writer: req.body._id,
            title: req.body.title,
            content: req.body.content
        };
        const post = new Post(obg);
        await post.save();
        res.json({ message: "게시글이 업로드 되었습니다!" });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//글 수정
router.post("/update", async (req, res) => {
    try {
        await Post.update(
            {_id: req.body._id},
            {$set: {
                writer: req.body.writer,
                title: req.body.title,
                content: req.body.content
            }}
        );
        res.json({ message: "게시글이 수정 되었습니다!" });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//작성된 글
router.get("/main", async (req, res) => {
    try {
        const post = await Post.find();
        res.json({ list: post });
    } catch (err) {
        res.json({ message: false });
    }
});

//내가 쓴 글
router.get("/history/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const post = await Post.find({ writer: _id }, null, {sort: {createdAt: -1}});
        res.json({ list: post });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
})
module.exports = router;