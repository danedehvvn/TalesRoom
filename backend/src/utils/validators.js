// 입력값 형식 검사 모음 (여러 파일에서 같이 쓰는 규칙을 한 곳에 모아 둠)
// - 규칙을 바꿀 때 이 파일만 고치면 사용하는 모든 곳에 함께 적용된다.

// 이메일 형식 검사 (예: kim@test.com) → "글자@글자.글자" 모양인지만 간단히 확인
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// / ... / (정규식 리터럴 감싸기)
// ^ : 문자열 시작, $ : 문자열 끝
// [^\s@]+ : 공백과 @를 제외한 글자가 1개 이상
// \. : 마침표 (정규식에서 .은 "아무 글자" 의미이므로, 실제 마침표를 쓰기위해 \.처럼 이스케이프 처리)
// 즉, "공백과 @를 제외한 글자 1개 이상 + @ + 공백과 @를 제외한 글자 1개 이상 + . + 공백과 @를 제외한 글자 1개 이상" 모양이면 통과

// 이메일 형식이 맞으면 true
function isValidEmail(email) {
    if (typeof email !== 'string') return false;  // 문자열이 아니면(숫자, undefined 등) 바로 false
    return EMAIL_REGEX.test(email);               // .test(문자열): 정규식 규칙에 맞으면 true
}

// 비밀번호 규칙: 8~20자, 영문·숫자·특수문자를 각각 1개 이상 포함
// - 특수문자: 키보드 기호 32개  ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
//   (한글, 공백은 특수문자로 치지 않음)
// - 프론트 frontend/src/utils/validators.js에도 같은 규칙이 있음 -> 바꿀 때 두 파일 함께 수정
const SPECIAL_CHAR_REGEX = /[!-/:-@[-`{-~]/;
// [ ... ] 안의 "A-B"는 "문자표(ASCII)에서 A부터 B까지"라는 뜻. 키보드 기호는 문자표에서 4묶음으로 나뉘어 있음
// !-/ : ! " # $ % & ' ( ) * + , - . /
// :-@ : : ; < = > ? @
// [-` : [ \ ] ^ _ `
// {-~ : { | } ~

// 비밀번호 규칙 안내 문구 (에러 메시지에 같이 사용)
const PASSWORD_RULE_MESSAGE = '8~20자이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.';

function isValidPassword(password) {
    if (typeof password !== 'string') return false;

    const hasLetter = /[A-Za-z]/.test(password);    // 영문이 1개 이상 있는지
    const hasNumber = /\d/.test(password);          // 숫자가 1개 이상 있는지
    const hasSpecial = SPECIAL_CHAR_REGEX.test(password); // 특수문자가 1개 이상 있는지
    const isLengthOk = password.length >= 8 && password.length <= 20; // 길이가 8~20자인지

    return isLengthOk && hasLetter && hasNumber && hasSpecial;
}

module.exports = { isValidEmail, isValidPassword, PASSWORD_RULE_MESSAGE }; //안내 문구도 함께 내보냄
