const express = require("express");
const router = express.Router();
const { mail } = require("../models/nodemailer");
const nodemailer = require("nodemailer");

router.post('/mail', (req, res) => {

  //요청된 email을 DB에서 확인
    sendPassword: (req, res) => {
        
      const data = req.body;
      if (!(data.email && data.name))
        res.status(400).send({
          error: {
            status: 400,
            message: "email과 name을 같이 작성해주세요."
          }
        });
      else {
        const args = {
          email: data.email,
          name: data.name
        };
        userModel.sendPassword(args, (err, results) => {
          if (err)
            return res
              .status(500)
              .send({ error: { status: 500, message: "임시번호 발송 실패" } });
        
          if (results === "No match Email")
            return res.status(406).send({
              error: { status: 406, message: "일치하는 회원정보가 없습니다." }
            });
          if (results === "No match Name")
            return res.status(406).send({
              error: { status: 406, message: "이름이 일치하지 않습니다." }
            });
          if (results[0].oauth_signup)
            return res.status(303).send({
              message:
                "이 계정은 구글계정으로 가입되었습니다. 구글메일 인증을 사용해주세요."
            });
          
          const tempPassword = nodemailer.makeRandomStr(); // 임시 비번 생성
          const param = { email: data.email, password: tempPassword };
          nodemailer.sendEmail(param); // 임시 비번 메일 발송
          // 여기서는 새로 생긴 비밀번호를 해시해서 db에 업데이트 시킴
          const args2 = {
            email: data.email,
            password: crypto
              .createHmac("sha512", process.env.SRV_CRYPTO_SALT)
              .update(tempPassword) // 임시 비밀번호 해싱
              .digest("base64"),
            name: data.name,
            id: results[0].id
          };
          // DB에서 해당 유저정보의 password 변경
          userModel.put(args2, (err2, results2) => {
            if (err2)
              res.status(500).send({
                error: { status: 500, message: "회원정보 수정 실패" }
              });
            else {
              if (!results2.length)
                return res.status(409).send({
                  error: {
                    status: 400,
                    message: "다른 유저가 사용 중인 email 입니다."
                  }
                });
              res.status(201).send({ message: "임시번호 발송 완료" });
            }
          });
        });
      }
}
})

module.exports = router;