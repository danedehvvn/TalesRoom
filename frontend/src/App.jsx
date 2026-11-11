import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Layout from './components/Layout';
import ThemeExplorePage from './pages/ThemeExplorePage';
import ThemeDetailPage from './pages/ThemeDetailPage';
import ThemeFormPage from './pages/ThemeFormPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import FindIdPage from './pages/FindIdPage'; //아이디 찾기 화면
import ResetPasswordPage from './pages/ResetPasswordPage'; //비밀번호 재설정 화면
import PostDetailPage from './pages/PostDetailPage';
import PostListPage from './pages/PostListPage'; // 커뮤니티 목록 (P-01)
import PostFormPage from './pages/PostFormPage'; // 글쓰기·글 수정 (P-03, P-04)
import AdminUsersPage from './pages/AdminUsersPage'; // 관리자 회원 목록 (M-04)
import RequireAuth from './components/RequireAuth';
import MyPagePage from './pages/MyPagePage';
import MyPageEditPage from './pages/MyPageEditPage';
import MyPostsPage from './pages/MyPostsPage';
import MyCommentsPage from './pages/MyCommentsPage';
import RecruitmentListPage from './pages/RecruitmentListPage';
import RecruitmentDetailPage from './pages/RecruitmentDetailPage'; // 모집 상세 (R-03~R-07)
import RecruitmentFormPage from './pages/RecruitmentFormPage'; // 모집글 쓰기 (R-01)
import PartyListPage from './pages/PartyListPage'; // 내 파티 목록 (PT-01)
import PartyDetailPage from './pages/PartyDetailPage'; // 파티 상세·대화 (PT-02, PT-03)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/themes" element={<ThemeExplorePage />} />
            <Route path="/themes/new" element={<ThemeFormPage key="new" />} />
            <Route path="/themes/:id" element={<ThemeDetailPage />} />
            <Route path="/themes/:id/edit" element={<ThemeFormPage key="edit" />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            {/* 커뮤니티: 같은 PostFormPage를 주소에 :id가 있는지로 작성/수정 구분 */}
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/recruitment" element={<RecruitmentListPage />} />
            {/* 모집 상세는 비로그인도 볼 수 있음 (신청·승인 버튼은 화면이 로그인 상태에 따라 표시) */}
            <Route path="/recruitment/:id" element={<RecruitmentDetailPage />} />
            <Route path="/posts/new" element={<PostFormPage key="new" />} />
            <Route path="/posts/:id/edit" element={<PostFormPage key="edit" />} />
            
            {/* 관리자: 화면에서 role을 확인하고, 서버도 adminMiddleware로 한 번 더 막아요 */}
            <Route path="/admin/users" element={<AdminUsersPage />} />


          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* 아이디 찾기 (로그인 화면의 '아이디 찾기' 링크가 이 주소로 이동) */}
          <Route path="/find-id" element={<FindIdPage />} />
          {/* 비밀번호 재설정 (로그인 화면, 아이디 찾기 결과 화면의 '비밀번호 재설정' 링크가 이 주소로 이동) */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* 마이페이지 관련 인증 보호 라우트 */}
            <Route element={<RequireAuth />}>
              <Route path="/mypage" element={<MyPagePage />} />
              <Route path="/mypage/edit" element={<MyPageEditPage />} />
              <Route path="/mypage/posts" element={<MyPostsPage />} />
              <Route path="/mypage/comments" element={<MyCommentsPage />} />
              {/* 로그인이 필요한 모집·파티 화면 (RequireAuth = 비로그인이면 로그인 화면으로) */}
              <Route path="/recruitment/new" element={<RecruitmentFormPage />} />
              <Route path="/parties" element={<PartyListPage />} />
              <Route path="/parties/:id" element={<PartyDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
