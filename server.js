const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const cors = require("cors");

const { User } = require("./models/User");
const Post = require("./models/Post");
require('dotenv').config();

/*
const corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));
*/

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
app.use("/community", require("./routes/communityRouter"));

