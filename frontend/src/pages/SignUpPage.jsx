// frontend/src/pages/SignUpPage.jsx

//import React from 'react'; // React 18부터는 import React from 'react'; 생략 가능(문제 발생 : 사용위치 없음 일단은 주석처리)
import { useSignUp } from '../hooks/useSignUp';
import '../styles/SignUpPage.css';
import { PASSWORD_RULE_LABEL } from '../utils/validators'; //비밀번호 규칙 검사·안내 문구

function SignUpPage() {
  const {
    formData,
    errorMsg,
    handleChange,
    handleSubmit,
    handleCancel,

    //이메일 인증
    code,
    setCode,
    codeSent,
    emailVerified,
    emailMsg,
    sending,
    handleSendCode,
    handleVerifyCode,
  } = useSignUp();

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>회원가입</h2>
        
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          {/* 아이디 */}
          <div className="form-group">
            <label>아이디 (4~20자 영문 소문자·숫자)</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="아이디 입력"
              maxLength={20}
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label>비밀번호 ({PASSWORD_RULE_LABEL})</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              maxLength={20}
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              maxLength={20}
              required
            />
          </div>

          {/* 닉네임 */}
          <div className="form-group">
            <label>닉네임 (2~10자)</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임 입력"
              maxLength={10}
              required
            />
          </div>

          {/* 이메일 */}
          {/* 이메일 칸 옆에 [인증번호 발송] 버튼, 아래에 인증번호 입력칸 추가 */}
          <div className="form-group">
            <label>이메일 (최대 100자)</label>
            <div className="input-with-button">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                maxLength={100}
                disabled={emailVerified}  // 인증 완료 후에는 이메일을 바꾸지 못하게 잠금
                required
              />
              {/* type="button" → 눌러도 폼 제출(가입하기)이 일어나지 않음 */}
              <button
                type="button"
                className="sub-btn"
                onClick={handleSendCode}
                disabled={sending || emailVerified}
              >
                {sending ? '발송 중...' : codeSent ? '재발송' : '인증번호 발송'}
              </button>
            </div>

            {/* 인증번호를 보낸 뒤, 인증 완료 전까지만 입력칸 보이기 */}
            {codeSent && !emailVerified && (
              <div className="input-with-button">
                <input
                  type="text"
                  inputMode="numeric"   // 휴대폰에서 숫자 키패드
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="인증번호 6자리"
                  maxLength={6}
                />
                <button type="button" className="sub-btn" onClick={handleVerifyCode}>
                  확인
                </button>
              </div>
            )}

            {/* 안내 문구 (발송 완료, 인증 완료) */}
            {emailMsg && <span className="success-text">{emailMsg}</span>}
          </div>

          {/* 버튼 그룹 */}
          <div className="button-group">
            <button type="submit" className="primary-btn">가입하기</button>
            <button type="button" onClick={handleCancel} className="cancel-btn">취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
