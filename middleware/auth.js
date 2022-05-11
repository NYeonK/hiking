const User = require("../models/User");

let auth = (req, res, next) => {

  // 인증 처리
  // Client Cookie에서 token을 가져온다.
  let token = req.cookies.x_auth;

  // Token을 복호화한 후 user를 찾는다.
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({ isAuth: false, error: true })

    req.token = token;
    req.user = user;

    next()  //middleware에서 넘어갈 수 있도록!
  })
}

module.exports = auth;