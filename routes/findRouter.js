const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');
const flash = require('express-flash');




/*
router.post('/findPassword', (req, res) => {

  //요청된 email을 DB에서 확인  
  User.findOne({ name: req.body.name, email: req.body.email }, (err, user) => {

    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "가입된 이메일이 아닙니다."
      })
    }
    // console.log(req.body.name);
    // console.log(req.body.email);
    // const user = new User(req.body)

    user.comparePassword(req.body.password, (err, isMatch) => {

      if(isMatch) {
        return res.json({ loginSuccess: false, message: "기존과 다른 비밀번호를 입력해주세요."})
      }
    })
    //const pwUpdate = User(req.body.password)
    //console.log(req.body)
    console.log(req.body.password) // 새로 변경된 비밀번호
    let newPassword = req.body.password;
    user.updatePassword(newPassword).then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });

    /*
    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err })
      console.log(userInfo)

      return res.status(200).json({
        success: true
      })
    })*/
/*
    
  })
})
*/


// 비밀번호 찾기 - /api/users/findPassword
router.get('/forgot', function(req, res) {
  /*
  res.render('forgot', {
    user: req.user
  });*/
  
  // res.status(200).send({
  //   user: req.user
  // });

  User.findOne({email: req.body.email}, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.json({
      user: req.user,
      success: true,
    })
  })
});


router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ name: req.body.name, email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NML_EMAIL,
          pass: process.env.NML_PASSWORD
        }
      });
      let mailOptions = {
        to: user.email,
        from: process.env.NML_PASSWORD,
        subject: '[燈山(등산)] 비밀번호 변경 확인 메일',
        text: '안녕하세요, ' + user.name +'님!\n\n아래 링크를 클릭하여 새로운 비밀번호를 설정할 수 있습니다.\n\n'+
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          '만약 燈山(등산)에서 비밀번호 요청을 하신적이 없다면 이 이메일을 무시하셔도 됩니다.\n\n링크를 클릭하여 새로운 비밀번호를 설정하기 전까지는 비밀번호가 변경되지 않습니다.\n\n감사합니다.\n'
      };
      transport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    return res.redirect('forgot');
  });
});


// 새로운 비밀번호로 변경 - /api/users/findPassword
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('forgot');
    }
    //res.render('reset', {
    //  user: req.user
    //});
    res.status(200).send({
      user: req.user
    });
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NML_EMAIL,
          pass: process.env.NML_PASSWORD
        }
      });
      let mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: '[燈山(등산)] 비밀번호 변경 완료',
        text: '안녕하세요, ' + user.name +'님!\n\n' +
          user.email + ' 계정의 비밀번호가 변경되었음을 알려드립니다.\n\n감사합니다.\n'
      };
      transport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('forgot');
  });
});


module.exports = router;
