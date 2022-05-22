const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//
const path = require('path');
//const favicon = require('static-favicon');
const session = require('express-session')
const nodemailer = require('nodemailer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const async = require('async');
const crypto = require('crypto');
const flash = require('express-flash');
//
require('dotenv').config();

//chat-bot
//const config = require("./")

const cors = require("cors");

const corsOptions = {
  origin:  'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));



//mongodb 연결
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon());
//app.use(logger('dev'));
//bodyParser을 통해 아래와 같은 데이터 형식들을 분석해서 가져옴.
//application/json
app.use(bodyParser.json());
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({ secret: 'session secret key' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));




// Routes
app.listen(8080, function(){
  console.log('listening on 8080')
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use("/api/post", require("./routes/postRouter"));
app.use("/api/reply", require("./routes/replyRouter"));
app.use("/api/users", require("./routes/usersRouter"));
app.use("/api/review", require("./routes/reviewRouter"));
app.use("/api/map", require("./routes/mapRouter"));
app.use("/api/mypage", require("./routes/mypageRouter"));
app.use("/api/users", require("./routes/findRouter"));
app.use('/api/dialogflow', require('./routes/dialogflow'));
