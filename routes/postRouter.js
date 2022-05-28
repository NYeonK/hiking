const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Reply = require("../models/Reply");
const User = require("../models/User");
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
        const post = await Post.findOne({
            _id: req.body._id
        });           
        await post.deleteOne();

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
            image: req.body?.image
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
                "content": req.body.content,
                "image" : req.body?.image
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
        const posts = await Post.find(null, null, {sort: {createdAt: -1}});
        let result = [];

        if(posts !== null) {
            for(let idx = 0; idx < posts.length; idx++){
                let user = await User.findOne({ _id: posts[idx]['writer'] }, {_id:0, name:1, level:1});
                let level = user['level'];
                let name = user['name'];
                result.push(posts[idx]['_doc']);
                result[idx]['level'] = level;
                result[idx]['name'] = name;
                console.log(result[idx]);
            }    
        }
        
        res.json({ list: result });
    } catch (err) {
        res.json({ message: false });
    }
});

//게시글 검색 /api/post/main/:
router.get("/main/:search", async (req, res) => {
    try {
        const _search = req.params.search;
        console.log(_search);
        
        const posts = await Post.find({ title: new RegExp(_search, 'i')}, null, {sort: {createdAt: -1}});
        let result = [];

        if(posts !== null) {
            for(let idx = 0; idx < posts.length; idx++){
                let user = await User.findOne({ _id: posts[idx]['writer'] }, {_id:0, name:1, level:1});
                let level = user['level'];
                let name = user['name'];
                result.push(posts[idx]['_doc']);
                result[idx]['level'] = level;
                result[idx]['name'] = name;
            }
        }

        res.json({ list: result });
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
        let result = [];

        if(post !== null) {
            let user = await User.findOne({ _id: post['writer'] });
            let level = user['level'];
            let name = user['name'];
            post['_doc']['level'] = level;
            post['_doc']['name'] = name;
            
            await Post.updateOne(
                { "_id": post['_id'] }, 
                { '$inc': { 'views': 1}
            })

            const replies = await Reply.find({ postID: post['_id'] });
            
            if(replies !== null) {
                for(let idx = 0; idx < replies.length; idx++){
                    let user = await User.findOne({ _id: replies[idx]['writer'] }, {_id:0, name:1, level:1});
                    let level = user['level'];
                    let name = user['name'];
                    result.push(replies[idx]['_doc']);
                    result[idx]['level'] = level;
                    result[idx]['name'] = name;
                }
            }
        }

        res.json({ post, replies: result });
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