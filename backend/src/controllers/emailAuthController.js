// 이메일 인증 컨트롤러
// 회원가입 / 아이디 찾기 / 비밀번호 재설정에서 쓰는 "인증번호 요청·확인" API를 모아 둔 곳
// 인증번호 저장·비교는 services/emailVerificationService.js, 메일 발송은 utils/mailer.js 가 담당한다.
//
// 인증번호 요청 API 3개
//   POST /api/auth/signup/request    { email }       -> 가입 안 된 이메일이어야 발송
//   POST /api/auth/find-id/request   { email }       -> 가입된 이메일이어야 발송
//   POST /api/auth/password/request  { id, email }   -> 아이디와 이메일이 같은 회원 것이어야 발송
// 회원가입, 아이디 찾기, 비밀번호 재설정 인증번호 확인
//   POST /api/auth/signup/verify     { email, code } -> 번호가 맞으면 "인증 완료" 상태가 10분 동안 유지됨
//   POST /api/auth/find-id/verify    { email, code } -> 번호가 맞으면 바로 아이디를 응답하고 인증 기록 삭제
//   POST /api/auth/password/reset    { id, email, code, newPassword } -> 번호가 맞으면 바로 비밀번호 변경 후 인증 기록 삭제
const bcrypt = require('bcrypt');//새 비밀번호 암호화
const { User } = require('../models');
const { isEmpty, duplicateEmail } = require('../services/authService');
const { issueCode, verifyCode, clearVerification } = require('../services/emailVerificationService');
const { sendMail } = require('../utils/mailer');
const { isValidEmail, isValidPassword, PASSWORD_RULE_MESSAGE } = require('../utils/validators');//이메일 형식·비밀번호 규칙 검사(userService와 같은 규칙을 함께 사용) 및 비밀번호 안내 문구도 함께 가져옴

// 용도별 메일 제목
const MAIL_SUBJECTS = {
    'signup': '[TalesRoom] 회원가입 인증번호',
    'find-id': '[TalesRoom] 아이디 찾기 인증번호',
    'password-reset': '[TalesRoom] 비밀번호 재설정 인증번호',
};

// 공통: 인증번호를 만들고 메일로 보내기 (요청 API 3개가 함께 사용)
async function sendCode(email, purpose) {
    const code = issueCode(email, purpose);     // 30초 안에 다시 요청하면 여기서 400 에러가 던져짐

    try {
        await sendMail(//메일 보내기
            email,
            MAIL_SUBJECTS[purpose],
            `인증번호는 [${code}] 입니다.\n5분 안에 입력해 주세요.`
        );
    } catch (err) {
        // 메일 발송에 실패하면 저장한 번호를 지운다 -> 지우지 않으면 받지도 못한 번호 때문에 30초 동안 다시 요청할 수 없게 됨
        clearVerification(email, purpose);

        console.error('인증 메일 발송 실패:', err);
        const error = new Error('인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        error.status = 500;
        throw error;
    }
}

//회원가입 인증번호 요청
const requestSignupCode = async (req, res, next) => {
    try {
        const { email } = req.body || {}; //빈 body 없이 요청이 와도 에러 나지 않게

        // 이미 가입된 이메일인지 검사 (비어 있음도 함께 검사됨, authService 함수 재사용)
        const error = await duplicateEmail(email);
        if (error) {
            return res.status(error.status).json({ success: false, data: null, message: error.message });
        }

        const trimmedEmail = email.trim();
        if (!isValidEmail(trimmedEmail)) {//.test(문자열) 문자열이 정규식 규칙에 맞으면 true, 안 맞으면 false (유틸 : validators.js)
            return res.status(400).json({ success: false, data: null, message: '이메일 형식이 올바르지 않습니다.' });
        }

        await sendCode(trimmedEmail, 'signup');//인증번호를 만들고 메일로 보내기

        res.status(200).json({ success: true, data: null, message: '인증번호를 발송했습니다. 5분 안에 입력해 주세요.' });
    } catch (err) {
        return next(err);
    }
};

//아이디 찾기 인증번호 요청
const requestFindIdCode = async (req, res, next) => {
    try {
        const { email } = req.body || {};

        if (isEmpty(email)) {
            return res.status(400).json({ success: false, data: null, message: '이메일을 입력해 주세요' });
        }

        // 가입된 이메일인지 확인 (없으면 보낼 이유가 없음)
        const trimmedEmail = email.trim();
        const user = await User.findOne({ where: { email: trimmedEmail }, attributes: ['id'] });
        if (!user) {
            return res.status(404).json({ success: false, data: null, message: '가입되지 않은 이메일입니다.' });
        }

        await sendCode(trimmedEmail, 'find-id');//인증번호를 만들고 메일로 보내기

        res.status(200).json({ success: true, data: null, message: '인증번호를 발송했습니다. 5분 안에 입력해 주세요.' });
    } catch (err) {
        return next(err);
    }
};

//비밀번호 재설정 인증번호 요청
const requestPasswordCode = async (req, res, next) => {
    try {
        const { id, email } = req.body || {};

        if (isEmpty(id) || isEmpty(email)) {
            return res.status(400).json({ success: false, data: null, message: '아이디와 이메일을 모두 입력해 주세요' });
        }

        // 아이디와 이메일이 "같은 회원"의 것인지 확인 (둘 다 일치하는 회원을 찾음)
        const trimmedEmail = email.trim();
        const user = await User.findOne({ where: { id: id.trim(), email: trimmedEmail }, attributes: ['id'] });
        if (!user) {
            return res.status(404).json({ success: false, data: null, message: '아이디와 이메일이 일치하는 회원이 없습니다.' });
        }

        await sendCode(trimmedEmail, 'password-reset');//인증번호를 만들고 메일로 보내기

        res.status(200).json({ success: true, data: null, message: '인증번호를 발송했습니다. 5분 안에 입력해 주세요.' });
    } catch (err) {
        return next(err);
    }
};

//회원가입 인증번호 확인
const verifySignupCode = async (req, res, next) => {
    try {
        const { email, code } = req.body || {};

        //필수 값 확인 (code는 숫자로 보낼 수도 있으니 String으로 바꿔서 빈 값인지 검사)
        if (isEmpty(email) || isEmpty(String(code ?? ''))) {//code ?? '' : code가 null이나 undefined이면 ''로 바꿈
            return res.status(400).json({ success: false, data: null, message: '이메일과 인증번호를 모두 입력해 주세요' });
        }

        //인증번호 확인 (서비스가 처리)
        //- 틀림 / 만료 / 5회 초과 / 요청한 적 없음 -> 공통 에러 미들웨어에서 400 응답
        //- 맞음 -> 아무것도 던지지 않고 "인증 완료" 상태로 바뀜 (10분 유지)
        verifyCode(email.trim(), 'signup', code);

        //성공 응답 (이 10분 안에 POST /api/auth/signup으로 가입해야 함)
        res.status(200).json({ success: true, data: null, message: '이메일 인증이 완료되었습니다.' });
    } catch (err) {
        return next(err);
    }
};

// 아이디 찾기 인증번호 확인
const verifyFindIdCode = async (req, res, next) => {
    try {
        const { email, code } = req.body || {};

        //필수 값 확인 (회원가입 확인과 같은 방식)
        if (isEmpty(email) || isEmpty(String(code ?? ''))) {
            return res.status(400).json({ success: false, data: null, message: '이메일과 인증번호를 모두 입력해 주세요' });
        }
        const trimmedEmail = email.trim();

        //인증번호 확인 (서비스가 처리)
        //- 틀림 / 만료 / 5회 초과 / 요청한 적 없음 -> 공통 에러 미들웨어에서 400 응답
        verifyCode(trimmedEmail, 'find-id', code);

        //인증번호가 맞음 -> 이 이메일로 가입된 회원의 아이디 찾기
        const user = await User.findOne({ where: { email: trimmedEmail }, attributes: ['id'] });

        //인증번호는 이미 사용했으니 결과와 상관없이 기록 삭제 (같은 번호로 다시 조회하지 못하게)
        clearVerification(trimmedEmail, 'find-id');

        //인증번호 요청 뒤 그사이에 탈퇴한 경우 등 -> 회원이 없음(정상적이지 않은 상황의 경우 체크로 확인)
        if (!user) {
            return res.status(404).json({ success: false, data: null, message: '가입되지 않은 이메일입니다.' });
        }

        res.status(200).json({ success: true, data: { id: user.id }, message: '아이디를 찾았습니다.' });
    } catch (err) {
        return next(err);
    }
};

// 비밀번호 재설정 (인증번호 확인 + 비밀번호 변경을 한 번에)
const resetPassword = async (req, res, next) => {
    try {
        const { id, email, code, newPassword } = req.body || {};

        //필수 값 확인
        if (isEmpty(id) || isEmpty(email) || isEmpty(String(code ?? '')) || isEmpty(newPassword)) {
            return res.status(400).json({ success: false, data: null, message: '아이디, 이메일, 인증번호, 새 비밀번호를 모두 입력해 주세요' });
        }

        //새 비밀번호 규칙 확인 (내 정보 수정 userService와 같은 규칙: 8~20자, 영문+숫자+특수문자 포함)
        //- 비밀번호 형식을 인증번호 확인보다 먼저 검사
        if (!isValidPassword(newPassword)) {//유틸의 validators.js에서 처리
            return res.status(400).json({ success: false, data: null, message: `새 비밀번호는 ${PASSWORD_RULE_MESSAGE}` });
        }

        //여기까지가 입력 상태 기본검사

        const trimmedId = id.trim();
        const trimmedEmail = email.trim();

        //아이디와 이메일이 같은 회원 것인지 다시 확인(메일 발송 후 그 사이에 탈퇴했을 수도 있으므로)
        //- 여기서 실패해도 인증 상태는 남아 있음 -> 아이디를 고쳐서 같은 번호로 다시 시도 가능
        const user = await User.findOne({ where: { id: trimmedId, email: trimmedEmail }, attributes: ['id'] });
        if (!user) {
            return res.status(404).json({ success: false, data: null, message: '아이디와 이메일이 일치하는 회원이 없습니다.' });
        }

        //인증번호 확인 (서비스가 처리)
        //- 틀림 / 만료 / 5회 초과 / 요청한 적 없음 -> 공통 에러 미들웨어에서 400 응답
        verifyCode(trimmedEmail, 'password-reset', code);

        //새 비밀번호 암호화 후 저장 (회원가입과 같은 saltRounds 10)
        //- saltRounds는 bcrypt가 내부적으로 랜덤 salt를 만들어서 비밀번호와 합쳐 해시를 만드는 횟수
        //- salt 가 랜덤이므로 같은 비밀번호라도 해시 결과는 매번 달라짐
        //- rounds 암호화 계산을 몇 번 반복 할지 정하는 값, 높을수록 안전하지만 느려짐 (10이면 2^10번 반복 = 1024번 반복)
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id: user.id } });

        //변경이 끝난 뒤 인증 기록 삭제 (같은 번호로 또 바꾸지 못하게)
        //- 저장 중 에러(500)가 나면 여기까지 오지 않으므로 번호가 남아 있음 -> 다시 시도 가능 (5단계 회원가입과 같은 방식)
        clearVerification(trimmedEmail, 'password-reset');

        res.status(200).json({ success: true, data: null, message: '비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.' });
    } catch (err) {
        return next(err);
    }
};

module.exports = { requestSignupCode, requestFindIdCode, requestPasswordCode, verifySignupCode, verifyFindIdCode, resetPassword };
