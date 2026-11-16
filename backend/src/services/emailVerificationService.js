// 이메일 인증번호 서비스
// 인증번호를 만들고, 서버 메모리(Map)에 잠시 저장해 두었다가, 사용자가 입력한 번호와 비교한다.
// DB에 저장하지 않으므로 서버를 다시 켜면 저장된 인증번호는 모두 사라진다. (다시 요청하면 됨)
//
// 사용하는 곳(purpose)과 흐름
//   'signup'         : 회원가입
//       POST /api/auth/signup/request  → issueCode (번호 발송)
//       POST /api/auth/signup/verify   → verifyCode (인증 완료 표시, 10분 유지)
//       POST /api/auth/signup          → isVerified로 확인 후 가입 → clearVerification
//   'find-id'        : 아이디 찾기
//       POST /api/auth/find-id/request → issueCode (번호 발송)
//       POST /api/auth/find-id/verify  → verifyCode 성공하면 바로 아이디를 보여주고 clearVerification
//   'password-reset' : 비밀번호 재설정
//       POST /api/auth/password/request → issueCode (번호 발송)
//       POST /api/auth/password/reset   → verifyCode 성공하면 바로 비밀번호 변경 후 clearVerification
// 같은 이메일이라도 용도가 다르면 따로 저장한다. (회원가입용 인증을 비밀번호 재설정에 쓰지 못하게)
const crypto = require('crypto');// Node.js 기본 도구 (설치 필요 없음), 안전한 난수 생성에 사용

const PURPOSES = ['signup', 'find-id', 'password-reset'];// 허용하는 용도

const CODE_EXPIRES_MS = 5 * 60 * 1000;        // 인증번호 유효 시간: 5분
const VERIFIED_EXPIRES_MS = 10 * 60 * 1000;   // 인증 완료 후 유지 시간: 10분 (회원가입만 사용, 이 안에 가입을 끝내야 함)
const RESEND_COOLDOWN_MS = 30 * 1000;         // 재발송 대기 시간: 30초 (발송 버튼 쿨타임)
const MAX_ATTEMPTS = 5;                       // 틀릴 수 있는 최대 횟수 (넘으면 번호가 무효 → 바로 다시 발송 가능)

// 인증 정보 보관함
// key   : 'signup:kim@test.com' 처럼 "용도:이메일"
// value : { code, expiresAt, sentAt, attempts, verified, verifiedExpiresAt }
const store = new Map();

// 에러 만들기 (postService와 같은 방식, 컨트롤러에서 err.status로 응답 코드를 정함)
function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// 보관함 key 만들기
// 이메일은 앞뒤 공백 제거 + 소문자로 맞춤 → 'Kim@Test.com'과 'kim@test.com'을 같은 이메일로 처리
function makeKey(email, purpose) {
    return `${purpose}:${String(email).trim().toLowerCase()}`;
}

// 용도 값 검사
function checkPurpose(purpose) {
    if (!PURPOSES.includes(purpose)) {
        throw httpError(400, '잘못된 인증 용도입니다.');
    }
}

// 6자리 인증번호 만들기
// crypto.randomInt(0, 1000000) → 0 ~ 999999 중 하나
// padStart(6, '0') → 123 이면 '000123' 처럼 앞을 0으로 채워 항상 6자리 문자열로 만듦
function generateCode() {
    return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

// 1. 인증번호 발급: 새 번호를 만들어 저장하고 돌려줌 (메일 발송은 3단계 컨트롤러에서 함)
function issueCode(email, purpose) {
    checkPurpose(purpose);//회원가입, 아이디 찾기, 비밀번호 재설정 중 하나여야 함

    const key = makeKey(email, purpose);
    const now = Date.now();                     // 현재 시간 (밀리초 숫자)

    // 30초 안에 다시 요청하면 거절 (메일 폭탄 방지)
    const saved = store.get(key);
    if (saved && now - saved.sentAt < RESEND_COOLDOWN_MS) {
        const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - saved.sentAt)) / 1000);
        throw httpError(400, `${waitSec}초 후에 다시 요청해 주세요.`);     // 400 = 규칙 위반 (재발송 대기 시간)
    }

    const code = generateCode();// 6자리 인증번호 만들기

    // 같은 key(용도:이메일)에 새 값을 덮어씀 → 이전 인증번호는 사라지고 새로 보낸 번호만 유효
    // 틀린 횟수, 인증 완료 상태, 만료 시간(새로 5분)도 모두 초기화됨
    store.set(key, {
        code,
        expiresAt: now + CODE_EXPIRES_MS,   // 만료 시각 = 지금 + 5분
        sentAt: now,
        attempts: 0,                        // 틀린 횟수
        verified: false,                    // 인증 완료 여부
        verifiedExpiresAt: null,
    });

    return code;
}

// 2. 인증번호 확인: 사용자가 입력한 번호와 저장된 번호를 비교
function verifyCode(email, purpose, inputCode) {
    checkPurpose(purpose);//회원가입, 아이디 찾기, 비밀번호 재설정 중 하나여야 함

    const key = makeKey(email, purpose);//보관함 key
    const saved = store.get(key);

    if (!saved) {
        throw httpError(400, '인증번호를 먼저 요청해 주세요.');
    }

    //이미 인증 완료된 상태여도 "시간"과 "번호"는 다시 확인한다(전에는 인증 완료 상태면 바로 성공 -> 틀린 번호도 통과되는 빈틈이 있었음)
    if (saved.verified) {
        if (Date.now() > saved.verifiedExpiresAt) {// 인증 완료 상태 -> 인증 유지 시간(10분)이 지났는지 확인
            store.delete(key);
            throw httpError(400, '인증 유지 시간이 지났습니다. 인증번호를 다시 요청해 주세요.');
        }
    } else if (Date.now() > saved.expiresAt) {
        // 아직 인증 전 -> 인증번호 유효 시간(5분)이 지났는지 확인
        store.delete(key);
        throw httpError(400, '인증번호가 만료되었습니다. 다시 요청해 주세요.');
    }

    if (saved.attempts >= MAX_ATTEMPTS) {
        store.delete(key);
        throw httpError(400, '인증 시도 횟수를 초과했습니다. 인증번호를 다시 요청해 주세요.');
    }

    // 번호 비교 (숫자로 보내도 되도록 문자열로 바꾸고 공백 제거)
    if (String(inputCode).trim() !== saved.code) {
        saved.attempts += 1;// 틀린 횟수

        const left = MAX_ATTEMPTS - saved.attempts;
        if (left <= 0) {
            store.delete(key);
            throw httpError(400, '인증 시도 횟수를 초과했습니다. 인증번호를 다시 요청해 주세요.');
        }

        throw httpError(400, `인증번호가 일치하지 않습니다. (남은 횟수: ${left}회)`);
    }

    //일치 -> 처음 인증하는 경우에만 인증 완료 상태로 바꾸고, 10분 동안 유지(이미 인증 완료 상태면 10분을 다시 늘리지 않음 -> 같은 번호로 계속 연장하지 못하게)
    if (!saved.verified) {//처음 인증하는 경우
        saved.verified = true;
        saved.verifiedExpiresAt = Date.now() + VERIFIED_EXPIRES_MS;
    }
}

// 3. 인증 완료 여부 확인: 회원가입 직전에 호출 (아이디 찾기/비밀번호 재설정은 verifyCode 성공 시 바로 처리하므로 사용 안 함)
// true = 인증 완료 + 아직 10분이 안 지남
function isVerified(email, purpose) {
    const saved = store.get(makeKey(email, purpose));//보관함 key

    if (!saved || !saved.verified) return false;

    if (Date.now() > saved.verifiedExpiresAt) {// 10분 지남
        store.delete(makeKey(email, purpose));//보관함 key 삭제해서 다시 인증번호를 발급받도록 함
        return false;
    }

    return true;
}

// 4. 인증 기록 삭제: 회원가입 / 아이디 보여주기 / 비밀번호 변경이 끝난 뒤 호출 -> 같은 인증으로 두 번 사용하지 못하게
function clearVerification(email, purpose) {
    store.delete(makeKey(email, purpose));
}

module.exports = { PURPOSES, issueCode, verifyCode, isVerified, clearVerification };