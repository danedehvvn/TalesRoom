import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../components/MyPageHeader";
import { getErrorMessage } from "../api/axiosInstance";
import { fetchMyInfo, updateMyInfo } from "../api/userApi";
import useAuth from "../hooks/useAuth";
import "../styles/MyPage.css";
import { isValidPassword, PASSWORD_RULE_MESSAGE } from "../utils/validators"; //비밀번호 규칙 검사·안내 문구

const EMPTY_FORM = {
  nickname: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function MyPageEditPage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    let ignore = false;

    fetchMyInfo()
      .then((info) => {
        if (ignore) return;
        setProfile(info);
        setForm((current) => ({ ...current, nickname: info.nickname }));
      })
      .catch((requestError) => {
        if (!ignore) setError(getErrorMessage(requestError, "내 정보를 불러오지 못했어요."));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const nickname = form.nickname.trim();
    const passwordRequested = Boolean(form.currentPassword || form.newPassword || form.confirmPassword);

    if (nickname.length < 2 || nickname.length > 10) {
      setError("닉네임은 2자 이상 10자 이하로 입력해 주세요.");
      return;
    }

    if (passwordRequested) {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setError("비밀번호 변경 항목을 모두 입력해 주세요.");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setError("새 비밀번호가 서로 일치하지 않습니다.");
        return;
      }
      
      if (!isValidPassword(form.newPassword)) { //utils/validators.js에서 처리(영문+숫자+특수문자)
        setError(`새 비밀번호는 ${PASSWORD_RULE_MESSAGE}`);
        return;
      }
    }

    const payload = {};
    if (nickname !== profile.nickname) payload.nickname = nickname;
    if (passwordRequested) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setError("변경할 정보를 입력해 주세요.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyInfo(payload);
      updateUser({ nickname: updated.nickname });
      navigate("/mypage", { replace: true, state: { message: "내 정보가 수정되었습니다." } });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "내 정보를 수정하지 못했어요."));
    } finally {
      setSaving(false);
    }
  };

  const initial = Array.from(profile?.nickname?.trim() || "나")[0];

  return (
    <div className="mypage-shell">
      <MyPageHeader eyebrow="MY PAGE" title="내 정보 수정" description="계정 정보를 안전하게 변경할 수 있습니다." />

      <section className="mypage-card mypage-edit-card">
        {loading ? (
          <div className="mypage-state">정보를 불러오는 중이에요.</div>
        ) : !profile ? (
          <div className="mypage-state">{error || "내 정보를 불러오지 못했어요."}</div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mypage-edit-profile">
              <span className="mypage-avatar" aria-hidden="true">{initial}</span>
              <div>
                <h2>{profile.nickname}</h2>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className="mypage-form-section">
              <h3>프로필 정보</h3>
              <label htmlFor="mypage-email">이메일 <span>(변경 불가)</span></label>
              <input id="mypage-email" value={profile.email} disabled />

              <label htmlFor="mypage-nickname">닉네임</label>
              <input id="mypage-nickname" name="nickname" value={form.nickname} onChange={handleChange} maxLength={10} autoComplete="nickname" />
            </div>

            <div className="mypage-form-section">
              <h3>비밀번호 변경</h3>
              <label htmlFor="current-password">현재 비밀번호</label>
              <input id="current-password" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} placeholder="현재 비밀번호를 입력해 주세요" autoComplete="current-password" />

              <div className="mypage-password-grid">
                <div>
                  <label htmlFor="new-password">새 비밀번호</label>
                  <input id="new-password" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="새 비밀번호" maxLength={20} autoComplete="new-password" />
                </div>
                <div>
                  <label htmlFor="confirm-password">새 비밀번호 확인</label>
                  <input id="confirm-password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="다시 입력해 주세요" maxLength={20} autoComplete="new-password" />
                </div>
              </div>
            </div>

            {error && <p className="mypage-form-error" role="alert">{error}</p>}

            <div className="mypage-form-actions">
              <button type="button" className="mypage-cancel-button" onClick={() => navigate("/mypage")}>취소</button>
              <button type="submit" className="mypage-primary-button" disabled={saving}>{saving ? "저장 중..." : "변경사항 저장"}</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export default MyPageEditPage;
