const express = require('express');
const app = express();

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://nayeon:qweasdzxc123@cluster0.gzwsj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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
