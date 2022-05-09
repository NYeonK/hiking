const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Reply = require("../models/Reply");
const bodyParser = require('body-parser');
const multer = require('multer');

router.use(bodyParser.json());
 
//uploads/images 에 이미지 저장하도록 함 
const Storage = multer.diskStorage({
    destination: './uploads/images',
    filename:(req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage,
});

//게시글 삭제 - /api/post/delete
router.post("/delete", async (req, res) => {
    try {
        await Post.remove({
            _id: req.body._id
        });
        await Reply.remove({
            postID: req.body._id
        });
        res.json({ message: true });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//글 작성 - /api/post/write
router.post('/write', upload.single('image'), async (req, res) => {
    try {
        const obg = {
            writer: req.body.writer,
            title: req.body.title,
            content: req.body.content,
            image: req.file?.filename
        };
        const post = new Post(obg);
        await post.save();
        res.json({ message: "게시글이 업로드 되었습니다!" });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//글 수정 - /api/post/update
router.post("/update", async (req, res) => {
    try {
        if((req.body?._id === undefined || req.body.content === undefined || req.body.title === undefined)) throw error;
        await Post.updateOne(
            { "_id": req.body._id},
            { $set: {
                "title": req.body.title,
                "content": req.body.content
            }}
        );
        res.json({ message: "게시글이 수정 되었습니다!" });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//게시글 목록 /api/post/main
router.get("/main", async (req, res) => {
    try {
        const post = await Post.find();
        res.json({ list: post });
    } catch (err) {
        res.json({ message: false });
    }
});

//게시글 검색 /api/post/main/:
router.get("/main/:search", async (req, res) => {
    try {
        const _search = req.params.search;
        console.log(_search);
        const post = await Post.find({ title: new RegExp(_search, 'i')}, null, {sort: {createdAt: -1}});
        res.json({ list: post });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
})

//글 자세히 보기 /api/post/detail
router.get("/detail/:count", async (req, res) => {
    try {
        const _count = req.params.count;
        const post = await Post.findOne({ count: _count });
        console.log(post);
        const id = post['_id'];
        await Post.updateOne(
            { "_id": id }, 
            { '$inc': { 'views': 1}
        })
        const reply = await Reply.find({ postID: id });

        res.json({ post, reply });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//내가 쓴 글 /api/post/history
router.post("/history", async (req, res) => {
    try {
        const post = await Post.find({ writer: req.body.writer }, null, {sort: {createdAt: -1}});
        res.json({ list: post });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
})
module.exports = router;