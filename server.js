const express = require('express');
const app = express();

require('dotenv').config();

//const cors = require("cors");

/*
const corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));
*/


//mongodb 연결
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



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
app.use("/api/users", require("./routes/findRouter"));



