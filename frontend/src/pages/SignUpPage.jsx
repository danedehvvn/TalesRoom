// frontend/src/pages/SignUpPage.jsx
import { useSignUp } from '../hooks/useSignUp';
import '../styles/SignUpPage.css';

function SignUpPage() {
  const {
    formData,
    errorMsg,
    handleChange,
    handleSubmit,
    handleCancel,
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
            <label>비밀번호 (8~20자 영문+숫자)</label>
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
          <div className="form-group">
            <label>이메일 (최대 100자)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              maxLength={100}
              required
            />
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
