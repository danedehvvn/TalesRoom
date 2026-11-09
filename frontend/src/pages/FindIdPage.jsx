// 아이디 찾기 페이지
// 흐름: 이메일 입력 -> [인증번호 발송] -> 메일로 받은 번호 입력 -> [확인] -> 찾은 아이디 보여주기
// 백엔드: POST /api/auth/find-id/request, POST /api/auth/find-id/verify
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestFindIdCode, verifyFindIdCode } from '../api/authApi';
import '../styles/FindAccount.css';

function FindIdPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');        // 입력한 이메일
  const [code, setCode] = useState('');          // 입력한 인증번호
  const [codeSent, setCodeSent] = useState(false); // 인증번호를 보냈는지 -> true면 인증번호 입력칸이 보임
  const [foundId, setFoundId] = useState('');    // 찾은 아이디 -> 값이 있으면 결과 화면으로 바뀜
  const [info, setInfo] = useState('');          // 안내 문구 (초록)
  const [error, setError] = useState('');        // 에러 문구 (빨강)
  const [sending, setSending] = useState(false); // 발송 중인지 -> 버튼 여러 번 누르기 방지
  const [checking, setChecking] = useState(false); // 확인 중인지 -> 버튼 여러 번 누르기 방지

  // 이메일을 바꾸면 처음부터 다시 (다른 이메일로 받은 번호를 섞어 쓰지 않게)
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setCode('');
    setCodeSent(false);
    setInfo('');
  };

  // [인증번호 발송] 버튼
  const handleSendCode = async () => {
    setError('');
    setInfo('');

    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }

    setSending(true);
    try {
      const res = await requestFindIdCode(email.trim());
      setCodeSent(true);
      setCode('');
      setInfo(res.message); // '인증번호를 발송했습니다. 5분 안에 입력해 주세요.'
    } catch (err) {
      // 가입되지 않은 이메일, 30초 안에 재요청 등 → 서버 메시지를 그대로 보여줌
      setError(err.response?.data?.message || '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
  };

  // [확인] 버튼 (폼 제출) → 번호가 맞으면 아이디를 받아 옴
  const handleVerify = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 막기
    setError('');

    // 아직 번호를 안 보냈으면 Enter를 눌러도 발송부터 하도록 안내
    if (!codeSent) {
      setError('먼저 인증번호를 발송해 주세요.');
      return;
    }
    if (!code.trim()) {
      setError('인증번호를 입력해 주세요.');
      return;
    }

    setChecking(true);// 버튼 여러 번 누르기 방지

    try {
      const res = await verifyFindIdCode(email.trim(), code.trim());// 아이디 찾기 인증번호 확인
      setFoundId(res.data.id); // res.data = { id: 'user01' }
    } catch (err) {
      // 번호 틀림(남은 횟수), 만료, 5회 초과 등
      setError(err.response?.data?.message || '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      
      setChecking(false);
    }
  };

  // ---------- 결과 화면: 아이디를 찾았을 때 ----------
  if (foundId) {
    return (
      <div className="find-page">
        <div className="find-card">
          <h1>아이디 찾기</h1>
          <p className="find-subtitle">입력하신 이메일로 가입된 아이디입니다.</p>

          <div className="find-result">
            회원님의 아이디는
            <strong>{foundId}</strong>
            입니다
          </div>

          <button type="button" className="find-button" onClick={() => navigate('/login')}>
            로그인하기
          </button>

          <div className="find-links">
            <Link to="/reset-password">비밀번호 재설정</Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- 입력 화면 ----------
  return (
    <div className="find-page">
      {/* form으로 감싸서 인증번호 칸에서 Enter를 누르면 [확인]이 실행되게 함 */}
      <form className="find-card" onSubmit={handleVerify} noValidate>
        <h1>아이디 찾기</h1>
        <p className="find-subtitle">가입할 때 사용한 이메일로 인증번호를 보내드립니다.</p>

        <label htmlFor="find-email">이메일</label>
        <div className="find-row">
          <input
            id="find-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="example@email.com"
            maxLength={100}
            autoFocus
          />
          {/* type="button" → 눌러도 폼 제출([확인])이 일어나지 않음 */}
          <button type="button" className="find-sub-btn" onClick={handleSendCode} disabled={sending}>
            {sending ? '발송 중...' : codeSent ? '재발송' : '인증번호 발송'}
          </button>
        </div>

        {info && <p className="find-info">{info}</p>}

        {/* 인증번호를 보낸 뒤에만 입력칸 보이기 */}
        {codeSent && (
          <>
            <label htmlFor="find-code">인증번호</label>
            <div className="find-row">
              <input
                id="find-code"
                type="text"
                inputMode="numeric" // 휴대폰에서 숫자 키패드
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증번호 6자리"
                maxLength={6}
              />
            </div>
          </>
        )}

        {error && <p className="find-error" role="alert">{error}</p>}

        <button type="submit" className="find-button" disabled={!codeSent || checking}>
          {checking ? '확인 중...' : '아이디 찾기'}
        </button>

        <div className="find-links">
          <Link to="/login">로그인</Link>
          <span aria-hidden="true">|</span>
          <Link to="/reset-password">비밀번호 재설정</Link>
        </div>
      </form>
    </div>
  );
}

export default FindIdPage;
