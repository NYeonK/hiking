const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');



const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // trim은 email안의 공백 제거
    unique: 1
  },
  password: {
    type: String,
    minlength: 8
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  review:{
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

userSchema.pre('save', function( next ){
  var user = this;

  if(user.isModified('password')){
    
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)
    
      bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          if(err) return next(err)
          user.password = hash
          next()
  
      })
    })
  } 
  else{
    next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  })
}

// 이메일 및 암호 설정
passport.use(new LocalStrategy(function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect email.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




userSchema.methods.generateToken = function(cb) {

  var user = this;

  //jsonwebtoken을 이용해서 token 생성
  var token = jwt.sign(user._id.toHexString(), "secretToken")

  //user._id + 'secretToken' = token

  user.token = token
  user.save(function(err, user) {
    if(err) return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb){
  var user = this;

  //token을 decode한다.
  jwt.verify(token, 'secretToken', function(err, decoded) {

    //user ID를 이용해서 user을 찾은 다음에
    //client에서 가져온 token과 DB에 보관된 token이 일치하는지 확인
    user.findOne({ "_id":decoded, "token":token }, function(err, user){
      if(err) return cb(err);
      cb(null, user)
    })
  })
}


const User = mongoose.model('User', userSchema)

module.exports = User