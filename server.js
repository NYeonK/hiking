const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { User } = require("./models/User");
const Post = require("./models/Post");
require('dotenv').config();


//bodyParser을 통해 아래와 같은 데이터 형식들을 분석해서 가져옴.
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());


//mongodb 연결
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, {
  //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.listen(8080, function(){
  console.log('listening on 8080')
});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/map', function(req, res){
  res.send('지도 페이지입니다.');
});


app.post('/register', (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면 DB에 넣어줌.
    const user = new User(req.body)
    console.log(req.body)
    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err })
      console.log(userInfo)

      return res.status(200).json({
        success: true
      })
    })
})

//////////////////////////////////////////////////////////////
//게시판 메인 접근 시
app.get('/community', (req, res) => {
  //data는 최종적으로 db에서 가져와야함
  let data = [
    {
      name: "이름1", title: "제목1", content: "내용1"
    },
    {
      name: "이름2", title: "제목2", content: "내용2"
    }
  ]
  res.send(data);
})

//게시판 글 작성 시 db에 저장
app.post('/community/post', async (req, res) => {
  console.log("inside post function");
   
  const data = new Post({
    name:req.body.name,
    title:req.body.email,
    content:req.body.content,
    count:1
  });

  const val = await data.save();
  res.send("posted");

})

///검색 시 word로 검색한 단어 받음
app.get('/community/:word', (req, res) => {
  let {
    word
  } = req.params;

  //디비에서 해당하는 word 셀렉하기
  let data;
  //let data = db.community.find()
  console.log(word);
  res.send(data);
})
