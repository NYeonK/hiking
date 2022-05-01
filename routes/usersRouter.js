const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


//bodyParser을 통해 아래와 같은 데이터 형식들을 분석해서 가져옴.
//application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: true}));
//application/json
router.use(bodyParser.json());

router.use(cookieParser());




// 회원가입 - /api/users/register
router.post('/register', (req, res) => {

  //회원 가입 할 때 필요한 정보들을 client에서 가져오면 DB에 넣어줌.
    const user = new User(req.body)
    console.log(req.body)

    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err })
      console.log(userInfo)
      console.log(err)

      return res.status(200).json({
        success: true
      })
    })
})



// 로그인 - /api/users/login
router.post('/login', (req, res) => {

  //요청된 email을 DB에서 확인
  User.findOne({ email: req.body.email }, (err, user) => {

    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "가입된 이메일이 아닙니다."
      })
    }

    //요청된 email이 DB에 있으면, password가 동일한지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {

      if(!isMatch) {
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      }

      //password가 동일하다면, token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //token 저장
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id }) 

      })
    })
  })
})



// 인증 - /api/users/auth
router.get('/auth', auth, (req, res) => {

  //여기까지 middleware를 통과했으면, Authentication = True
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})



// 로그아웃 - /api/users/logout
router.get('/logout', auth, (req, res) => {

  User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})



module.exports = router;
