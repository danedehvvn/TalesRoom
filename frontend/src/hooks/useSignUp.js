// frontend/src/hooks/useSignUp.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';

export function useSignUp() {
  const navigate = useNavigate();

  // 입력 폼 데이터 상태 정의
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    email: '',
    nickname: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    // 3. 비밀번호 유효성 검사 (8~20자, 영문+숫자)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMsg('비밀번호는 8~20자의 영문과 숫자 조합이어야 합니다.');
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg('올바른 이메일 형식이 아닙니다.');
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

      alert(res.message || '회원 가입이 완료되었습니다!');
      navigate('/login'); // 가입 성공 시 로그인 페이지로 이동
    } catch (err) {
      setErrorMsg(err.response?.data?.message || '회원 가입 중 오류가 발생했습니다.');
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (window.confirm('회원가입을 취소하시겠습니까?')) {
      navigate(-1);
    }
  };

  return {
    formData,
    errorMsg,
    handleChange,
    handleSubmit,
    handleCancel,
  };
}