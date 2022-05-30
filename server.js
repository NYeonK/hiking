const express = require('express');
const app = express();
const passport = require('passport');

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

app.use(passport.initialize());
app.use(passport.session());
  
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
