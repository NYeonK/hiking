const nodemailer = require('nodemailer');

module.exports = {
    //임시 비번 만드는 함수
    makeRandomStr: () =>{
        const str = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
        const specialStr = ['!', '@', '#', '$']
        let randomStr = ''
        for(let i = 0; i < 8; i++){
           randomStr += str[Math.floor(Math.random() * str.length)]
        }
        for(let i = 0; i < 2; i++){
            randomStr += specialStr[Math.floor(Math.random() * specialStr.length)]
        }
        return randomStr;
    },
    //보내는 메일 지정
    sendEmail: (param) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NML_EMAIL,         // 보내는 gmail 계정 아이디를 입력 ex) 'jch9537@gmail.com'
                pass: process.env.NML_PASSWORD            // 보내는 gmail 계정의 비밀번호를 입력 ex) abc123!! 저의 비번을 적기 좀 그래서 ..ㅎㅎ
            }                
        });
        // 메일 옵션
        let mailOptions = {
            from: process.env.NML_EMAIL,                                   // 발송 메일 주소  ex) 'jch9537@gmail.com'
            to: param.email ,                                             // 수신 메일 주소
            subject: 'VIDPLUS Sending Password Email using Node.js',      // 제목
            html: `<h2>vidplus 임시 비밀번호입니다.</h2>                    
                   <p>임시번호는 : <b>${param.password}</b>입니다.</p>`    // 내용- text(텍스트), html, attachments(첨부파일)도 사용가능
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}


module.exports = { nodemailer }