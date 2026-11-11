// 입력값 형식 검사 모음 (프론트 여러 화면에서 같이 쓰는 규칙)
// - 백엔드 backend/src/utils/validators.js와 같은 규칙 -> 규칙을 바꿀 때는 두 파일을 함께 수정

// 특수문자: 키보드 기호 32개  ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
// (한글, 공백은 특수문자로 치지 않음)
const SPECIAL_CHAR_REGEX = /[!-/:-@[-`{-~]/;
// [ ... ] 안의 "A-B"는 "문자표(ASCII)에서 A부터 B까지"라는 뜻. 키보드 기호는 문자표에서 4묶음으로 나뉘어 있음
// !-/ : ! " # $ % & ' ( ) * + , - . /
// :-@ : : ; < = > ? @
// [-` : [ \ ] ^ _ `
// {-~ : { | } ~

// 비밀번호 규칙 안내 문구 (에러 메시지·입력칸 라벨에 같이 사용)
export const PASSWORD_RULE_MESSAGE = "8~20자이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.";
export const PASSWORD_RULE_LABEL = "8~20자 영문+숫자+특수문자";

// 비밀번호 규칙: 8~20자, 영문·숫자·특수문자를 각각 1개 이상 포함하면 true
export function isValidPassword(password) {
  if (typeof password !== "string") return false;

  const hasLetter = /[A-Za-z]/.test(password);          // 영문이 1개 이상 있는지
  const hasNumber = /\d/.test(password);                // 숫자가 1개 이상 있는지
  const hasSpecial = SPECIAL_CHAR_REGEX.test(password); // 특수문자가 1개 이상 있는지
  const isLengthOk = password.length >= 8 && password.length <= 20; // 길이가 8~20자인지

  return isLengthOk && hasLetter && hasNumber && hasSpecial;
}
