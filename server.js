const express = require('express');
const app = express();
//
const path = require('path');
//const favicon = require('static-favicon');
const session = require('express-session')
const passport = require('passport');
const flash = require('express-flash');

require('dotenv').config();

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

app.use(session({ secret: 'session secret key' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
