const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const { User } = require("../models/User");


// 비밀번호 변경 - /api/users/findPassword
router.post('/findPassword', (req, res) => {

  //요청된 email을 DB에서 확인  
  User.findOne({ name: req.body.name, email: req.body.email }, (err, user) => {

    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "가입된 이메일이 아닙니다."
      })
    }
/*
    req.password = new User(password)
    //console.log(req.body)
    console.log(req.password)
    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err })
      console.log(userInfo)

      return res.status(200).json({
        success: true
      })
    })
*/
    
  })
})


module.exports = router;
