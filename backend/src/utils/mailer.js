// 메일 발송 도구 (Gmail SMTP 사용)
// .env에 MAIL_USER, MAIL_PASS가 없으면 메일을 보내지 않고 서버 터미널에 내용을 출력한다. (개발용)
// -> 메일 설정을 안 한 팀원도 서버를 켜고 이메일 인증 기능을 테스트할 수 있음
const nodemailer = require('nodemailer');

// 메일 설정이 되어 있는지 확인 (둘 다 있어야 실제 발송)
const isMailConfigured = Boolean(process.env.MAIL_USER && process.env.MAIL_PASS);

// 메일을 보내 줄 "우체국" 설정 (설정이 있을 때만 만듦)
const transporter = isMailConfigured
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com',             // Gmail SMTP 서버 주소
        port: 465,                          // Gmail SSL 포트
        secure: true,                       // 465 포트는 true (암호화 연결)
        auth: {
            user: process.env.MAIL_USER,    // 보내는 Gmail 주소
            pass: process.env.MAIL_PASS,    // Gmail 앱 비밀번호 16자리 (Google 계정 로그인 비밀번호 아님)
        },
    })
    : null;

// 메일 보내기
// to: 받는 사람 이메일, subject: 제목, text: 내용
async function sendMail(to, subject, text) {
    // 메일 설정이 없으면 → 터미널에 출력하고 끝 (개발용)
    if (!isMailConfigured) {
        console.log('===== [개발용 메일: 실제로 발송되지 않음] =====');
        console.log(`받는 사람: ${to}`);
        console.log(`제목: ${subject}`);
        console.log(`내용: ${text}`);
        console.log('==============================================');
        return;
    }

    // 메일 설정이 있으면 → 실제 발송
    await transporter.sendMail({
        from: `"TalesRoom" <${process.env.MAIL_USER}>`,     // 보내는 사람 (MAIL_USER와 같은 주소로 보냄)
        to,
        subject,
        text,
    });
}

module.exports = { sendMail };
