const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

/*
router.post('/findEmail', async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await db.User.findOne({ // 1. 유저가 존재하면 유저 정보를 가져옴
      where: { email: email },
    });
    if (user) { // 2. 유저가 있다면?
      const token = crypto.randomBytes(20).toString('hex'); // 3. token 생성(인증코드)
      const data = {
        // 4. 인증코드 테이블에 넣을 데이터 정리
        token,
        userid: user.id,
        ttl: 300, // ttl 값 설정 (5분)
      };
      
      db.EmailAuth.create(data); // 5. 인증 코드 테이블에 데이터 입력

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          // 이메일을 보낼 계정 데이터 입력
          user: '본인 Gmail ID',
          pass: '본인 Gmail PW',
          // .env에 따로 관리해야함
        },
      });

      const mailOptions = {
        from: 'skdus728@gmail.com', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: email, // 수신 메일 주소
        subject: 'Password search authentication code transmission', // 제목
        text: 'This is the authentication code to find the password!', // 내용
        html:
          `<p>비밀번호 초기화를 위해서는 아래의 URL을 클릭하여 주세요.<p>` +
          `<a href='http://localhost:2030/resetaccount/${token}'>비밀번호 새로 입력하기</a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return res.json(result);
    } else {
      return res.status(403).send('This account does not exist');
    }
  } catch (e) {
    // try에서 result 결과값이 null일때 catch에서 에러로 잡지 않음 이유는?..
    res.send(e);
  }
});
*/


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
