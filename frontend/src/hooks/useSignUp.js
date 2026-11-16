// frontend/src/hooks/useSignUp.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDialog from './useDialog';
// import { signup } from '../api/authApi';
import { signup, requestSignupCode, verifySignupCode } from '../api/authApi'; //이메일 인증 API 2개 추가
import { isValidPassword, PASSWORD_RULE_MESSAGE } from '../utils/validators'; //비밀번호 규칙 검사·안내 문구

//이메일 형식 검사 (발송 버튼과 가입 버튼에서 함께 사용, 백엔드와 같은 규칙)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useSignUp() {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useDialog();

  // 입력 폼 데이터 상태 정의
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    email: '',
    nickname: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  //이메일 인증 상태
  const [code, setCode] = useState('');                    // 사용자가 입력한 인증번호
  // code : 변수명, setCode : setter 함수, useState('') : 초기값은 빈 문자열
  const [codeSent, setCodeSent] = useState(false);         // 인증번호를 보냈는지 -> true면 인증번호 입력칸이 보임
  const [emailVerified, setEmailVerified] = useState(false); // 인증 완료했는지 -> true여야 가입 가능
  const [emailMsg, setEmailMsg] = useState('');            // 이메일 칸 아래에 보여줄 안내 문구 (초록 글씨)
  const [sending, setSending] = useState(false);           // 발송 중인지 -> 버튼 여러 번 누르기 방지

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    //이메일을 바꾸면 이전 인증은 무효 -> 인증 상태 초기화 (다른 이메일로 다시 인증해야 함)
    if (name === 'email') {
      setCode('');
      setCodeSent(false);
      setEmailVerified(false);
      setEmailMsg('');
    }
  };

  //인증번호 발송 버튼
  const handleSendCode = async () => {
    setErrorMsg('');
    setEmailMsg('');

    // 보내기 전에 이메일 형식부터 확인 (잘못된 이메일로 요청하지 않게)
    if (!emailRegex.test(formData.email)) {
      setErrorMsg('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setSending(true); // 버튼 여러 번 누르기 방지 

    try {
      const res = await requestSignupCode(formData.email);
      setCodeSent(true);       // 인증번호 입력칸 보이기
      setCode('');             // 다시 보낸 경우 이전에 입력한 번호 지우기
      setEmailMsg(res.message); // '인증번호를 발송했습니다. 5분 안에 입력해 주세요.'
    } catch (err) {
      // 이미 사용 중인 이메일, 30초 안에 재요청 등 -> 서버 메시지를 그대로 보여줌
      setErrorMsg(err.response?.data?.message || '인증번호 발송 중 오류가 발생했습니다.');
    } finally {
      setSending(false);       // 성공·실패 상관없이 버튼 다시 누를 수 있게
    }
  };

  // 인증번호 확인 버튼
  const handleVerifyCode = async () => {
    setErrorMsg('');

    if (!code.trim()) {
      setErrorMsg('인증번호를 입력해 주세요.');
      return;
    }

    try {
      const res = await verifySignupCode(formData.email, code.trim());
      setEmailVerified(true);   // 이제 가입 가능
      setEmailMsg(res.message); // '이메일 인증이 완료되었습니다.'
    } catch (err) {
      // 번호 틀림(남은 횟수), 만료, 5회 초과 등 → 서버 메시지를 그대로 보여줌
      setErrorMsg(err.response?.data?.message || '인증번호 확인 중 오류가 발생했습니다.');
    }
  };

  // 회원가입 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. 필수 입력값 검사
    if (!formData.id || !formData.password || !formData.email || !formData.nickname) {
      setErrorMsg('모든 필드를 입력해주세요!');
      return;
    }

    // 2. 아이디 유효성 검사 (4~20자 영문 소문자·숫자)
    const idRegex = /^[a-z0-9]{4,20}$/;
    if (!idRegex.test(formData.id)) {
      setErrorMsg('아이디는 4~20자의 영문 소문자와 숫자여야 합니다.');
      return;
    }

    //비밀번호 유효성 검사 (8~20자, 영문+숫자+특수문자)
    if (!isValidPassword(formData.password)) { //utils/validators.js에서 처리
      setErrorMsg(`비밀번호는 ${PASSWORD_RULE_MESSAGE}`);
      return;
    }

    // 4. 비밀번호 확인 일치 검사
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 5. 닉네임 길이 검사 (2~10자)
    if (formData.nickname.length < 2 || formData.nickname.length > 10) {
      setErrorMsg('닉네임은 2~10자 사이로 입력해주세요.');
      return;
    }

    // 6. 이메일 형식 및 길이 검사 (최대 100자)
    if (formData.email.length > 100) {
      setErrorMsg('이메일은 최대 100자까지 입력 가능합니다.');
      return;
    }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//발송 버튼에서도 쓰도록 파일 맨 위로 옮김
    if (!emailRegex.test(formData.email)) {
      setErrorMsg('올바른 이메일 형식이 아닙니다.');
      return;
    }

    //이메일 인증 완료 확인 (백엔드도 확인하지만, 요청 전에 먼저 안내)
    if (!emailVerified) {
      setErrorMsg('이메일 인증을 완료해 주세요.');
      return;
    }

    try {
      // 백엔드 요청 데이터 전송 (confirmPassword는 제외)[cite: 13]
      const res = await signup({
        id: formData.id,
        password: formData.password,
        email: formData.email,
        nickname: formData.nickname,
      });

      await showAlert(res.message || '회원 가입이 완료되었습니다!');
      navigate('/login'); // 가입 성공 시 로그인 페이지로 이동
    } catch (err) {
      setErrorMsg(err.response?.data?.message || '회원 가입 중 오류가 발생했습니다.');
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = async () => {
    if (await showConfirm('회원가입을 취소하시겠습니까?', { description: '입력한 내용이 저장되지 않습니다.', confirmText: '가입 취소', cancelText: '계속 작성' })) {
      navigate(-1);
    }
  };

  return {
    formData,
    errorMsg,
    handleChange,
    handleSubmit,
    handleCancel,

    //이메일 인증에 필요한 값과 함수
    code,
    setCode,
    codeSent,
    emailVerified,
    emailMsg,
    sending,
    handleSendCode,
    handleVerifyCode,
  };
}
