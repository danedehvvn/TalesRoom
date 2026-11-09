// 비밀번호 재설정 페이지
// 흐름: 아이디 + 이메일 입력 -> [인증번호 발송] -> 인증번호 + 새 비밀번호 입력 -> [비밀번호 변경] → 완료 화면
// 백엔드: POST /api/auth/password/request, POST /api/auth/password/reset
// 스타일은 아이디 찾기와 같은 FindAccount.css 사용
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordCode, resetPassword } from '../api/authApi';
import '../styles/FindAccount.css';

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [id, setId] = useState('');                       // 아이디
  const [email, setEmail] = useState('');                 // 이메일
  const [code, setCode] = useState('');                   // 인증번호
  const [newPassword, setNewPassword] = useState('');     // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); // 새 비밀번호 확인
  const [codeSent, setCodeSent] = useState(false);        // 인증번호를 보냈는지 → true면 아래 입력칸들이 보임
  const [done, setDone] = useState(false);                // 변경 완료 → true면 완료 화면으로 바뀜
  const [info, setInfo] = useState('');                   // 안내 문구 (초록)
  const [error, setError] = useState('');                 // 에러 문구 (빨강)
  const [sending, setSending] = useState(false);          // 발송 중 → 버튼 여러 번 누르기 방지
  const [saving, setSaving] = useState(false);            // 변경 중 → 버튼 여러 번 누르기 방지

  // 아이디나 이메일을 바꾸면 처음부터 다시 (다른 계정으로 받은 번호를 섞어 쓰지 않게)
  const resetCodeState = () => {
    setCode('');
    setCodeSent(false);
    setInfo('');
  };

  // [인증번호 발송] 버튼
  const handleSendCode = async () => {
    setError('');
    setInfo('');

    if (!id.trim() || !email.trim()) {
      setError('아이디와 이메일을 모두 입력해 주세요.');
      return;
    }

    setSending(true);
    try {
      const res = await requestPasswordCode(id.trim(), email.trim());
      setCodeSent(true);
      setCode('');
      setInfo(res.message); // '인증번호를 발송했습니다. 5분 안에 입력해 주세요.'
    } catch (err) {
      // 아이디·이메일 불일치, 30초 안에 재요청 등 → 서버 메시지를 그대로 보여줌
      setError(err.response?.data?.message || '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
  };

  // [비밀번호 변경] 버튼 (폼 제출)
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 막기
    setError('');

    // 1. 입력 확인
    if (!codeSent) {
      setError('먼저 인증번호를 발송해 주세요.');
      return;
    }
    if (!code.trim() || !newPassword || !confirmPassword) {
      setError('인증번호와 새 비밀번호를 모두 입력해 주세요.');
      return;
    }

    // 2. 새 비밀번호 규칙 (백엔드와 같은 규칙: 8~20자, 영문과 숫자를 각각 1개 이상)
    //    서버도 검사하지만, 요청 전에 먼저 알려주면 인증번호를 아낄 수 있음
    const hasLetter = /[A-Za-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    if (newPassword.length < 8 || newPassword.length > 20 || !hasLetter || !hasNumber) {
      setError('새 비밀번호는 8~20자이며 영문과 숫자를 포함해야 합니다.');
      return;
    }

    // 3. 새 비밀번호 확인 일치
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 4. 서버에 변경 요청
    setSaving(true);
    try {
      await resetPassword(id.trim(), email.trim(), code.trim(), newPassword);
      setDone(true); // 완료 화면으로
    } catch (err) {
      // 번호 틀림(남은 횟수), 만료, 5회 초과 등
      setError(err.response?.data?.message || '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  // ---------- 완료 화면 ----------
  if (done) {
    return (
      <div className="find-page">
        <div className="find-card">
          <h1>비밀번호 재설정</h1>
          <p className="find-subtitle">비밀번호가 변경되었습니다.</p>

          <div className="find-result">
            새 비밀번호로 로그인해 주세요.
          </div>

          <button type="button" className="find-button" onClick={() => navigate('/login')}>
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  // ---------- 입력 화면 ----------
  return (
    <div className="find-page">
      {/* form으로 감싸서 입력칸에서 Enter를 누르면 [비밀번호 변경]이 실행되게 함 */}
      <form className="find-card" onSubmit={handleSubmit} noValidate>
        <h1>비밀번호 재설정</h1>
        <p className="find-subtitle">아이디와 가입한 이메일을 입력하면 인증번호를 보내드립니다.</p>

        <label htmlFor="reset-id">아이디</label>
        <div className="find-row">
          <input
            id="reset-id"
            type="text"
            value={id}
            onChange={(e) => { setId(e.target.value); resetCodeState(); }}
            placeholder="아이디를 입력하세요"
            maxLength={20}
            autoComplete="username"
            autoFocus
          />
        </div>

        <label htmlFor="reset-email">이메일</label>
        <div className="find-row">
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); resetCodeState(); }}
            placeholder="example@email.com"
            maxLength={100}
          />
          {/* type="button" → 눌러도 폼 제출([비밀번호 변경])이 일어나지 않음 */}
          <button type="button" className="find-sub-btn" onClick={handleSendCode} disabled={sending}>
            {sending ? '발송 중...' : codeSent ? '재발송' : '인증번호 발송'}
          </button>
        </div>

        {info && <p className="find-info">{info}</p>}

        {/* 인증번호를 보낸 뒤에만 아래 입력칸들 보이기 */}
        {codeSent && (
          <>
            <label htmlFor="reset-code">인증번호</label>
            <div className="find-row">
              <input
                id="reset-code"
                type="text"
                inputMode="numeric" // 휴대폰에서 숫자 키패드
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증번호 6자리"
                maxLength={6}
              />
            </div>

            <label htmlFor="reset-new-password">새 비밀번호 (8~20자 영문+숫자)</label>
            <div className="find-row">
              <input
                id="reset-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 입력"
                maxLength={20}
                autoComplete="new-password"
              />
            </div>

            <label htmlFor="reset-confirm-password">새 비밀번호 확인</label>
            <div className="find-row">
              <input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 재입력"
                maxLength={20}
                autoComplete="new-password"
              />
            </div>
          </>
        )}

        {error && <p className="find-error" role="alert">{error}</p>}

        <button type="submit" className="find-button" disabled={!codeSent || saving}>
          {saving ? '변경 중...' : '비밀번호 변경'}
        </button>

        <div className="find-links">
          <Link to="/login">로그인</Link>
          <span aria-hidden="true">|</span>
          <Link to="/find-id">아이디 찾기</Link>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
